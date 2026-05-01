const CONFIG = {
    BASE_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
              ? "http://127.0.0.1:8000" 
              : "https://your-production-api.com",
    TIMEOUT: 15000
};

/**
 * Enhanced Fetch Wrapper with Timeout and Data Unwrapping
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

        const responseData = await res.json();

        if (!res.ok) {
            throw new Error(responseData.message || responseData.detail || `Server returned ${res.status}`);
        }

        // Production Backend returns { "status": "success", "data": { ... } }
        // We unwrap the data field for convenience in the logic layer
        return responseData.status === "success" ? responseData.data : responseData;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') throw new Error("Request timed out. Please try again.");
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
    // Handles both { "reply": "..." } and { "data": { "reply": "..." } } thanks to unwrap
    return data.reply;
}
