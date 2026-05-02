/**
 * Main Application Logic
 * Orchestrates the MCQ journey, simulation sequences, and mentor feedback.
 */

const elements = {
    appContainer: document.querySelector(".app-container"),
    sidebar: document.querySelector(".sidebar.choices-panel"),
    simulationPanel: document.querySelector(".main-content.simulation-panel"),
    scenarioTitle: document.getElementById("scenario-title"),
    scenarioText: document.getElementById("scenario-text"),
    mentorHint: document.getElementById("mentor-hint"),
    optionsContainer: document.getElementById("options-container"),
    simulationLog: document.getElementById("simulation-log"),
    feedbackMessage: document.getElementById("feedback-message"),
    progressBar: document.getElementById("progress")
};

let currentStepIndex = 0;
let activeStepData = null; 
let isActionPending = false;

/**
 * Initialize application lifecycle
 */
function initializeApp() {
    loadNextStepModule();
}

/**
 * Selects a random question set and renders the UI for the current step
 */
async function loadNextStepModule() {
    isActionPending = false;
    
    const stepConfig = window.STEP_POOL[currentStepIndex];
    if (!stepConfig) return;

    // Pick a randomized variant for this module
    activeStepData = stepConfig.questionSets[Math.floor(Math.random() * stepConfig.questionSets.length)];

    // Reset Simulation Panel with transition
    const existingCards = elements.simulationLog.querySelectorAll('.step-card, .recap-card');
    existingCards.forEach(card => card.style.opacity = '0');
    
    setTimeout(() => {
        elements.simulationLog.innerHTML = `
            <div class="empty-state" role="status">
                <i class="fas fa-route"></i>
                <p>Preparing Step ${currentStepIndex + 1}...</p>
            </div>`;
    }, 300);

    // Update Header Content
    elements.scenarioTitle.innerText = `Step ${currentStepIndex + 1}: ${stepConfig.title}`;
    elements.scenarioText.innerText = activeStepData.question;
    elements.mentorHint.innerText = activeStepData.hint;
    
    // Refresh Progress Bar
    const progressPercent = (currentStepIndex / window.STEP_POOL.length) * 100;
    elements.progressBar.style.width = `${progressPercent}%`;
    elements.progressBar.setAttribute('aria-valuenow', Math.round(progressPercent));

    // Clear and Render Choice Options
    window.anim.clearContainer(elements.optionsContainer);
    elements.feedbackMessage.innerText = "";
    elements.feedbackMessage.className = "feedback-message";

    activeStepData.options.forEach(option => {
        const optionBtn = document.createElement("button");
        optionBtn.className = "option-btn";
        optionBtn.setAttribute('aria-label', `Choose: ${option.text}`);
        optionBtn.innerHTML = `<i class="far fa-circle" aria-hidden="true"></i> <span>${option.text}</span>`;
        optionBtn.onclick = () => handleUserSelection(option, optionBtn);
        elements.optionsContainer.appendChild(optionBtn);
    });

    // Staggered entry animations
    window.anim.fadeIn(elements.scenarioTitle, 0);
    window.anim.fadeIn(elements.scenarioText, 100);
}

/**
 * Processes the user's MCQ choice
 */
async function handleUserSelection(option, btn) {
    if (isActionPending) return;
    isActionPending = true;
    
    // Record telemetry metrics
    if (window.sessionState) {
        window.sessionState.totalInteractions++;
        option.correct ? window.sessionState.correctAnswers++ : window.sessionState.wrongAnswers++;
    }

    if (window.logUserAction) {
        window.logUserAction('interaction_choice', { 
            step: currentStepIndex + 1, 
            label: option.text, 
            isCorrect: option.correct 
        });
    }

    // Lock UI during feedback
    const allButtons = elements.optionsContainer.querySelectorAll(".option-btn");
    allButtons.forEach(b => {
        b.disabled = true;
        if (b !== btn) b.style.opacity = "0.4";
    });

    if (option.correct) {
        handleSuccessFlow(option, btn);
    } else {
        handleFailureFlow(option, btn, allButtons);
    }
}

/**
 * Executes correct answer sequence
 */
async function handleSuccessFlow(option, btn) {
    window.anim.pop(btn);
    btn.classList.add('correct');
    btn.innerHTML = `<i class="fas fa-check-circle" aria-hidden="true"></i> <span>${option.text}</span>`;
    
    elements.feedbackMessage.innerText = "✨ Thinking of an explanation...";
    elements.feedbackMessage.className = "feedback-message success thinking";

    try {
        const aiPrompt = `Explain why '${option.text}' is the correct choice for: '${activeStepData.question}' in the Indian election process.`;
        const explanation = await window.getExplain(aiPrompt);
        elements.feedbackMessage.innerText = explanation[0] || "Correct choice! Well done.";
        elements.feedbackMessage.classList.remove('thinking');
    } catch {
        elements.feedbackMessage.innerText = "Correct! Proceeding to next step.";
    }

    await executeSimulation(activeStepData.simulation, true);
    await displayRecap(activeStepData.recap);

    setTimeout(() => {
        currentStepIndex++;
        if (currentStepIndex < window.STEP_POOL.length) {
            loadNextStepModule();
        } else {
            renderFinalCompletion();
        }
    }, 2000);
}

