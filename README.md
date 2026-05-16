# AarvieveLifeSync

> A centralized personal productivity platform built with React, Express, Firebase, and TypeScript.

## 🚀 Features

- **📋 Task Management** — Create, edit, prioritize, and track tasks with due dates
- **💰 Expense Tracker** — Track spending by category with charts and analytics
- **🔐 Password Vault** — AES-encrypted credential storage with reveal/copy
- **⏱️ Time Tracker** — Live timer, manual entries, weekly productivity charts
- **🍽️ Food Tracker** — Calorie counting, macros, meal logging with daily rings
- **📊 Unified Dashboard** — Aggregated stats, charts, and recent activity
- **📄 PDF Export** — Downloadable reports for expenses, time, and food
- **🔒 Authentication** — Firebase Auth with register, login, password reset

## 🏗️ Architecture

```
AarvieveLifeSync/
├── client/          # React + Vite + TypeScript frontend
├── server/          # Express + TypeScript backend
├── shared/          # Shared types/interfaces
├── docs/            # Documentation & Firebase rules
├── .env.example     # Environment variables template
└── package.json     # Monorepo root (npm workspaces)
```

### Backend Architecture Flow
```
Request → Route → Middleware → Controller → Service → Repository → Firestore
```

## 🛠️ Tech Stack

| Layer        | Technology                                       |
|-------------|--------------------------------------------------|
| Frontend    | React, TypeScript, Vite, Tailwind CSS            |
| State       | Zustand, TanStack Query                          |
| Charts      | Recharts                                         |
| Animations  | Framer Motion                                    |
| Backend     | Node.js, Express, TypeScript                     |
| Database    | Firebase Firestore                               |
| Auth        | Firebase Authentication                          |
| Validation  | Zod                                              |
| Encryption  | CryptoJS (AES)                                   |
| PDF         | PDFKit                                           |
| Security    | Helmet, CORS, Rate Limiting                      |

## 📦 Setup

### Prerequisites
- Node.js 18+
- Firebase project with Firestore, Auth, and Storage enabled
- Firebase service account credentials

### 1. Clone & Install

```bash
git clone <repo-url> AarvieveLifeSync
cd AarvieveLifeSync
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your Firebase credentials:

```bash
cp .env.example .env
```

### 3. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Firestore Database** (production mode)
3. Enable **Authentication** (Email/Password)
4. Generate a **service account** key (Project Settings → Service Accounts)
5. Copy the project config to your `.env`
6. Deploy Firestore rules from `docs/firestore.rules`

### 4. Development

```bash
# Run both client and server
npm run dev

# Or separately
npm run dev:client    # http://localhost:5173
npm run dev:server    # http://localhost:5000
```

## 🚀 Deployment

### Frontend → Vercel
```bash
cd client
vercel deploy
```

### Backend → Render/Railway
- Build command: `cd server && npm run build`
- Start command: `cd server && npm start`
- Set environment variables in the dashboard

### Environment Variables for Production

| Variable | Where |
|----------|-------|
| `VITE_*` | Vercel (frontend) |
| `FIREBASE_*`, `ENCRYPTION_*`, `PORT`, `CLIENT_URL` | Render/Railway (backend) |

## 📁 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sync` | Sync user profile |
| GET | `/api/auth/profile` | Get user profile |
| GET/POST/PUT/DELETE | `/api/tasks` | Task CRUD |
| GET/POST/PUT/DELETE | `/api/expenses` | Expense CRUD |
| GET/POST/PUT/DELETE | `/api/passwords` | Password vault CRUD |
| GET/POST | `/api/time` | Time entries |
| POST | `/api/time/start` | Start timer |
| PUT | `/api/time/:id/stop` | Stop timer |
| GET/POST/PUT/DELETE | `/api/food` | Food entries |
| GET | `/api/dashboard/stats` | Dashboard statistics |
| GET | `/api/reports/expenses` | Export expense PDF |
| GET | `/api/reports/time` | Export time PDF |
| GET | `/api/reports/food` | Export food PDF |

## 🔒 Security

- **Helmet** — HTTP security headers
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **CORS** — Configured for frontend origin
- **Input Validation** — Zod schemas on all endpoints
- **AES Encryption** — Password vault entries encrypted at rest
- **Firebase Auth** — JWT token verification on all protected routes
- **Firestore Rules** — User-level data isolation

## 📝 License

MIT
