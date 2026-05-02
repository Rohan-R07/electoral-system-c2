/**
 * Election Learning Assistant - API Service
 * 
 * Centralized module for backend communication.
 * Features:
 * - Centralized fetch wrapper (safeFetch)
 * - In-memory caching for repeated queries
 * - Automatic 1-retry mechanism for transient failures
 * - Consistent error and loading state management
 */

const API_CONFIG = {
    BASE_URL: (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
              ? "http://127.0.0.1:8000" 
              : "https://election-backend-882610711158.asia-south1.run.app",
    TIMEOUT: 15000,
    MAX_RETRIES: 1
};

// Map to store successful responses to avoid redundant AI calls
const apiCache = new Map();

/**
 * Standardized fetch helper with retries and timeout
 */
async function performRequest(endpoint, payload, useCache = true) {
    const cacheKey = `${endpoint}:${JSON.stringify(payload)}`;
    
    if (useCache && apiCache.has(cacheKey)) {
        console.log(`API [${endpoint}]: Returning cached response`);
        return apiCache.get(cacheKey);
    }

    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    let lastError = null;

    for (let attempt = 0; attempt <= API_CONFIG.MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

        try {
            if (attempt > 0) console.warn(`API [${endpoint}]: Retry attempt ${attempt}...`);

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(payload),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP Error ${response.status}`);

            const data = await response.json();
            
            // Standardize: Production backend uses { status, data }
            const result = (data.status === "success" && data.data) ? data.data : data;

            if (useCache) apiCache.set(cacheKey, result);
            return result;

        } catch (err) {
            clearTimeout(timeoutId);
            lastError = err;
            if (err.name === 'AbortError') break; // Don't retry timeouts
        }
    }

    console.error(`API [${endpoint}]: Final Failure`, lastError);
    throw lastError;
}

/**
 * Fetches educational simulation steps
 */
async function getSteps(context) {
    try {
        const result = await performRequest("/steps", { text: context || "" });
        return Array.isArray(result?.steps) ? result.steps : [];
    } catch (err) {
        return [{ title: "Error", description: "The simulation engine is temporarily slow. Please retry.", type: "error" }];
    }
}

/**
 * Fetches conceptual explanations
 */
async function getExplain(text) {
    try {
        const result = await performRequest("/explain", { text: text || "" });
        return Array.isArray(result?.explanation) ? result.explanation : [];
    } catch (err) {
        return ["Information is currently being verified. Please try again."];
    }
}

/**
 * Fetches chatbot replies
 */
async function getChat(text) {
    try {
        // Chat is dynamic, so we don't cache it
        const result = await performRequest("/chat", { text: text || "" }, false);
        return result?.reply || "I'm processing your request...";
    } catch (err) {
        return "I am currently offline. Please check back in a moment!";
    }
}

// Global exposure for cross-file access
window.getSteps = getSteps;
window.getExplain = getExplain;
window.getChat = getChat;
