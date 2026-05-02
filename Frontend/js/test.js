/**
 * Election Learning Assistant - Production Audit Suite
 * 
 * This module performs a real-time health check of the system's core APIs.
 * It visualizes results in a dedicated UI modal for transparent verification.
 */

const auditUI = {
    overlay: document.getElementById('audit-overlay'),
    logs: document.getElementById('audit-logs'),
    summary: document.getElementById('audit-summary'),
    metrics: document.getElementById('summary-metrics')
};

/**
 * Utility: Adds a log entry to the Audit Modal
 */
function addAuditLog(message, type = "info") {
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;

    let icon = "•";
    if (type === "success") icon = "✔";
    if (type === "error") icon = "✖";
    if (type === "info") icon = "ℹ";

    entry.innerText = `${icon} ${message}`;
    auditUI.logs.appendChild(entry);
    auditUI.logs.scrollTop = auditUI.logs.scrollHeight;

    // Also log to console for development
    if (type === "error") console.error(`Audit: ${message}`);
    else console.log(`Audit: ${message}`);
}

/**
 * 1. TEST: /steps logic (Positive & Integrity)
 */
async function auditStepsAPI() {
    addAuditLog("Testing Steps API (First-time voter scenario)...");
    const start = performance.now();
    try {
        const steps = await window.getSteps("Registering as a new voter");
        const duration = performance.now() - start;

        const isValid = Array.isArray(steps) && steps.length > 0;
        if (!isValid) throw new Error("Returned malformed steps data.");

        addAuditLog(`Steps API: PASSED (${duration.toFixed(0)}ms)`, "success");
        return { success: true, time: duration };
    } catch (e) {
        addAuditLog(`Steps API: FAILED - ${e.message}`, "error");
        return { success: false };
    }
}

/**
 * 2. TEST: /explain logic (Positive & Integrity)
 */
async function auditExplainAPI() {
    addAuditLog("Testing Explain API (Concept validation)...");
    const start = performance.now();
    try {
        const explanation = await window.getExplain("EVM and VVPAT");
        const duration = performance.now() - start;

        const isValid = Array.isArray(explanation) && explanation.length > 0;
        if (!isValid) throw new Error("Explanation payload is invalid.");

        addAuditLog(`Explain API: PASSED (${duration.toFixed(0)}ms)`, "success");
        return { success: true, time: duration };
    } catch (e) {
        addAuditLog(`Explain API: FAILED - ${e.message}`, "error");
        return { success: false };
    }
}

/**
 * 3. TEST: /chat logic (Engagement validation)
 */
async function auditChatAPI() {
    addAuditLog("Testing Chat Assistant (Interactive query)...");
    const start = performance.now();
    try {
        const reply = await window.getChat("How do I find my booth?");
        const duration = performance.now() - start;

        const isValid = typeof reply === "string" && reply.length > 5;
        if (!isValid) throw new Error("Chat reply is too short or empty.");

        addAuditLog(`Chat API: PASSED (${duration.toFixed(0)}ms)`, "success");
        return { success: true, time: duration };
    } catch (e) {
        addAuditLog(`Chat API: FAILED - ${e.message}`, "error");
        return { success: false };
    }
}

/**
 * 4. TEST: Edge Case resilience
 */
async function auditRobustness() {
    addAuditLog("Testing Robustness (Empty/Invalid inputs)...");
    try {
        // These should not crash the frontend due to our safeFetch logic
        await window.getChat("");
        await window.getSteps(null);
        addAuditLog("Robustness: HANDLED (No crashes detected)", "success");
        return true;
    } catch (e) {
        addAuditLog("Robustness: FAILED", "error");
        return false;
    }
}

/**
 * MASTER RUNNER
 */
async function runFullAudit() {
    // 1. Prepare UI
    const host = window.location.hostname;

    auditUI.overlay.style.display = 'flex';
    auditUI.logs.innerHTML = "";
    auditUI.summary.style.display = 'none';

    addAuditLog("Starting System Health Check...", "info");
    addAuditLog(`Environment: ${window.location.hostname}`, "info");
    addAuditLog("---------------------------------", "info");

    let score = 0;
    const results = [];

    // Run tests with slight delays for visual pacing
    results.push(await auditStepsAPI());
    await new Promise(r => setTimeout(r, 800));

    results.push(await auditExplainAPI());
    await new Promise(r => setTimeout(r, 800));

    results.push(await auditChatAPI());
    await new Promise(r => setTimeout(r, 800));

    const robustnessOk = await auditRobustness();

    // Calculate Score
    score = results.filter(r => r.success).length;
    const avgTime = results.reduce((acc, r) => acc + (r.time || 0), 0) / score;

    // 2. Show Summary
    addAuditLog("---------------------------------", "info");
    addAuditLog("Audit Sequence Finalized.");

    auditUI.summary.style.display = 'block';
    auditUI.metrics.innerText = `Final Score: ${score}/3 APIs | Latency: ${avgTime.toFixed(0)}ms | Edge Cases: ${robustnessOk ? 'OK' : 'ERR'}`;

    // Log final audit completion to telemetry
    if (window.logUserAction) {
        window.logUserAction('system_audit_complete', { score, latency: avgTime });
    }
}

// Attach to window for global access
window.runAllTests = runFullAudit;
window.runFullAudit = runFullAudit;
console.log("✅ test.js loaded successfully");
