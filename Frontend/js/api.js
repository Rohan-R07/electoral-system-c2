const CONFIG = {
    // 🔥 Directly use deployed backend
    BASE_URL: "https://election-backend-882610711158.asia-south1.run.app",
    TIMEOUT: 20000 // 20 seconds
};

/**
 * Clean Fetch Wrapper
 */
async function secureFetch(endpoint, data) {
    const url = `${CONFIG.BASE_URL}${endpoint}`;
    console.log("🚀 Sending request to:", url, data);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT);

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        const responseData = await res.json();
        console.log("✅ Response:", responseData);

        if (!res.ok) {
            throw new Error(`Server error: ${res.status}`);
        }

        // ✅ unwrap backend response
        return responseData?.data || responseData;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === "AbortError") {
            throw new Error("Server is slow, try again.");
        }

        console.error("❌ API Error:", error);
        throw new Error("Backend not responding.");
    }
}

/**
 * Get Steps
 */
export async function getSteps(context) {
    try {
        const data = await secureFetch("/steps", { text: context });

        console.log("🧠 Steps Data:", data);

        // handle both formats safely
        return data?.steps || data?.data?.steps || [];
    } catch (error) {
        console.error("❌ getSteps error:", error);
        return [];
    }
}

/**
 * Get Explanation
 */
export async function getExplain(text) {
    try {
        const data = await secureFetch("/explain", { text });

        console.log("🧠 Explanation Data:", data);

        // handle both formats safely
        return data?.explanation || data?.data?.explanation || "Couldn't generate explanation.";
    } catch (error) {
        console.error("❌ getExplain error:", error);
        return "AI is unavailable right now.";
    }
}

/**
 * Get Chat Reply
 */
export async function getChat(text) {
    try {
        const data = await secureFetch("/chat", { text });
        console.log("CHAT DATA:", data);
        return data?.reply || "No response from AI.";
    } catch (err) {
        console.error("CHAT ERROR:", err);
        return "AI is unavailable, please try again.";
    }
}