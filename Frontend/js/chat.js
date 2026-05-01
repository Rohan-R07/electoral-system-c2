import { getChat } from "./api.js";

const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");
const box = document.getElementById("chat-messages");

/**
 * Escapes HTML to prevent XSS
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Debounce function to prevent spamming
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

const sendMessage = async () => {
    const text = input.value.trim();
    if (!text || text.length > 500) return;

    // 1. Add User Message (Sanitized)
    addMessage(escapeHTML(text), "user");
    input.value = "";

    // 2. Add Typing Indicator
    const typingId = addMessage("...", "ai typing-indicator");

    try {
        const response = await getChat(text);
        removeMessage(typingId);
        
        // 3. Add AI Response
        const aiMsgId = addMessage("", "ai");
        await typeMessage(aiMsgId, response);
    } catch (error) {
        removeMessage(typingId);
        const errorId = addMessage("", "ai error");
        await typeMessage(errorId, "I'm having some trouble connecting. Please try again!");
    }
};

// Use debounced send to avoid rapid multiple clicks
const debouncedSend = debounce(sendMessage, 300);

send.onclick = debouncedSend;
input.onkeypress = (e) => { 
    if (e.key === "Enter") debouncedSend(); 
};

export function addMessage(text, type) {
    const id = "msg-" + Date.now() + Math.random().toString(36).substr(2, 9);
    const wrapper = document.createElement("div");
    wrapper.className = `msg-wrapper ${type}`;
    wrapper.id = "wrapper-" + id;
    
    const bubble = document.createElement("div");
    bubble.className = `msg-bubble ${type}`;
    bubble.id = id;
    // We only use innerHTML for AI responses after careful handling in typeMessage
    bubble.innerHTML = text.replace(/\n/g, "<br>");

    wrapper.appendChild(bubble);
    box.appendChild(wrapper);
    box.scrollTop = box.scrollHeight;
    return id;
}

export function removeMessage(id) {
    const wrapper = document.getElementById("wrapper-" + id);
    if (wrapper) wrapper.remove();
}

export async function typeMessage(id, text) {
    const element = document.getElementById(id);
    if (!element) return;

    element.innerHTML = "";
    element.classList.add('typing');

    return new Promise(resolve => {
        let i = 0;
        // Escape the full text once before typing to prevent XSS during injection
        const escapedText = escapeHTML(text);
        const interval = setInterval(() => {
            if (i < escapedText.length) {
                // Handle &lt;br&gt; and other escaped sequences if needed, 
                // but for simple text character by character injection:
                element.innerHTML += escapedText[i];
                i++;
                box.scrollTop = box.scrollHeight;
            } else {
                clearInterval(interval);
                element.classList.remove('typing');
                // Post-process line breaks
                element.innerHTML = element.innerHTML.replace(/&lt;br&gt;/g, "<br>").replace(/\n/g, "<br>");
                resolve();
            }
        }, 15);
    });
}
