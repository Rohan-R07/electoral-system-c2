const BASE = "http://127.0.0.1:8000";

export async function getSteps(context) {
    const res = await fetch(BASE + "/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: context })
    });
    return (await res.json()).steps;
}

export async function getExplain(text) {
    const res = await fetch(BASE + "/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    return (await res.json()).explanation;
}

export async function getChat(text) {
    const res = await fetch(BASE + "/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });
    return (await res.json()).reply;
}