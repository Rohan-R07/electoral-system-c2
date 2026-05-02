const CONFIG = {
    BASE_URL: (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
              ? "http://127.0.0.1:8000" 
              : "https://election-backend-882610711158.asia-south1.run.app",
    TIMEOUT: 20000
};

// In-memory cache for efficiency
const apiCache = new Map();

/**
 * Enhanced Fetch Wrapper with Data Unwrapping and Error Handling
 */
async function secureFetch(endpoint, data, allowCache = true) {
    const cacheKey = `${endpoint}:${JSON.stringify(data)}`;
    
    if (allowCache && apiCache.has(cacheKey)) {
        return apiCache.get(cacheKey);
    }

    const url = `${CONFIG.BASE_URL}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.message || responseData.detail || `Server error: ${res.status}`);
        }

        if (responseData.status === "success" && responseData.data) {
            const result = responseData.data;
            if (allowCache) apiCache.set(cacheKey, result);
            return result;
        }

        if (allowCache) apiCache.set(cacheKey, responseData);
        return responseData;

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') throw new Error("Request timed out. Please try again.");
        console.error(`❌ API Error (${endpoint}):`, error);
        throw error;
    }
}

/**
 * Fetches simulation steps
 */
async function getSteps(context) {
    try {
        const data = await secureFetch("/steps", { text: context || "" });
        return data?.steps || [];
    } catch (err) {
        console.error("getSteps failed:", err);
        return [];
    }
}

async function getExplain(text) {
    try {
        const data = await secureFetch("/explain", { text: text || "" });
        return data?.explanation || [];
    } catch (err) {
        console.error("getExplain failed:", err);
        return [];
    }
}

async function getChat(text) {
    try {
        const data = await secureFetch("/chat", { text: text || "" }, false);
        return data?.reply || "I'm sorry, I'm having trouble thinking right now.";
    } catch (err) {
        console.error("getChat failed:", err);
        return "I'm sorry, I'm having trouble thinking right now.";
    }
}

// Global scope access
window.getSteps = getSteps;
window.getExplain = getExplain;
window.getChat = getChat;

console.log("API functions attached:", typeof getSteps);
