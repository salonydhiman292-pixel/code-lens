# 🔍 Code Lens — AI-Powered Software Change Intelligence Platform

Code Lens is a comprehensive full-stack platform designed to analyze software repositories, forecast defect risk, flag static code smells, detect security vulnerabilities (SAST with OWASP/CWE mappings), compute technical debt, and provide interactive AI-assisted code remediation powered by Google Gemini.

---

## 🚀 Key Features

- **📊 Central Intelligence Dashboard**: Aggregated health metrics across all repositories (Total Commits, Active Issues, Technical Debt hours, High-Risk Changes).
- **📂 Repository Management**: Connect, analyze, refresh, and monitor multiple GitHub repositories.
- **🔍 Static Code Analysis**: Deep AST-based linting, code smells, duplicate code detection, and architectural complexity analysis.
- **⚡ AI Risk Prediction Engine**: Defect forecasting on incoming changes with SHAP-based feature attribution explainability.
- **🛡️ SAST Security Scanner**: Identifies security vulnerabilities, categorized by severity (Critical, High, Medium, Low) with OWASP/CWE references and AI remediation roadmaps.
- **⏳ Technical Debt Estimator**: Quantifies technical debt in engineer-hours and provides automated refactoring task breakdowns.
- **🤖 Gemini AI Code Assistant**: Interactive conversational AI assistant contextualized to your repository's findings and architecture.
- **📄 Architecture & PDF Documentation**: Integrated technical reference manual and exportable documentation.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS, Lucide React icons
- **Routing**: React Router DOM
- **Charts & Visualization**: Recharts, Canvas Confetti

### **Backend**
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **AI Intelligence**: Google Gemini API (`gemini-3.5-flash-lite`)
- **Security & Utilities**: CORS, Dotenv, PDFKit

---

## 📁 Project Structure

```text
CODE-LENS/
├── BACKEND/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/              # Route controllers (auth, repo, analysis, risk, security, debt, chat)
│   ├── models/                   # Mongoose schemas (User, Repository, Analysis, Risk, Security, Debt)
│   ├── routes/                   # Express API endpoints
│   ├── services/
│   │   └── geminiService.js      # Google Gemini AI integration
│   ├── .env.example              # Template environment variables
│   ├── server.js                 # Express server entry point
│   └── package.json
│
├── FRONTEND/
│   └── vite-project/             # React Vite Application
│       ├── src/
│       │   ├── pages/            # Dashboard, Repositories, CodeAnalysis, RiskPrediction, Security, etc.
│       │   ├── components/       # Shared UI components and modals
│       │   ├── services/api.js   # Centralized Axios API service
│       │   └── App.jsx
│       └── package.json
│
├── Code_Lens_Backend_Documentation.pdf   # 14-page system architecture & API manual
└── README.md
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas connection string
- Google Gemini API key

---

### 1. Backend Setup

```bash
cd BACKEND

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and Gemini API key

# Start backend server
npm start
```
The backend server runs on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd FRONTEND/vite-project

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
The frontend application runs on `http://localhost:5173`.

---

## 🔐 Environment Variables

In `BACKEND/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_key
```

*(Note: Sensitive keys are excluded from git tracking via `.gitignore`)*

---

## 📜 Documentation

For in-depth architecture diagrams, component breakdown, and API endpoint documentation, refer to [`Code_Lens_Backend_Documentation.pdf`](./Code_Lens_Backend_Documentation.pdf).
