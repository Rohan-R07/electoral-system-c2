import { getChat } from "./api.js";

const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");
const box = document.getElementById("chat-messages");

send.onclick = () => sendMessage();
input.onkeypress = (e) => { if (e.key === "Enter") sendMessage(); };

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    // 1. Add User Message
    addMessage(text, "user");
    input.value = "";

    // 2. Add Typing Indicator ("...")
    const typingId = addMessage("...", "ai typing-indicator");

    try {
        // 3. Fetch AI Response
        const response = await getChat(text);
        
        // 4. Remove Typing Indicator
        removeMessage(typingId);

        // 5. Add and Type AI Response
        const aiMsgId = addMessage("", "ai");
        await typeMessage(aiMsgId, response);
        
    } catch (error) {
        removeMessage(typingId);
        const errorId = addMessage("", "ai error");
        await typeMessage(errorId, "I'm having trouble connecting. Please try again later!");
    }
}

/**
 * Adds a message bubble to the chat box
 */
export function addMessage(text, type) {
    const id = "msg-" + Date.now() + Math.random().toString(36).substr(2, 9);
    
    const wrapper = document.createElement("div");
    wrapper.className = `msg-wrapper ${type}`;
    wrapper.id = "wrapper-" + id;
    
    const bubble = document.createElement("div");
    bubble.className = `msg-bubble ${type}`;
    bubble.id = id;
    bubble.innerHTML = text.replace(/\n/g, "<br>");

    wrapper.appendChild(bubble);
    box.appendChild(wrapper);
    
    // Smooth scroll to bottom
    box.scrollTo({
        top: box.scrollHeight,
        behavior: 'smooth'
    });

    return id;
}

/**
 * Removes a message bubble (used for typing indicator)
 */
export function removeMessage(id) {
    const wrapper = document.getElementById("wrapper-" + id);
    if (wrapper) {
        wrapper.remove();
    }
}

/**
 * Types a message character by character into a bubble
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
                // Keep scrolling as we type
                box.scrollTop = box.scrollHeight;
            } else {
                clearInterval(interval);
                element.classList.remove('typing');
                resolve();
            }
        }, 20); // 20ms delay per character
    });
}