/**
 * Executes incorrect answer sequence
 */
async function handleFailureFlow(option, btn, allButtons) {
    window.anim.shake(btn);
    btn.classList.add('wrong');
    btn.innerHTML = `<i class="fas fa-times-circle" aria-hidden="true"></i> <span>${option.text}</span>`;
    
    elements.feedbackMessage.innerText = "🤔 Analyzing outcome...";
    elements.feedbackMessage.className = "feedback-message error thinking";

    /**
     * DUAL SIMULATION RESTORATION:
     * Use predefined failure simulation if available in data.js.
     * Otherwise, fallback to dynamic AI simulation.
     */
    if (option.simulation) {
        await executeSimulation(option.simulation, false);
    } else {
        try {
            const aiPrompt = `User selected wrong option '${option.text}' for '${activeStepData.question}'. Show failure simulation.`;
            const steps = await window.getSteps(aiPrompt);
            await executeSimulation(steps, false);
        } catch {
            await executeSimulation([{text: "Invalid Path", sub: "Decision deviates from official protocol"}], false);
        }
    }

    try {
        const aiPrompt = `Explain why selecting '${option.text}' was incorrect for: '${activeStepData.question}'. What is the correct way?`;
        const explanation = await window.getExplain(aiPrompt);
        elements.feedbackMessage.innerText = `❌ ${explanation[0] || "Incorrect choice."}`;
        elements.feedbackMessage.classList.remove('thinking');
    } catch {
        elements.feedbackMessage.innerText = "❌ Incorrect approach. Please try again.";
    }

    // Unlock for retry after a delay
    setTimeout(() => {
        btn.classList.remove('wrong');
        btn.innerHTML = `<i class="far fa-circle"></i> <span>${option.text}</span>`;
        allButtons.forEach(b => {
            b.disabled = false;
            b.style.opacity = "1";
        });
        isActionPending = false;
    }, 3000);
}

/**
 * Renders the simulation sequence in the center panel
 */
async function executeSimulation(steps, isSuccess) {
    elements.simulationLog.innerHTML = "";
    if (!steps || steps.length === 0) return;

    for (const step of steps) {
        // Contract alignment: handles both {text, sub} and {title, description}
        const mainText = step.text || step.title || "Action";
        const subText = step.sub || step.description || "";
        const type = step.type || (isSuccess ? "info" : "error");

        const animationType = window.anim.getAnimationType(mainText);
        const card = document.createElement("div");
        card.className = `step-card anim-${animationType} ${type === 'error' ? 'failure' : ''}`;
        
        card.innerHTML = `
            <div class="step-header ${type === 'error' ? 'error' : ''}">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : (animationType === 'success-check' ? 'fa-check-circle' : 'fa-cog fa-spin')}" aria-hidden="true"></i>
                <span>${type === 'error' ? 'FAILURE ALERT' : animationType.toUpperCase()}</span>
            </div>
            <div class="step-main-text">${mainText}</div>
            <div class="step-sub-text">${subText}</div>
        `;
        
        elements.simulationLog.appendChild(card);
        window.anim.fadeIn(card, 0);
        elements.simulationLog.scrollTop = elements.simulationLog.scrollHeight;
        await new Promise(r => setTimeout(r, 1200));
    }
}

/**
 * Displays a summary recap card
 */
async function displayRecap(text) {
    const recap = document.createElement("div");
    recap.className = "recap-card";
    recap.innerHTML = `<strong>💡 Mentor Insight:</strong><br>${text}`;
    elements.simulationLog.appendChild(recap);
    elements.simulationLog.scrollTop = elements.simulationLog.scrollHeight;
}

/**
 * Renders the final celebratory completion screen
 */
async function renderFinalCompletion() {
    elements.progressBar.style.width = "100%";
    elements.appContainer.classList.add('completed-mode');
    elements.simulationLog.innerHTML = "";

    if (window.logUserAction) window.logUserAction('journey_finish');
    if (window.saveSessionSummary) await window.saveSessionSummary();

    const overlay = document.createElement("div");
    overlay.className = "completion-overlay";
    overlay.innerHTML = `
        <div class="glow-bg"></div>
        <div class="content">
            <h1>🎉 Journey Complete!</h1>
            <p>You've mastered the Election Essentials. Ready to vote!</p>
            <button id="restart-btn" class="restart-btn" aria-label="Restart the learning journey">Restart Journey</button>
        </div>
    `;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 100);

    document.getElementById("restart-btn").onclick = () => {
        elements.appContainer.classList.remove('completed-mode');
        window.location.reload();
    };

    const finalMsgId = window.chat.addMessage("...", "ai");
    await window.chat.typeMessage(finalMsgId, "Congratulations! You've successfully navigated the Indian election process. Your participation is what makes democracy strong!");
}

// Initialize when DOM ready
document.addEventListener("DOMContentLoaded", initializeApp);
