/**
 * Election Learning Assistant - Production API Test Suite
 * Performs strict validation and performance benchmarking.
 */

import { getSteps, getExplain, getChat } from "./api.js";

const TEST_CONFIG = {
    LATENCY_THRESHOLD: 10000, // 10s max for AI inference
    RETRY_DELAY: 500
};

/**
 * Utility: Structured Logging
 */
function report(name, status, details = {}, time = 0) {
    const icon = status === "PASS" ? "✅" : (status === "FAIL" ? "❌" : "⚠️");
    console.log(`${icon} [${status}] ${name} ${time ? `(${time.toFixed(0)}ms)` : ""}`);
    if (status === "FAIL") console.error("   └─ Error:", details);
}

/**
 * 1. TEST: /steps logic (Positive & Type Check)
 */
async function validateSteps() {
    const start = performance.now();
    try {
        const steps = await getSteps("Registering via App");
        const duration = performance.now() - start;
        
        const isArray = Array.isArray(steps);
        const hasContent = steps.length > 0;
        
        if (isArray && hasContent) {
            report("Steps API Integrity", "PASS", {}, duration);
            return true;
        }
        throw new Error(`Invalid format. Expected non-empty array, got: ${typeof steps}`);
    } catch (e) {
        report("Steps API Integrity", "FAIL", e.message);
        return false;
    }
}

/**
 * 2. TEST: /explain logic (Positive & Type Check)
 */
async function validateExplain() {
    const start = performance.now();
    try {
        const exp = await getExplain("Voter ID Correction");
        const duration = performance.now() - start;

        if (Array.isArray(exp) && exp.length > 0) {
            report("Explain API Integrity", "PASS", {}, duration);
            return true;
        }
        throw new Error("Response is not a valid explanation array");
    } catch (e) {
        report("Explain API Integrity", "FAIL", e.message);
        return false;
    }
}

/**
 * 3. TEST: /chat logic (Positive & Type Check)
 */
async function validateChat() {
    const start = performance.now();
    try {
        const reply = await getChat("Hello mentor");
        const duration = performance.now() - start;

        if (typeof reply === "string" && reply.trim().length > 0) {
            report("Chat API Integrity", "PASS", {}, duration);
            return true;
        }
        throw new Error("Chat reply is empty or not a string");
    } catch (e) {
        report("Chat API Integrity", "FAIL", e.message);
        return false;
    }
}

/**
 * 4. TEST: Edge Cases & Robustness
 */
async function validateEdgeCases() {
    console.group("🧪 Robustness & Edge Cases");

    // Case: Empty Input
    try {
        const res = await getChat("");
        report("Empty Chat Input", "PASS", "Graceful fallback");
    } catch (e) {
        report("Empty Chat Input", "FAIL", e.message);
    }

    // Case: Null Input
    try {
        const res = await getSteps(null);
        report("Null Steps Context", "PASS", "Resilient to null");
    } catch (e) {
        report("Null Steps Context", "FAIL", e.message);
    }

    // Case: Extremely long input (Overflow Test)
    try {
        const longText = "Voter ".repeat(100);
        await getExplain(longText);
        report("Long Input Handling", "PASS", "Handled without crash");
    } catch (e) {
        report("Long Input Handling", "FAIL", e.message);
    }

    console.groupEnd();
}

/**
 * MASTER RUNNER
 */
export async function runFullAudit() {
    console.log("%c🚀 Starting Production System Audit...", "color: #818cf8; font-weight: bold; font-size: 1.2rem;");
    console.log("Environment:", window.location.hostname);
    console.log("Timestamp:", new Date().toLocaleTimeString());
    console.log("-------------------------------------------");

    let score = 0;
    if (await validateSteps()) score++;
    await new Promise(r => setTimeout(r, TEST_CONFIG.RETRY_DELAY));
    
    if (await validateExplain()) score++;
    await new Promise(r => setTimeout(r, TEST_CONFIG.RETRY_DELAY));

    if (await validateChat()) score++;

    await validateEdgeCases();

    console.log("-------------------------------------------");
    console.log(`🏁 Audit Complete. Core System Score: ${score}/3`);
    
    if (window.logUserAction) {
        window.logUserAction("test_audit_completed", { score });
    }
}

window.runAllTests = runFullAudit; // Backward compatibility
window.runFullAudit = runFullAudit;
