function shake(element) {
    element.classList.add('wrong-shake');
    setTimeout(() => {
        element.classList.remove('wrong-shake');
    }, 400);
}

function pop(element) {
    element.classList.add('correct-pop');
    setTimeout(() => {
        element.classList.remove('correct-pop');
    }, 400);
}

function fadeIn(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    element.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

function fadeOut(element) {
    return new Promise(resolve => {
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            resolve();
        }, 500);
    });
}

function typeText(element, text, speed = 30) {
    return new Promise(resolve => {
        element.innerText = "";
        element.classList.add('typing');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length) {
                element.innerText += text.charAt(i);
                i++;
            } else {
                clearInterval(interval);
                element.classList.remove('typing');
                resolve();
            }
        }, speed);
    });
}

function getAnimationType(text) {
    const t = text.toLowerCase();
    if (t.includes("downloading")) return "download";
    if (t.includes("opening")) return "window-fade";
    if (t.includes("launching")) return "zoom-in";
    if (t.includes("navigating")) return "slide-right";
    if (t.includes("submitting")) return "spinner";
    if (t.includes("verifying") || t.includes("checking") || t.includes("validating") || t.includes("scanning")) return "pulse";
    if (t.includes("completed")) return "success-check";
    return "default-fade";
}

function clearContainer(container) {
    container.innerHTML = '';
}

// Global scope access
window.anim = {
    shake,
    pop,
    fadeIn,
    fadeOut,
    typeText,
    getAnimationType,
    clearContainer
};
