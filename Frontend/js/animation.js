export function shake(element) {
    element.classList.add('wrong');
    setTimeout(() => {
        element.classList.remove('wrong');
    }, 400);
}

export function pop(element) {
    element.classList.add('correct');
    setTimeout(() => {
        element.classList.remove('correct');
    }, 400);
}

export function fadeIn(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    element.style.transition = 'all 0.5s ease';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

export function clearContainer(container) {
    container.innerHTML = '';
}
