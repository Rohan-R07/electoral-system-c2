import { getChat } from "./api.js";

const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("chat-send");
const chatBox = document.getElementById("chat-messages");

/**
 * Main function to handle user message sending
 */
const sendMessage = async () => {
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
        // 4. Fetch from Backend
        const response = await getChat(text);
        console.log("Chat: Received response ->", response);

        // Telemetry: Chat Used
        if (window.logUserAction) {
            window.logUserAction('chat_used', { queryLength: text.length });
        }

        // 5. Remove indicator and add actual response
        removeMessage(typingId);
        const aiMsgId = addMessage("", "ai");
        
        // 6. Typing Effect
        await typeMessage(aiMsgId, response);

    } catch (error) {
        console.error("Chat Error:", error);
        removeMessage(typingId);
        const errorId = addMessage("AI is unavailable, please try again.", "ai error");
    } finally {
        sendBtn.disabled = false;
        input.focus();
    }
};

// Event Listeners
sendBtn.onclick = sendMessage;
input.onkeypress = (e) => { 
    if (e.key === "Enter") sendMessage(); 
};

/**
 * DOM Helper: Add a message bubble
 */
export function addMessage(text, type) {
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
export function removeMessage(id) {
    const wrapper = document.getElementById("wrapper-" + id);
    if (wrapper) wrapper.remove();
}

/**
 * Effect: Character-by-character rendering
 */
export async function typeMessage(id, text) {
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
