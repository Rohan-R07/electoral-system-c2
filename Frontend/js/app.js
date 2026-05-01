import { getSteps } from "./api.js";
import { SCENARIOS } from "./data.js";
import * as anim from "./animation.js";

const scenarioTitle = document.getElementById("scenario-title");
const scenarioText = document.getElementById("scenario-text");
const optionsContainer = document.getElementById("options-container");
const simulationLog = document.getElementById("simulation-log");
const feedbackMessage = document.getElementById("feedback-message");
const progressBar = document.getElementById("progress");

let currentScenarioIndex = 0;

function init() {
    renderScenario();
}

function renderScenario() {
    const scenario = SCENARIOS[currentScenarioIndex];
    scenarioTitle.innerText = scenario.title;
    scenarioText.innerText = scenario.text;
    
    // Update Progress
    const progress = ((currentScenarioIndex) / SCENARIOS.length) * 100;
    progressBar.style.width = `${progress}%`;

    anim.clearContainer(optionsContainer);
    feedbackMessage.innerText = "";
    feedbackMessage.className = "feedback-message";

    scenario.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.innerHTML = `<i class="fas fa-chevron-right"></i> ${opt.text}`;
        btn.onclick = () => handleChoice(opt, btn);
        optionsContainer.appendChild(btn);
    });
}

async function handleChoice(option, btn) {
    if (option.correct) {
        anim.pop(btn);
        feedbackMessage.innerText = option.feedback;
        feedbackMessage.className = "feedback-message success";
        
        // Disable all buttons during simulation
        const buttons = optionsContainer.querySelectorAll(".option-btn");
        buttons.forEach(b => b.disabled = true);

        await runSimulation(option.text);
        
        // Move to next scenario if exists
        setTimeout(() => {
            currentScenarioIndex++;
            if (currentScenarioIndex < SCENARIOS.length) {
                renderScenario();
            } else {
                showFinalSuccess();
            }
        }, 2000);

    } else {
        anim.shake(btn);
        feedbackMessage.innerText = option.feedback;
        feedbackMessage.className = "feedback-message error";
        
        addStepToLog("Alert", option.consequence, "error");
    }
}

async function runSimulation(choiceText) {
    simulationLog.innerHTML = `<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Generating steps for: ${choiceText}...</p></div>`;

    try {
        const steps = await getSteps(choiceText);
        simulationLog.innerHTML = "";

        for (let i = 0; i < steps.length; i++) {
            addStepToLog(`Step ${i + 1}`, steps[i]);
            await delay(800);
        }
    } catch (error) {
        console.error("Simulation error:", error);
        addStepToLog("Error", "Could not connect to the AI engine.", "error");
    }
}

function addStepToLog(title, content, type = "normal") {
    const card = document.createElement("div");
    card.className = "step-card";
    if (type === "error") card.style.borderLeftColor = "var(--error)";
    
    card.innerHTML = `
        <div class="step-header">
            <i class="fas ${type === "error" ? "fa-exclamation-circle" : "fa-check-circle"}"></i>
            <span>${title}</span>
        </div>
        <div class="step-content">${content}</div>
    `;
    
    // Remove empty state if present
    const empty = simulationLog.querySelector(".empty-state");
    if (empty) empty.remove();

    simulationLog.appendChild(card);
    simulationLog.scrollTop = simulationLog.scrollHeight;
}

function showFinalSuccess() {
    progressBar.style.width = "100%";
    anim.clearContainer(optionsContainer);
    scenarioTitle.innerText = "Congratulations!";
    scenarioText.innerText = "You have successfully navigated the first steps of the election process. You are now better prepared to be an active citizen!";
    
    const restartBtn = document.createElement("button");
    restartBtn.className = "option-btn";
    restartBtn.style.borderColor = "var(--primary)";
    restartBtn.innerHTML = `<i class="fas fa-redo"></i> Start Over`;
    restartBtn.onclick = () => {
        currentScenarioIndex = 0;
        simulationLog.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ghost"></i>
                <p>Make a choice to see the process unfold...</p>
            </div>
        `;
        renderScenario();
    };
    optionsContainer.appendChild(restartBtn);
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

init();
