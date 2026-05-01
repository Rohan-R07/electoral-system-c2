const CONFIG = {
    BASE_URL: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" 
              ? "http://127.0.0.1:8000" 
              : "https://election-backend-882610711158.asia-south1.run.app",
    TIMEOUT: 20000 // Increased timeout for production cold starts
};

/**
 * Enhanced Fetch Wrapper with Timeout and Data Unwrapping
 */
async function secureFetch(endpoint, data) {
    const url = `${CONFIG.BASE_URL}${endpoint}`;
    console.log("🚀 Sending request to:", url);

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
        console.log(`✅ API DATA (${endpoint}):`, responseData);

        if (!res.ok) {
            throw new Error(responseData.message || responseData.detail || `Server error: ${res.status}`);
        }

        // Unwrap response: return 'data' object if status is 'success'
        return responseData.status === "success" ? responseData.data : responseData;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') throw new Error("Server took too long to respond. Please try again.");
        console.error(`❌ API Error (${endpoint}):`, error);
        throw new Error("Server unavailable, please try again later.");
    }
}

export async function getSteps(context) {
    const data = await secureFetch("/steps", { text: context });
    return data?.steps || [];
}

export async function getExplain(text) {
    const data = await secureFetch("/explain", { text });
    return data?.explanation || [];
}

export async function getChat(text) {
    const data = await secureFetch("/chat", { text });
    return data?.reply || "I'm sorry, I'm having trouble thinking right now.";
}
