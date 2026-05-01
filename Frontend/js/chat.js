import { getChat } from "./api.js";

const input = document.getElementById("chat-input");
const send = document.getElementById("chat-send");
const box = document.getElementById("chat-messages");

send.onclick = async () => {
    sendMessage();
};

input.onkeypress = (e) => {
    if (e.key === "Enter") sendMessage();
};

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    add(text, "user");
    input.value = "";

    const id = add("Thinking...", "ai");

    try {
        const res = await getChat(text);
        update(id, res);
    } catch (error) {
        update(id, "I'm having trouble connecting right now. Please try again later.");
    }
}

function add(text, type) {
    const id = "msg-" + Date.now();

    const div = document.createElement("div");
    div.className = "msg " + type;
    div.id = id;
    div.innerText = text;

    box.appendChild(div);
    box.scrollTop = box.scrollHeight;

    return id;
}

function update(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.innerText = text;
        box.scrollTop = box.scrollHeight;
    }
}
