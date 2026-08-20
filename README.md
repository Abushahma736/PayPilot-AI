# PayPilot AI – Intelligent Shopping & Payment Agent 🛍️💳

Built for the **Razorpay AI Builder Internship 2026**.

**PayPilot AI** is a full-stack, autonomous shopping and checkout assistant that understands natural language queries, extracts budgets and user preferences, compares suitable items across a catalog, generates transparent decision reasoning, manages a smart cart with budget limits, and processes payments via Razorpay (with simulated test payment support).

---

## 🌟 Key Highlights & Internship Presentation Features

1. **Autonomous Agent Pipeline**:
   - Visual 6-step agent flow (**Understand → Search → Compare → Recommend → Cart → Checkout**)
   - Real-time pipeline step updates with live telemetry.

2. **Dedicated “AI Decision Matrix”**:
   - Transparent, explainable AI showcase showing:
     - **Budget Envelope** match & estimated savings
     - **Key Value Factors** (e.g. 50+ hr battery, 4+ rating, value for money)
     - **Agent Strategy & Reasoning**
     - **Alternative Suggestions** for specs slightly outside target

3. **Smart Cart & Real-Time Budget Watcher**:
   - Interactive budget limit setting
   - Visual budget consumption progress bar
   - Instant over-budget warnings with one-click AI assistance for cheaper alternatives

4. **Dual AI Mode & Dual Payment Mode**:
   - **AI Engine**: Seamless OpenAI GPT integration with an intelligent, rule-based NLP fallback engine when no key is set.
   - **Payment Gateway**: Production Razorpay Checkout SDK with automatic, safe Demo Payment Mode fallback.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v3 + Lucide Icons + Framer Motion
- **Backend**: Node.js + Express.js + Mongoose
- **Database**: MongoDB (Local or Atlas)
- **AI**: OpenAI API (GPT-3.5/4) with intelligent NLP fallback
- **Payments**: Razorpay Checkout SDK + Secure Mock Gateway
- **Auth**: JSON Web Tokens (JWT) + bcrypt password hashing

---

## 📁 Project Structure

```
PayPilot AI/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/         # Navbar, Footer, ProtectedRoute, LoadingSpinner, EmptyState
│   │   │   ├── chat/           # ChatInterface, ChatMessage, AgentWorkflow, AIDecision
│   │   │   ├── products/       # ProductCard, ProductFilters
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Landing, Login, Register, Dashboard, Chat, Products, Cart, Checkout, Orders
│   │   ├── services/           # Axios API instance
│   │   ├── utils/              # Helpers (currency, date, badges)
│   │   ├── App.jsx             # React Router setup
│   │   ├── main.jsx
│   │   └── index.css           # Design tokens & glassmorphism styling
├── server/                     # Express.js Backend
│   ├── config/                 # MongoDB connection
│   ├── middleware/             # JWT auth & centralized error handler
│   ├── models/                 # User, Product, Cart, Order, AIInteraction
│   ├── routes/                 # auth, products, cart, ai, payments, orders
│   ├── services/               # aiService (OpenAI + Fallback), paymentService (Razorpay + Demo)
│   ├── scripts/                # seed.js (20+ realistic products in INR)
│   └── server.js               # Express API entry
├── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js (v18+)](https://nodejs.org/)
- [MongoDB (running locally or MongoDB Atlas URI)](https://www.mongodb.com/)

### 1. Clone & Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Default settings connect to `mongodb://localhost:27017/paypilot` and enable demo modes for AI & payments)*.

### 2. Install Dependencies
```bash
# In root:
npm run install:all
```
Or individually:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Seed Demo Product Catalog
Populate the database with 23+ realistic products across Electronics, Gaming, Home, Accessories, and Fashion:
```bash
cd server
npm run seed
```

### 4. Run the Application
In terminal 1 (Backend Server on Port 5000):
```bash
cd server
npm run dev
```

In terminal 2 (Vite Frontend on Port 5173):
```bash
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🧪 Sample Test Prompts for AI Assistant

Try typing or clicking on sample prompts in the Chat Interface:
- `"I need wireless headphones under ₹3000 with good battery life"`
- `"Best gaming mouse with RGB under ₹3500"`
- `"Looking for a water bottle or flask for home under ₹1000"`
- `"Smartwatch with calling under ₹4000"`
- `"Running shoes and athletic jacket under ₹5000"`

---

## 🔒 Security Best Practices
- Passwords hashed with `bcryptjs` (salt rounds: 10).
- Sensitive routes protected with JWT Bearer Token validation.
- Razorpay secret key stored purely server-side (only public key / mock ID sent to client).
- No secrets committed to source control.

---

## 📄 License
MIT License • Built by Hadi Q for Razorpay AI Builder Internship 2026.
