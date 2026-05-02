console.log("test.js loaded successfully");

const TEST_CONFIG = {
    LATENCY_THRESHOLD: 12000, // 12s for heavy AI tasks
    RETRY_DELAY: 500
};

function report(name, status, message = "", time = 0) {
    const icon = status === "PASS" ? "✅" : (status === "FAIL" ? "❌" : "⚠️");
    console.log(`${icon} [${status}] ${name} ${time ? `(${time.toFixed(0)}ms)` : ""}`);
    if (status === "FAIL") console.error(`   └─ Error: ${message}`);
}

async function validateSteps() {
    const start = performance.now();
    try {
        const steps = await window.getSteps("Registering a new voter in Mumbai");
        const duration = performance.now() - start;
        const isValid = Array.isArray(steps) && steps.length > 0;
        report("Steps API Integrity", isValid ? "PASS" : "FAIL", "Invalid array format", duration);
        return isValid;
    } catch (e) {
        report("Steps API Integrity", "FAIL", e.message);
        return false;
    }
}

async function validateExplain() {
    const start = performance.now();
    try {
        const exp = await window.getExplain("VVPAT Verification");
        const duration = performance.now() - start;
        const isValid = Array.isArray(exp) && exp.length > 0;
        report("Explain API Integrity", isValid ? "PASS" : "FAIL", "Explanation expected as array", duration);
        return isValid;
    } catch (e) {
        report("Explain API Integrity", "FAIL", e.message);
        return false;
    }
}

async function validateChat() {
    const start = performance.now();
    try {
        const reply = await window.getChat("How can I check my name in the roll?");
        const duration = performance.now() - start;
        const isValid = typeof reply === "string" && reply.trim().length > 0;
        report("Chat API Integrity", isValid ? "PASS" : "FAIL", "Chat reply expected as string", duration);
        return isValid;
    } catch (e) {
        report("Chat API Integrity", "FAIL", e.message);
        return false;
    }
}

async function validateEdgeCases() {
    console.group("🧪 Edge Case & Robustness Audit");

    // Case 1: Empty String
    try {
        await window.getChat("");
        report("Empty Input Handling", "PASS", "Graceful fallback");
    } catch {
        report("Empty Input Handling", "FAIL", "System crashed on empty input");
    }

    // Case 2: Null Input
    try {
        await window.getSteps(null);
        report("Null Context Resilience", "PASS", "Safe default used");
    } catch {
        report("Null Context Resilience", "FAIL", "System crashed on null");
    }

    console.groupEnd();
}

async function runAllTests() {
    console.log("%c🚀 Starting Final System Audit...", "color: #6366f1; font-weight: bold; font-size: 1.1rem;");
    console.log("Environment:", window.location.hostname);
    console.log("Timestamp:", new Date().toLocaleTimeString());
    console.log("-------------------------------------------");

    let totalPassed = 0;
    if (await validateSteps()) totalPassed++;
    await new Promise(r => setTimeout(r, TEST_CONFIG.RETRY_DELAY));
    
    if (await validateExplain()) totalPassed++;
    await new Promise(r => setTimeout(r, TEST_CONFIG.RETRY_DELAY));

    if (await validateChat()) totalPassed++;

    await validateEdgeCases();

    console.log("-------------------------------------------");
    console.log(`🏁 Audit Complete. Core Modules Passed: ${totalPassed}/3`);

    if (window.logUserAction) {
        window.logUserAction("final_audit_complete", { score: totalPassed });
    }
}

// Global scope access
window.runAllTests = runAllTests;
window.runFullAudit = runAllTests;
