# 🗳️ AI-Powered Electoral System Assistant

🔗 **Live Demo:** https://promptvars-challenge-2.web.app/                                                                                        
🔗 **Backend API (Cloud Run):** https://election-backend-882610711158.asia-south1.run.app                                                                                       
🎥 **Demo Video:** https://drive.google.com/file/d/1hasMdNUdY3zVUhhGRCfDwW7iu9HqZXhJ/view?usp=sharing

---

## 📌 Overview

This project is an **AI-driven electoral learning system** built for **Google Prompt Wars – Challenge 2**, designed to simulate real-world election workflows through **interactive decision-based learning**.

Instead of static tutorials, the system dynamically generates:

* Step-by-step electoral processes
* Context-aware explanations
* Scenario-based MCQs
* Consequence-driven simulations

The goal is not just to inform users, but to help them **understand decisions and their outcomes**.

---

## 🎯 Chosen Vertical

**Civic Tech – Electoral Systems**

The system focuses on:

* Voter registration workflows
* Electoral procedures
* Decision-making in real-world scenarios
* Practical civic awareness

---

## 🧠 Core Idea (How it Works)

### 1. AI Assistant

* Handles open-ended user queries
* Provides contextual guidance
* Acts as fallback when users are unsure

---

### 2. Simulation-Based Learning Engine

This is the core of the system.

Each interaction follows:

```text
User Action → AI Evaluation → Outcome Simulation → Explanation
```

* ✅ Correct decisions → progression
* ❌ Incorrect decisions → simulated consequences

Example:

```text
Wrong form selected → system simulates rejection → AI explains correction
```

This creates a **cause–effect learning loop**, not just Q&A.

---

### 3. AI-Generated Questions & Options

* Questions are dynamically generated
* Options are intentionally realistic and ambiguous
* Prevents memorization and encourages reasoning

---

### 4. Step-Based Guidance System

For any user intent:

```text
Input → AI → Structured steps → Guided completion
```

Example flows include:

* Registering as a voter
* Identity verification
* Form submission
* Voting process

---

### 5. Adaptive Learning Flow

* Wrong answers trigger:

  * Explanation
  * Simulation
  * Retry mechanism

The system ensures **understanding before progression**.

---

## 🧪 System Architecture

```text
Frontend (Firebase Hosting)
        ↓
Cloud Run (FastAPI Backend)
        ↓
AI Model (OpenRouter)
        ↓
Firestore + Analytics (Tracking Layer)
```

---

## 📊 Tracking & Analytics (Key Strength)

The system includes **real-time behavior tracking** using Firebase:

### Firestore Event Logging

Each interaction logs:

* Step number
* Selected option
* Correct / incorrect decision
* Timestamp
* User metadata

### Analytics Events

* `app_loaded`
* `option_selected`
* `chat_used`
* `journey_completed`

This enables:

* Behavioral analysis
* Learning pattern tracking
* Real-world system observability

---

## 🧠 Challenge Expectations Alignment

### ✔ Smart, Dynamic Assistant

* Fully AI-driven responses
* No hardcoded flows

---

### ✔ Logical Decision Making

* Outcome-based MCQ system
* Context-aware evaluation

---

### ✔ Effective Use of Google Services

* Firebase Hosting
* Firebase Analytics
* Firebase Firestore (event tracking)
* Google Cloud Run

---

### ✔ Real-World Usability

* Based on actual electoral processes
* Simulates real consequences
* Practical for civic learning

---

### ✔ Clean & Maintainable Code

* Modular structure
* Centralized API handling
* Structured error management

---

## ⚙️ Engineering Principles

### 🔹 Code Quality

* Modular API design
* Reusable utilities
* Clear separation of concerns

---

### 🔹 Security

* API keys managed via environment variables
* No sensitive backend exposure

---

### 🔹 Efficiency

* Optimized API calls
* Timeout handling
* Response fallback logic

---

### 🔹 Testing

* API validation via test suite
* Edge case handling
* Performance observation

---

### 🔹 Accessibility

* Simple interaction model
* Clear feedback states
* Guided navigation

---

## 📁 Project Structure

```text
Frontend/
  index.html
  js/
  css/

Backend/
  app.py
  ai_engine.py
  requirements.txt
```

---

## ⚠️ Assumptions

* Users have basic navigation understanding
* Internet connectivity is available
* AI outputs may vary slightly due to model behavior

---

## 💡 Key Highlights

* Fully AI-driven interaction system
* No static learning paths
* Simulation-based decision learning
* Dynamic question generation
* Real-time analytics and tracking

---

## 🔮 Future Improvements

* Personalized learning paths
* Multi-language support
* Advanced analytics dashboard
* Offline capability

---

## 🎥 Demo

https://github.com/user-attachments/assets/aa153885-0885-49ed-8a47-0cc5b468bc7d

---

## 👨‍💻 Author

**Rohan R**
