/**
 * Election Learning Assistant - Chat Module
 * 
 * Manages the AI mentor conversation UI and typing animations.
 */

// DOM Elements
const chatElements = {
    inputField: document.getElementById("chat-input"),
    sendButton: document.getElementById("chat-send"),
    messageBox: document.getElementById("chat-messages")
};

/**
 * Debounce helper to prevent rapid API spamming
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handles the logic for sending a user message
 */
async function processUserMessage() {
    const text = chatElements.inputField.value.trim();
    if (!text || chatElements.sendButton.disabled) return;

    // UI Feedback
    chatElements.inputField.value = "";
    chatElements.sendButton.disabled = true;
    console.log("Chat: Requesting response for ->", text);

    // 1. Render User Message
    addMessage(text, "user");

    // 2. Render temporary "Thinking..." bubble
    const typingIndicatorId = addMessage("Thinking...", "ai typing-indicator");

    try {
        // 3. Fetch from Backend (Global API function)
        const response = await window.getChat(text);

        // 4. Remove indicator and add final AI message
        removeMessage(typingIndicatorId);
        const aiMessageId = addMessage("", "ai");
        
        // 5. Trigger Typing Effect
        await typeMessage(aiMessageId, response);

        if (window.logUserAction) {
            window.logUserAction('chat_query', { length: text.length });
        }

    } catch (error) {
        console.error("Chat Error:", error);
        removeMessage(typingIndicatorId);
        addMessage("The AI mentor is temporarily busy. Please try again in a few seconds.", "ai error");
    } finally {
        chatElements.sendButton.disabled = false;
        chatElements.inputField.focus();
    }
}

// Event Bindings with Debounce
const debouncedSendMessage = debounce(processUserMessage, 300);

document.addEventListener("DOMContentLoaded", () => {
    if (chatElements.sendButton) {
        chatElements.sendButton.onclick = debouncedSendMessage;
    }
    if (chatElements.inputField) {
        chatElements.inputField.onkeypress = (e) => { 
            if (e.key === "Enter") debouncedSendMessage(); 
        };
    }
});

/**
 * Creates and appends a message bubble
 */
function addMessage(text, type) {
    const id = "msg-" + Math.random().toString(36).substr(2, 9);
    
    const wrapper = document.createElement("div");
    wrapper.className = `msg-wrapper ${type}`;
    wrapper.id = "wrapper-" + id;
    
    const bubble = document.createElement("div");
    bubble.className = `msg-bubble ${type}`;
    bubble.id = id;
    bubble.innerHTML = text.replace(/\n/g, "<br>");

    wrapper.appendChild(bubble);
    chatElements.messageBox.appendChild(wrapper);
    
    chatElements.messageBox.scrollTop = chatElements.messageBox.scrollHeight;
    return id;
}

/**
 * Removes a specific bubble (indicator)
 */
function removeMessage(id) {
    const wrapper = document.getElementById("wrapper-" + id);
    if (wrapper) wrapper.remove();
}

/**
 * Types text character-by-character into a bubble
 */
async function typeMessage(id, text) {
    const element = document.getElementById(id);
    if (!element) return;

    element.innerHTML = "";
    element.classList.add('typing');

    return new Promise(resolve => {
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                const char = text[i];
                element.innerHTML += (char === "\n") ? "<br>" : char;
                i++;
                chatElements.messageBox.scrollTop = chatElements.messageBox.scrollHeight;
            } else {
                clearInterval(interval);
                element.classList.remove('typing');
                resolve();
            }
        }, 20);
    });
}

// Global scope access
window.chat = {
    addMessage,
    typeMessage
};
