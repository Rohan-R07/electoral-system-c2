# 🗳️ AI-Powered Electoral System Assistant

🔗 **Live Demo:** https://promptvars-challenge-2.web.app/                                                                                                                     
🔗 **Backend API (Cloud Run):** https://election-backend-882610711158.asia-south1.run.app                                                                                                                                  
🎥 **Demo Video:** https://drive.google.com/file/d/1hasMdNUdY3zVUhhGRCfDwW7iu9HqZXhJ/view?usp=sharing

---

## 📌 Overview

This project is an **AI-powered interactive electoral learning and assistance system** designed to guide users through election-related processes using **dynamic simulations, contextual explanations, and intelligent decision-making**.

Unlike static learning platforms, this system:

* Generates **AI-driven steps, explanations, and scenarios**
* Simulates **real-world consequences of user decisions**
* Provides **interactive MCQ-based learning with AI feedback**
* Adapts responses based on **user input and context**

---

## 🎯 Chosen Vertical

**Civic Tech / Electoral Systems**

The system focuses on:

* Voter registration workflows
* Election procedures
* User decision-making within electoral scenarios
* Practical understanding of government systems

---

## 🚀 How the Solution Works

### 1. AI Assistant

* Users can interact freely with an assistant
* Handles unclear queries and guides users toward valid election-related actions
* Fully dynamic (no hardcoded responses)

---

### 2. AI-Generated Simulation Engine

The core strength of this project lies in its **simulation system**:

* Every MCQ is backed by **AI-generated logic**
* When a user selects an option:

  * ✅ Correct → AI confirms and continues flow
  * ❌ Wrong → AI simulates consequences

Example:

```text
User selects wrong form → System simulates rejection process → AI explains why
```

👉 This creates a **cause-effect learning loop**, not just Q&A.

---

### 3. AI-Generated Questions & Options

* Questions are not static
* Options are dynamically generated to:

  * Avoid repetition
  * Improve engagement
  * Simulate real-world ambiguity

---

### 4. Step-Based Guidance System

For any valid query:

```text
Input → AI → Step-by-step process
```

Example:

* Register as voter
* Verify identity
* Submit application
* Complete voting

---

### 5. Adaptive Learning Flow

* Wrong answers trigger:

  * Simulation
  * Explanation
  * Retry mechanism
* System ensures user **understands the process before progressing**

---

## 🧠 Challenge Expectations (How this project meets them)

### ✔ Smart, Dynamic Assistant

* AI-driven responses (no static logic)
* Context-aware outputs

---

### ✔ Logical Decision Making

* MCQ system simulates outcomes
* AI evaluates user choices and responds accordingly

---

### ✔ Effective Use of Google Services

* Firebase Hosting (Frontend)
* Firebase Analytics (User behavior tracking)
* Cloud Run (Backend deployment)
* Real-time Analytics insights

---

### ✔ Real-World Usability

* Focused on actual electoral processes
* Simulates real consequences of wrong actions
* Practical for civic education

---

### ✔ Clean & Maintainable Code

* Modular API structure
* Centralized fetch handling
* Structured error handling
* Clear separation of concerns

---

## 🧪 Technical Architecture

```text
Frontend (Firebase Hosting)
        ↓
Cloud Run (FastAPI Backend)
        ↓
OpenRouter AI Models
```

---

## 📊 Firebase Analytics Integration

The system tracks:

* User interaction events
* Step completion rates
* Incorrect decision patterns
* AI usage frequency

### Real-Time Analytics

* Monitor active users
* Track engagement live
* Observe user behavior patterns

---

## ⚙️ Engineering Principles

### 🔹 Code Quality

* Modular functions
* Reusable API layer
* Clear logging and debugging

---

### 🔹 Security

* API keys stored via environment variables
* No sensitive data exposed in frontend

---

### 🔹 Efficiency

* Optimized API calls
* Timeout handling
* Fallback mechanisms for AI models

---

### 🔹 Testing

* Endpoint testing via Swagger
* Manual validation of flows
* Error handling validation

---

### 🔹 Accessibility

* Simple UI interaction model
* Clear feedback messages
* Guided user flow

---

### 🔹 Google Services Used

* Firebase Hosting
* Firebase Analytics
* Google Cloud Run

---

## ⚠️ Assumptions

* Users have basic understanding of navigation
* Internet connectivity is available
* AI responses may vary slightly due to model behavior

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

## 💡 Key Highlights

* Entire interaction system is **AI-driven**
* No hardcoded learning paths
* Simulation-based learning approach
* Dynamic question & option generation
* Real-time analytics integration

---

## 🔮 Future Improvements

* Personalized learning paths
* Multi-language support
* Offline mode support
* Advanced analytics dashboard

---

## 📌 Conclusion

This project demonstrates how AI can transform static educational systems into **interactive, decision-based learning environments** with real-world applicability.

---

## 🎥 Demo





https://github.com/user-attachments/assets/aa153885-0885-49ed-8a47-0cc5b468bc7d







---

## 👨‍💻 Author

Rohan R
