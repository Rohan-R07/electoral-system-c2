import { getExplain } from "./api.js";
import { STEPS } from "./data.js";
import * as anim from "./animation.js";
import * as chat from "./chat.js";

const appContainer = document.querySelector(".app-container");
const sidebar = document.querySelector(".sidebar.choices-panel");
const simulationPanel = document.querySelector(".main-content.simulation-panel");
const chatPanel = document.querySelector(".sidebar.chat-panel");

const scenarioTitle = document.getElementById("scenario-title");
const scenarioText = document.getElementById("scenario-text");
const mentorHint = document.getElementById("mentor-hint");
const optionsContainer = document.getElementById("options-container");
const simulationLog = document.getElementById("simulation-log");
const feedbackMessage = document.getElementById("feedback-message");
const progressBar = document.getElementById("progress");

let currentStepIndex = 0;
let isProcessing = false;

function init() {
    renderStep();
}

/**
 * Utility to shuffle an array
 */
function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Utility to pick a random item from an array
 */
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function renderStep() {
    // Reset state for new step
    isProcessing = false;
    
    const step = STEPS[currentStepIndex];
    if (!step) return;

    // Clear Simulation Log with fade out
    const cards = simulationLog.querySelectorAll('.step-card, .recap-card');
    for (const card of cards) {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
    }
    
    setTimeout(() => {
        simulationLog.innerHTML = `<div class="empty-state"><i class="fas fa-route"></i><p>Ready for Step ${currentStepIndex + 1}...</p></div>`;
    }, 300);

    // Pick random variants
    const question = getRandom(step.questionVariants);
    const hint = getRandom(step.hintVariants);

    // Update UI Content
    scenarioTitle.innerText = `Step ${currentStepIndex + 1}: ${step.title}`;
    scenarioText.innerText = question;
    mentorHint.innerText = hint;
    
    // Update Progress
    const progress = (currentStepIndex / STEPS.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Shuffle options
    const shuffledOptions = shuffleArray(step.options);

    // Re-render options fresh
    anim.clearContainer(optionsContainer);
    feedbackMessage.innerText = "";
    feedbackMessage.className = "feedback-message";

    shuffledOptions.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        // Pick a random text variant for the option
        const optionText = getRandom(opt.textVariants);
        btn.innerHTML = `<i class="far fa-circle"></i> <span>${optionText}</span>`;
        btn.disabled = false;
        btn.onclick = () => handleChoice(opt, btn, optionText);
        optionsContainer.appendChild(btn);
    });

    // Animate entries
    anim.fadeIn(scenarioTitle, 0);
    anim.fadeIn(scenarioText, 100);
    anim.fadeIn(document.getElementById("mentor-box"), 200);
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((b, i) => anim.fadeIn(b, 300 + (i * 50)));
}

async function handleChoice(option, btn, chosenText) {
    if (isProcessing) return;
    isProcessing = true;
    
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    
    if (option.correct) {
        anim.pop(btn);
        btn.classList.add('correct');
        btn.innerHTML = `<i class="fas fa-check-circle"></i> <span>${chosenText}</span>`;
        
        buttons.forEach(b => {
            if (b !== btn) {
                b.style.opacity = "0.4";
                b.style.pointerEvents = "none";
            }
            b.disabled = true;
        });

        feedbackMessage.innerText = option.feedback;
        feedbackMessage.className = "feedback-message success";

        await runSimulation(option.simulation, true);
        await showRecap(STEPS[currentStepIndex].recap);

        setTimeout(() => {
            currentStepIndex++;
            if (currentStepIndex < STEPS.length) {
                renderStep();
            } else {
                showFinalSuccess();
            }
        }, 1500);

    } else {
        anim.shake(btn);
        btn.classList.add('wrong');
        btn.innerHTML = `<i class="fas fa-times-circle"></i> <span>${chosenText}</span>`;
        
        buttons.forEach(b => b.disabled = true);
        
        feedbackMessage.innerText = "⚠️ Path rejected. Watching consequence...";
        feedbackMessage.className = "feedback-message thinking";

        await runSimulation(option.simulation, false);

        try {
            const explanation = await getExplain(`Explain why '${chosenText}' is the wrong choice for: ${scenarioText.innerText}.`);
            feedbackMessage.innerText = `❌ ${explanation[0] || option.feedback}`;
            feedbackMessage.className = "feedback-message error";
        } catch (e) {
            feedbackMessage.innerText = `❌ ${option.feedback}`;
            feedbackMessage.className = "feedback-message error";
        }

        setTimeout(() => {
            btn.classList.remove('wrong');
            btn.innerHTML = `<i class="far fa-circle"></i> <span>${chosenText}</span>`;
            buttons.forEach(b => {
                b.disabled = false;
                b.style.opacity = "1";
                b.style.pointerEvents = "auto";
            });
            isProcessing = false;
        }, 2000);
    }
}

async function runSimulation(steps, isSuccess) {
    simulationLog.innerHTML = "";

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const animType = anim.getAnimationType(step.text);
        
        const card = document.createElement("div");
        card.className = `step-card anim-${animType} ${isSuccess ? '' : 'failure'}`;
        
        let visual = '';
        if (animType === 'download') visual = '<div class="sim-progress-bar"><div class="sim-progress-fill"></div></div>';
        if (animType === 'spinner') visual = `<i class="fas fa-circle-notch fa-spin sim-spinner ${isSuccess ? '' : 'error'}"></i>`;

        card.innerHTML = `
            <div class="step-header ${isSuccess ? '' : 'error'}">
                <i class="fas ${isSuccess ? (animType === 'success-check' ? 'fa-check-circle' : 'fa-cog fa-spin') : 'fa-exclamation-triangle'}"></i>
                <span>${isSuccess ? animType.toUpperCase() : 'FAILURE ALERT'}</span>
            </div>
            <div class="step-main-text">${step.text}</div>
            <div class="step-sub-text">${step.sub}</div>
            ${visual}
        `;
        
        simulationLog.appendChild(card);
        anim.fadeIn(card, 0);
        simulationLog.scrollTop = simulationLog.scrollHeight;
        await delay(1200);
    }
}

async function showRecap(text) {
    const recap = document.createElement("div");
    recap.className = "recap-card";
    recap.innerHTML = `<strong>💡 Mentor Insight:</strong><br>${text}`;
    simulationLog.appendChild(recap);
    simulationLog.scrollTop = simulationLog.scrollHeight;
    await delay(500);
}

async function showFinalSuccess() {
    progressBar.style.width = "100%";
    appContainer.classList.add('completed-mode');
    simulationLog.innerHTML = "";

    const overlay = document.createElement("div");
    overlay.className = "completion-overlay";
    overlay.innerHTML = `
        <div class="glow-bg"></div>
        <div class="content">
            <h1>🎉 Journey Complete!</h1>
            <p>You've mastered the essentials of the election process. You're now ready to make a difference!</p>
            <button id="restart-btn" class="restart-btn">Restart Journey</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 100);

    document.getElementById("restart-btn").onclick = () => {
        appContainer.classList.remove('completed-mode');
        overlay.remove();
        currentStepIndex = 0;
        renderStep();
    };

    const msgId = chat.addMessage("...", "ai");
    await chat.typeMessage(msgId, "Congratulations! You've navigated the complexities of registration and voting. Every time you restart, the path will vary, so feel free to practice again!");
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

init();
