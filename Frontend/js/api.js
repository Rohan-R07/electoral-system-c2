const CONFIG = {
    BASE_URL: (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
              ? "http://127.0.0.1:8000" 
              : "https://election-backend-882610711158.asia-south1.run.app",
    TIMEOUT: 15000,
    MAX_RETRIES: 1
};

// In-memory cache for efficiency
const apiCache = new Map();

/**
 * Enhanced Fetch Wrapper: 
 * Implements Caching, Retries, Timeout, and Data Unwrapping
 */
async function secureFetch(endpoint, data, allowCache = true) {
    const cacheKey = `${endpoint}:${JSON.stringify(data)}`;
    
    // 1. Cache Hit
    if (allowCache && apiCache.has(cacheKey)) {
        console.log(`💡 [API Cache] Hit: ${endpoint}`);
        return apiCache.get(cacheKey);
    }

    const url = `${CONFIG.BASE_URL}${endpoint}`;
    let lastError = null;

    // 2. Retry Loop
    for (let attempt = 0; attempt <= CONFIG.MAX_RETRIES; attempt++) {
        if (attempt > 0) console.warn(`🔄 [API Retry] Attempt ${attempt} for ${endpoint}`);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!res.ok) throw new Error(`Server returned ${res.status}`);

            const responseData = await res.json();
            
            // Unwrap production response
            const result = (responseData.status === "success" && responseData.data) 
                         ? responseData.data 
                         : responseData;

            // Save to cache
            if (allowCache) apiCache.set(cacheKey, result);
            return result;

        } catch (error) {
            clearTimeout(timeoutId);
            lastError = error;
            
            // Only retry on network errors or timeouts
            if (error.name !== 'AbortError' && attempt < CONFIG.MAX_RETRIES) {
                await new Promise(r => setTimeout(r, 1000)); // Short wait before retry
                continue;
            }
            break;
        }
    }

    console.error(`❌ [API Final Failure] ${endpoint}:`, lastError);
    throw new Error("AI Service unavailable. Please try again later.");
}

export async function getSteps(context) {
    try {
        const data = await secureFetch("/steps", { text: context });
        return Array.isArray(data?.steps) ? data.steps : [];
    } catch { return ["Official portal access", "Registration setup", "Information verification"]; }
}

export async function getExplain(text) {
    try {
        const data = await secureFetch("/explain", { text });
        return Array.isArray(data?.explanation) ? data.explanation : [];
    } catch { return ["Verified process step", "Ensures compliance"]; }
}

export async function getChat(text) {
    try {
        const data = await secureFetch("/chat", { text }, false); // Don't cache chat
        return data?.reply || "I'm sorry, I'm having trouble responding right now.";
    } catch { return "I am currently offline. Please check back in a moment!"; }
}
