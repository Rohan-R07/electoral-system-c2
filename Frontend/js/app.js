import { getExplain } from "./api.js";
import { STEPS } from "./data.js";
import * as anim from "./animation.js";

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

async function renderStep() {
    isProcessing = false;
    const step = STEPS[currentStepIndex];
    
    // Clear Simulation Log with fade out
    const cards = simulationLog.querySelectorAll('.step-card, .recap-card');
    for (const card of cards) {
        await anim.fadeOut(card);
    }
    simulationLog.innerHTML = `<div class="empty-state"><i class="fas fa-route"></i><p>Simulating step ${currentStepIndex + 1}...</p></div>`;

    // Update headers
    scenarioTitle.innerText = `Step ${currentStepIndex + 1}: ${step.title}`;
    scenarioText.innerText = step.question;
    mentorHint.innerText = step.hint;
    
    // Update Progress
    const progress = (currentStepIndex / STEPS.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Clear and render options
    anim.clearContainer(optionsContainer);
    feedbackMessage.innerText = "";
    feedbackMessage.className = "feedback-message";

    step.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<i class="far fa-circle"></i> ${opt.text}`;
        btn.onclick = () => handleChoice(opt, btn);
        optionsContainer.appendChild(btn);
    });
}

async function handleChoice(option, btn) {
    if (isProcessing) return;
    
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    
    if (option.correct) {
        isProcessing = true;
        anim.pop(btn);
        btn.classList.add('correct');
        btn.innerHTML = `<i class="fas fa-check-circle"></i> ${option.text}`;
        
        // Disable other buttons
        buttons.forEach(b => {
            if (b !== btn) b.style.opacity = "0.5";
            b.disabled = true;
        });

        feedbackMessage.innerText = option.feedback;
        feedbackMessage.className = "feedback-message success";

        // Trigger Success Simulation
        await runSimulation(option.simulation, true);

        // Show AI Recap
        await showRecap(STEPS[currentStepIndex].recap);

        // Move to next step
        setTimeout(() => {
            currentStepIndex++;
            if (currentStepIndex < STEPS.length) {
                renderStep();
            } else {
                showFinalSuccess();
            }
        }, 1500);

    } else {
        isProcessing = true; // Block clicks during failure simulation
        anim.shake(btn);
        btn.classList.add('wrong');
        btn.innerHTML = `<i class="fas fa-times-circle"></i> ${option.text}`;
        
        // Disable other buttons temporarily
        buttons.forEach(b => b.disabled = true);

        feedbackMessage.innerText = "⚠️ Path rejected. Watching failure simulation...";
        feedbackMessage.className = "feedback-message thinking";

        // Trigger Failure Simulation
        await runSimulation(option.simulation, false);

        // Show AI explanation for failure
        feedbackMessage.innerText = "🤔 Explaining the consequence...";
        try {
            const explanation = await getExplain(`Explain why '${option.text}' is the wrong choice for: ${STEPS[currentStepIndex].question}. Consequence: ${option.feedback}`);
            feedbackMessage.innerText = `❌ ${explanation[0] || option.feedback}`;
            feedbackMessage.className = "feedback-message error";
        } catch (e) {
            feedbackMessage.innerText = `❌ ${option.feedback}`;
            feedbackMessage.className = "feedback-message error";
        }

        // Allow retry
        setTimeout(() => {
            isProcessing = false;
            btn.classList.remove('wrong');
            btn.innerHTML = `<i class="far fa-circle"></i> ${option.text}`;
            buttons.forEach(b => {
                b.disabled = false;
                b.style.opacity = "1";
            });
        }, 3000);
    }
}

async function runSimulation(steps, isSuccess) {
    simulationLog.innerHTML = "";

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const animationType = anim.getAnimationType(step.text);
        
        const card = document.createElement("div");
        card.className = `step-card anim-${animationType} ${isSuccess ? '' : 'failure'}`;
        
        let visualElement = '';
        if (animationType === 'download') {
            visualElement = '<div class="sim-progress-bar"><div class="sim-progress-fill"></div></div>';
        } else if (animationType === 'spinner') {
            visualElement = `<i class="fas fa-circle-notch fa-spin sim-spinner ${isSuccess ? '' : 'error'}"></i>`;
        }

        card.innerHTML = `
            <div class="step-header ${isSuccess ? '' : 'error'}">
                <i class="fas ${isSuccess ? (animationType === 'success-check' ? 'fa-check-circle' : 'fa-cog fa-spin') : 'fa-exclamation-triangle'}"></i>
                <span>${isSuccess ? animationType.toUpperCase() : 'FAILURE ALERT'}</span>
            </div>
            <div class="step-main-text">${step.text}</div>
            <div class="step-sub-text">${step.sub}</div>
            ${visualElement}
        `;
        
        simulationLog.appendChild(card);
        anim.fadeIn(card, 0);
        
        if (!isSuccess && i === steps.length - 1) {
            card.style.borderLeftColor = "var(--error)";
            card.style.background = "rgba(244, 63, 94, 0.05)";
        }

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

function showFinalSuccess() {
    progressBar.style.width = "100%";
    anim.clearContainer(optionsContainer);
    scenarioTitle.innerText = "Journey Complete! 🎓";
    scenarioText.innerText = "You've mastered the essentials of the Indian Election Process.";
    
    document.getElementById("mentor-box").style.display = "none";
    feedbackMessage.innerText = "Excellent progress. You've completed all modules.";
    feedbackMessage.className = "feedback-message success";

    const restartBtn = document.createElement("button");
    restartBtn.className = "option-btn";
    restartBtn.style.marginTop = "20px";
    restartBtn.innerHTML = `<i class="fas fa-redo"></i> Start Learning Again`;
    restartBtn.onclick = () => window.location.reload();
    optionsContainer.appendChild(restartBtn);
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

init();
