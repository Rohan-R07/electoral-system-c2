const CONFIG = {
    BASE_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
              ? "http://127.0.0.1:8000" 
              : "https://your-production-api.com", // Should be configured for Google Cloud Run
    TIMEOUT: 15000 // 15 seconds
};

/**
 * Enhanced Fetch Wrapper with Timeout and Error Handling
 */
async function secureFetch(endpoint, data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const res = await fetch(`${CONFIG.BASE_URL}${endpoint}`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({ detail: "Unknown error" }));
            throw new Error(errorBody.detail || `Server returned ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error("Request timed out. Please try again.");
        }
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

export async function getSteps(context) {
    const data = await secureFetch("/steps", { text: context });
    return data.steps;
}

export async function getExplain(text) {
    const data = await secureFetch("/explain", { text });
    return data.explanation;
}

export async function getChat(text) {
    const data = await secureFetch("/chat", { text });
    return data.reply;
}
