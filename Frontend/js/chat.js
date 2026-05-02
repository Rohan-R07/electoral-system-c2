/**
 * Main function to handle user message sending
 */
const sendMessage = async () => {
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    // 1. UI Reset
    input.value = "";
    sendBtn.disabled = true;
    console.log("Chat: Sending message ->", text);

    // 2. Add User Bubble
    addMessage(text, "user");

    // 3. Add temporary "Thinking..." bubble
    const typingId = addMessage("Thinking...", "ai typing-indicator");

    try {
        // 4. Fetch from Backend (Global function)
        const response = await window.getChat(text);
        console.log("Chat: Received response ->", response);

        // Telemetry: Chat Used
        if (window.logUserAction) {
            window.logUserAction('chat_used', { queryLength: text.length });
        }

        // 5. Remove indicator and add actual response
        removeMessage(typingId);
        const aiMsgId = addMessage("", "ai");
        
        // 6. Typing Effect (Global anim)
        await typeMessage(aiMsgId, response);

    } catch (error) {
        console.error("Chat Error:", error);
        removeMessage(typingId);
        addMessage("AI is unavailable, please try again.", "ai error");
    } finally {
        sendBtn.disabled = false;
        input.focus();
    }
};

/**
 * DOM Helper: Add a message bubble
 */
function addMessage(text, type) {
    const chatBox = document.getElementById("chat-messages");
    const id = "msg-" + Math.random().toString(36).substr(2, 9);
    
    const wrapper = document.createElement("div");
    wrapper.className = `msg-wrapper ${type}`;
    wrapper.id = "wrapper-" + id;
    
    const bubble = document.createElement("div");
    bubble.className = `msg-bubble ${type}`;
    bubble.id = id;
    // Basic formatting for non-typed messages (errors/thinking)
    bubble.innerHTML = text.replace(/\n/g, "<br>");

    wrapper.appendChild(bubble);
    chatBox.appendChild(wrapper);
    
    chatBox.scrollTop = chatBox.scrollHeight;
    return id;
}

/**
 * DOM Helper: Remove a specific message
 */
function removeMessage(id) {
    const wrapper = document.getElementById("wrapper-" + id);
    if (wrapper) wrapper.remove();
}

/**
 * Effect: Character-by-character rendering
 */
async function typeMessage(id, text) {
    const chatBox = document.getElementById("chat-messages");
    const element = document.getElementById(id);
    if (!element) return;

    element.innerHTML = "";
    element.classList.add('typing');

    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                const char = text[i];
                if (char === "\n") {
                    element.innerHTML += "<br>";
                } else {
                    element.innerHTML += char;
                }
                i++;
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                clearInterval(interval);
                element.classList.remove('typing');
                resolve();
            }
        }, 20);
    });
}

// Setup listeners when script loads
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    
    if (sendBtn) sendBtn.onclick = sendMessage;
    if (input) {
        input.onkeypress = (e) => { 
            if (e.key === "Enter") sendMessage(); 
        };
    }
});

// Global scope access
window.chat = {
    addMessage,
    typeMessage
};
