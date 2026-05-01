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

function renderStep() {
    isProcessing = false;
    const step = STEPS[currentStepIndex];
    
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

    // Fade in new step elements
    anim.fadeIn(document.getElementById("quiz-card"), 0);
    anim.fadeIn(document.getElementById("mentor-box"), 100);
}

async function handleChoice(option, btn) {
    if (isProcessing) return;
    
    if (option.correct) {
        isProcessing = true;
        anim.pop(btn);
        btn.classList.add('correct');
        btn.innerHTML = `<i class="fas fa-check-circle"></i> ${option.text}`;
        
        // Disable other buttons
        const buttons = optionsContainer.querySelectorAll(".option-btn");
        buttons.forEach(b => {
            if (b !== btn) b.style.opacity = "0.5";
            b.disabled = true;
        });

        feedbackMessage.innerText = option.feedback;
        feedbackMessage.className = "feedback-message success";

        // Trigger Mini Simulation
        await runMiniSimulation(STEPS[currentStepIndex].simulation);

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
        }, 2000);

    } else {
        anim.shake(btn);
        btn.classList.add('wrong');
        btn.innerHTML = `<i class="fas fa-times-circle"></i> ${option.text}`;
        
        feedbackMessage.innerText = "🤔 Let me explain why...";
        feedbackMessage.className = "feedback-message thinking";

        try {
            const explanation = await getExplain(`Explain why '${option.text}' is the wrong choice for: ${STEPS[currentStepIndex].question}`);
            feedbackMessage.innerText = `❌ ${explanation[0] || option.feedback}`;
            feedbackMessage.className = "feedback-message error";
        } catch (e) {
            feedbackMessage.innerText = `❌ ${option.feedback}`;
            feedbackMessage.className = "feedback-message error";
        }

        // Reset icon after a while if they want to retry
        setTimeout(() => {
            if (!isProcessing) {
                btn.classList.remove('wrong');
                btn.innerHTML = `<i class="far fa-circle"></i> ${option.text}`;
            }
        }, 2000);
    }
}

async function runMiniSimulation(steps) {
    // Clear previous or empty state
    const empty = simulationLog.querySelector(".empty-state");
    if (empty) empty.remove();

    for (let i = 0; i < steps.length; i++) {
        const card = document.createElement("div");
        card.className = "step-card";
        card.innerHTML = `
            <div class="step-header">
                <i class="fas fa-sync fa-spin"></i>
                <span>ACTING...</span>
            </div>
            <div class="step-content">${steps[i]}</div>
        `;
        simulationLog.appendChild(card);
        anim.fadeIn(card, 0);
        
        // After small delay, change icon to check
        setTimeout(() => {
            const icon = card.querySelector("i");
            icon.className = "fas fa-check-circle";
            icon.style.color = "var(--success)";
            card.querySelector("span").innerText = "COMPLETED";
        }, 600);

        simulationLog.scrollTop = simulationLog.scrollHeight;
        await delay(1000);
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
    scenarioText.innerText = "You've mastered the essentials of the Indian Election Process. You're now ready to be an informed and active citizen.";
    
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
