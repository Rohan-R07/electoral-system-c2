import { getExplain } from "./api.js";
import { STEP_POOL } from "./data.js";
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
let currentStepData = null; 
let isProcessing = false;

function init() {
    renderStep();
}

function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function renderStep() {
    isProcessing = false;
    
    const stepConfig = STEP_POOL[currentStepIndex];
    if (!stepConfig) return;

    currentStepData = getRandom(stepConfig.questionSets);

    const cards = simulationLog.querySelectorAll('.step-card, .recap-card');
    cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'scale(0.95)'; });
    
    setTimeout(() => {
        simulationLog.innerHTML = `<div class="empty-state"><i class="fas fa-route"></i><p>Ready for Step ${currentStepIndex + 1}...</p></div>`;
    }, 300);

    scenarioTitle.innerText = `Step ${currentStepIndex + 1}: ${stepConfig.title}`;
    scenarioText.innerText = currentStepData.question;
    mentorHint.innerText = currentStepData.hint;
    
    const progress = (currentStepIndex / STEP_POOL.length) * 100;
    progressBar.style.width = `${progress}%`;

    const shuffledOptions = shuffleArray(currentStepData.options);

    anim.clearContainer(optionsContainer);
    feedbackMessage.innerText = "";
    feedbackMessage.className = "feedback-message";

    shuffledOptions.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<i class="far fa-circle"></i> <span>${opt.text}</span>`;
        btn.onclick = () => handleChoice(opt, btn);
        optionsContainer.appendChild(btn);
    });

    anim.fadeIn(scenarioTitle, 0);
    anim.fadeIn(scenarioText, 100);
    anim.fadeIn(document.getElementById("mentor-box"), 200);
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    buttons.forEach((b, i) => anim.fadeIn(b, 300 + (i * 50)));
}

async function handleChoice(option, btn) {
    if (isProcessing) return;
    isProcessing = true;
    
    // Analytics: Option Selected
    if (window.logEvent && window.analytics) {
        window.logEvent(window.analytics, 'option_selected', {
            step: currentStepIndex + 1,
            option: option.text
        });
        console.log(`📊 Analytics Event: option_selected (Step ${currentStepIndex + 1}) - ${option.text}`);
    }

    const buttons = optionsContainer.querySelectorAll(".option-btn");
    
    // Disable all buttons immediately
    buttons.forEach(b => {
        b.disabled = true;
        if (b !== btn) b.style.opacity = "0.4";
    });

    if (option.correct) {
        // Analytics: Correct Answer
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'step_correct', { step: currentStepIndex + 1 });
            console.log(`📊 Analytics Event: step_correct (Step ${currentStepIndex + 1})`);
        }

        anim.pop(btn);
        btn.classList.add('correct');
        btn.innerHTML = `<i class="fas fa-check-circle"></i> <span>${option.text}</span>`;
        
        feedbackMessage.innerText = "✨ Thinking of an explanation...";
        feedbackMessage.className = "feedback-message success thinking";

        // Call AI for Dynamic Success Explanation
        try {
            const prompt = `Explain why selecting '${option.text}' is the correct answer for the question: '${currentStepData.question}' in the context of Indian elections.`;
            const explanation = await getExplain(prompt);
            feedbackMessage.innerText = explanation[0] || "Correct choice! You're following the right procedure.";
            feedbackMessage.classList.remove('thinking');
        } catch (e) {
            feedbackMessage.innerText = "Correct! Well done.";
            feedbackMessage.classList.remove('thinking');
        }

        await runSimulation(currentStepData.simulation, true);
        await showRecap(currentStepData.recap);

        setTimeout(() => {
            currentStepIndex++;
            if (currentStepIndex < STEP_POOL.length) {
                renderStep();
            } else {
                showFinalSuccess();
            }
        }, 2000);

    } else {
        // Analytics: Wrong Answer
        if (window.logEvent && window.analytics) {
            window.logEvent(window.analytics, 'step_failed', { step: currentStepIndex + 1 });
            console.log(`📊 Analytics Event: step_failed (Step ${currentStepIndex + 1})`);
        }

        anim.shake(btn);
        btn.classList.add('wrong');
        btn.innerHTML = `<i class="fas fa-times-circle"></i> <span>${option.text}</span>`;
        
        feedbackMessage.innerText = "🤔 Analyzing your choice...";
        feedbackMessage.className = "feedback-message error thinking";

        const failureSim = option.simulation || [
            { text: "Option Selected...", sub: "Processing your decision." },
            { text: "❌ Invalid Path", sub: "This choice does not align with official procedures." }
        ];

        await runSimulation(failureSim, false);

        // Call AI for Dynamic Failure Explanation
        try {
            const prompt = `Explain why selecting '${option.text}' is incorrect for the question: '${currentStepData.question}' in the context of Indian elections. Tell me what the correct approach should be.`;
            const explanation = await getExplain(prompt);
            feedbackMessage.innerText = `❌ ${explanation[0] || "That's not the right way."}`;
            feedbackMessage.classList.remove('thinking');
        } catch (e) {
            feedbackMessage.innerText = "❌ Incorrect. Please try a different approach.";
            feedbackMessage.classList.remove('thinking');
        }

        setTimeout(() => {
            btn.classList.remove('wrong');
            btn.innerHTML = `<i class="far fa-circle"></i> <span>${option.text}</span>`;
            buttons.forEach(b => {
                b.disabled = false;
                b.style.opacity = "1";
            });
            isProcessing = false;
        }, 3000);
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

    // Analytics: Journey Completed
    if (window.logEvent && window.analytics) {
        window.logEvent(window.analytics, 'journey_completed');
        console.log("Analytics: journey_completed");
    }

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
    await chat.typeMessage(msgId, "Congratulations! You've navigated the complexities of registration and voting. Your voice is your power!");
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

init();
