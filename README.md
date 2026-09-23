<div align="center">

<img src="Frontend/public/Logo.png" alt="Investigation Assistant Logo" width="110" />

# 🕵️ Investigation Assistant

**An AI-powered, Marathi-first investigation assistant for Maharashtra Police personnel**

Secure OTP-based access · AI chatbot · Marathi voice input · Marathi transliteration typing · Admin activity monitoring

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Botpress](https://img.shields.io/badge/Chatbot-Botpress-5C3BFE)](https://botpress.com/)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Application Routes](#-application-routes)
- [API Reference](#-api-reference)
- [Authentication Flow](#-authentication-flow)
- [Data Model](#-data-model)
- [e-MOB Submodule](#-e-mob-submodule)
- [Known Limitations & Roadmap](#-known-limitations--roadmap)
- [Contributing](#-contributing)
- [Author](#-author)

---

## 📖 About the Project

**Investigation Assistant** is a full-stack web application built to support police officers of **Maharashtra Police** during investigations. Officers register with their **district, taluka and police station**, verify themselves through an **email OTP**, and get access to an **AI chatbot assistant** that can be queried in **Marathi**, either by speaking (speech-to-text) or by typing phonetically in English and having it transliterated into Devanagari.

An **admin dashboard** gives supervisors visibility into who is registered, who has logged in, who is currently active, and how frequently each officer uses the system, including login/logout history and IP addresses.

The repository also links the **e-Modus Operandi Bureau (e-MOB)** crime-records management system as a Git submodule (see [e-MOB Submodule](#-e-mob-submodule)).

---

## ✨ Key Features

### 🔐 Secure Officer Authentication
- Officer **signup** with name, email, 10-digit phone number, district (जिल्हा), taluka (तालुका) and police station (पोलीस स्टेशन)
- **Email OTP verification** on signup: the account is only created after the OTP is confirmed
- **Two-step login**: email + password, followed by a 6-digit OTP sent to the registered email
- OTPs expire after **10 minutes**
- **Forgot password** flow with OTP verification and password reset
- Passwords hashed with **bcrypt** via a Mongoose pre-save hook
- **JWT** sessions valid for 24 hours, with a `/check-token` endpoint for session validation
- Branded HTML OTP emails sent through **Nodemailer (Gmail)**

### 🤖 AI Investigation Chatbot
- Embedded **Botpress** webchat assistant on the officer home page
- Widget is only shown on the protected `/home` route

### 🎙️ Marathi Voice Input
- Uses the browser's **Web Speech API** with the `mr-IN` locale
- Continuous recognition with live interim transcripts
- Floating panel to review, clear or send the recognised text

### ⌨️ Marathi Transliteration Typing
- Powered by **react-transliterate**: type Marathi phonetically in English letters and get Devanagari output
- Dedicated typing panel with clear/send actions

### 🎨 Adaptive UI
- Built with **Tailwind CSS**, responsive on desktop and mobile
- Automatic **light/dark theme detection** (system preference, `dark` classes and background brightness)
- Toast notifications via **react-toastify**

### 🛡️ Admin Dashboard
- Separate admin login protected by a server-side **admin secret**
- Admin JWT with the `admin` role, valid for 2 hours
- Dashboard sections:
  - **Dashboard Overview**: per-user summary with login/logout counts, last known IP and verification status
  - **All Users**: every registered officer
  - **Logged In Users**: officers who have logged in at least once
  - **Active Users**: officers currently logged in (last login later than last logout)
  - **Top Active Users**: most active officers
- Backend also supports filtering officers by **location** (district / taluka / police station) and by **registration date range**

---

## 🛠️ Tech Stack

### Frontend (`/Frontend`)

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite 7 | Dev server & build tool |
| React Router DOM 7 | Client-side routing & protected routes |
| Tailwind CSS 3 + PostCSS + Autoprefixer | Styling |
| Axios | HTTP client |
| @botpress/webchat | AI chatbot |
| react-transliterate | English → Marathi transliteration |
| Web Speech API | Marathi speech-to-text |
| @headlessui/react, @heroicons/react, react-icons | UI components & icons |
| react-toastify | Notifications |
| ESLint | Linting |

### Backend (`/Backend`)

| Technology | Purpose |
|---|---|
| Node.js (ES Modules) | Runtime |
| Express 5 | REST API framework |
| MongoDB + Mongoose 8 | Database & ODM |
| jsonwebtoken | JWT authentication |
| bcryptjs | Password hashing |
| Nodemailer | OTP emails via Gmail |
| cors, cookie-parser, body-parser | Middleware |
| dotenv | Environment configuration |
| nodemon | Development auto-reload |

---

## 📁 Repository Structure

```
Investigation-Assistance/
├── Backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Signup, login, OTP, forgot/reset password, logout
│   │   ├── adminController.js     # Admin login & user analytics
│   │   └── userController.js      # Officer profile
│   ├── middlewares/
│   │   └── authMiddleware.js      # protect (user JWT) & adminAuth (admin JWT)
│   ├── models/
│   │   └── User.js                # Officer schema with login/logout history
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── userRoutes.js          # /api/user/*
│   │   └── adminRoutes.js         # /api/admin/*
│   ├── utils/
│   │   └── sendEmail.js           # Nodemailer helper
│   ├── index.js                   # Express app entry point
│   └── package.json
│
├── Frontend/
│   ├── public/                    # Logo.png, BlueLogo.jpg
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Pages/
│   │   │       ├── UserOverview.jsx
│   │   │       ├── AllUsers.jsx
│   │   │       ├── LoggedInUsers.jsx
│   │   │       ├── ActiveUsers.jsx
│   │   │       └── TopActiveUsers.jsx
│   │   ├── components/
│   │   │   ├── Signup.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Pages/
│   │   │   └── HomePage.jsx       # Chatbot + Marathi voice + transliteration
│   │   ├── api.js                 # Axios instance & auth header helper
│   │   ├── App.jsx                # Routes
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── MOB-Application/               # Git submodule → e-MOB crime records system
├── .gitmodules
├── .gitignore
└── package.json
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│                                                              │
│  Officer:  /signup → /login → /home                          │
│            ├─ Botpress AI chatbot                            │
│            ├─ Marathi voice input (Web Speech API, mr-IN)    │
│            └─ Marathi transliteration typing                 │
│                                                              │
│  Admin:    /admin/login → /dashboard (user analytics)        │
└──────────────────────────────┬───────────────────────────────┘
                               │  Axios · JWT (Bearer)
┌──────────────────────────────▼───────────────────────────────┐
│                 Express 5 REST API (Node.js)                 │
│                                                              │
│   /api/auth   ── signup · OTP · login · reset · logout       │
│   /api/user   ── profile            (protect middleware)     │
│   /api/admin  ── user analytics     (adminAuth middleware)   │
│                                                              │
│   Nodemailer ──► Gmail SMTP (OTP emails)                     │
└──────────────────────────────┬───────────────────────────────┘
                               │  Mongoose
                     ┌─────────▼─────────┐
                     │      MongoDB      │
                     │  users collection │
                     └───────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or later and **npm**
- **MongoDB** (local instance or MongoDB Atlas)
- A **Gmail account** with an [App Password](https://support.google.com/accounts/answer/185833) for sending OTP emails
- **Google Chrome** or **Microsoft Edge** (recommended for Marathi voice input, since the Web Speech API is not supported in every browser)

### 1. Clone the repository (with submodule)

```bash
git clone --recurse-submodules https://github.com/Shantanu-Kulkarni1229/Investigation-Assistance.git
cd Investigation-Assistance
```

If you already cloned without submodules:

```bash
git submodule update --init --recursive
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/` (see [Environment Variables](#-environment-variables)), then start the server:

```bash
npm run dev
```

The API runs on **http://localhost:5000**.

### 3. Set up the frontend

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The app runs on **http://localhost:5173**.

### 4. Available scripts

| Location | Command | Description |
|---|---|---|
| `Backend/` | `npm run dev` | Start the API with nodemon |
| `Frontend/` | `npm run dev` | Start the Vite dev server |
| `Frontend/` | `npm run build` | Create a production build in `dist/` |
| `Frontend/` | `npm run preview` | Preview the production build |
| `Frontend/` | `npm run lint` | Run ESLint |

---

## 🔑 Environment Variables

Create `Backend/.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/investigation-assistant

# Authentication
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_SECRET=replace_with_a_strong_admin_password

# Email (Gmail + App Password)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | API port (defaults to `5000`) |
| `NODE_ENV` | No | Set to `development` to include error details in some responses |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign user and admin JWTs |
| `ADMIN_SECRET` | Yes | Password used on the admin login page |
| `EMAIL_USER` | Yes | Gmail address used to send OTPs |
| `EMAIL_PASS` | Yes | Gmail App Password (not your normal password) |

> ⚠️ `.env` is already listed in `.gitignore`. Never commit real secrets.

**Frontend configuration:** the API base URL is set in `Frontend/src/api.js` (`http://localhost:5000/api`). Allowed CORS origins are configured in `Backend/index.js`. Update both when deploying.

---

## 🧭 Application Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Redirects to `/signup` |
| `/signup` | Public | Officer registration with OTP verification |
| `/login` | Public | Email/password login followed by OTP |
| `/forgot-password` | Public | OTP-based password reset |
| `/home` | Officer (JWT) | AI chatbot, Marathi voice input & transliteration |
| `/admin/login` | Public | Admin login using the admin secret |
| `/dashboard` | Admin (JWT) | Admin analytics dashboard |

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

### Auth — `/api/auth`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/signup` | `name, email, password, phoneNumber, district, taluka, policeStation` | Validates details and emails a signup OTP |
| POST | `/verify-signup-otp` | `email, otp` | Verifies OTP and creates the account |
| POST | `/login` | `email, password` (or `token`) | Verifies credentials and emails a login OTP; returns `userId` |
| POST | `/verify-login-otp` | `userId, otp` | Verifies OTP and returns a 24h JWT |
| POST | `/forgot-password` | `email` | Emails a password-reset OTP; returns `userId` |
| POST | `/verify-forgot-otp` | `userId, otp` | Verifies the reset OTP |
| POST | `/reset-password` | `userId, newPassword` | Sets a new password |
| POST | `/logout` | — | Records logout and clears the token cookie |
| GET | `/check-token` | — *(Bearer token)* | Validates the JWT and returns the user |

<details>
<summary><b>Example: login flow</b></summary>

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "officer@example.com", "password": "secret123" }
```

```json
{ "success": true, "message": "OTP sent to your email", "userId": "66b1f..." }
```

```http
POST /api/auth/verify-login-otp
Content-Type: application/json

{ "userId": "66b1f...", "otp": "482913" }
```

```json
{ "success": true, "message": "Login successful", "token": "eyJhbGciOi..." }
```
</details>

### User — `/api/user`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/profile` | Bearer (officer) | Returns the logged-in officer's profile |

### Admin — `/api/admin`

All endpoints except `/login` require `Authorization: Bearer <adminToken>`.

| Method | Endpoint | Query | Description |
|---|---|---|---|
| POST | `/login` | — (body: `secret`) | Returns a 2h admin JWT |
| GET | `/users` | — | All registered officers |
| GET | `/users/logged-in` | — | Officers who have logged in at least once |
| GET | `/users/active` | — | Officers currently logged in |
| GET | `/users/overview` | — | Summary with login/logout counts and last IP |
| GET | `/users/location` | `district`, `taluka`, `policeStation` | Filter officers by location |
| GET | `/users/date-range` | `startDate`, `endDate` | Officers registered in a date range |
| GET | `/users/top-active` | — | Top 10 most active officers |
| GET | `/users/:userId` | — | Single officer by ID |

Sensitive fields (`password`, `otp`, `otpExpires`) are always excluded from admin responses.

---

## 🔄 Authentication Flow

```
SIGNUP
  Officer fills form ─► POST /auth/signup ─► OTP emailed (held temporarily, 10 min)
                     ─► POST /auth/verify-signup-otp ─► Account created (isVerified = true)

LOGIN
  Email + password ─► POST /auth/login ─► login recorded + OTP emailed
                   ─► POST /auth/verify-login-otp ─► JWT (24h) saved in localStorage
                   ─► Redirect to /home

FORGOT PASSWORD
  Email ─► POST /auth/forgot-password ─► OTP emailed
        ─► POST /auth/verify-forgot-otp ─► POST /auth/reset-password

ADMIN
  Secret ─► POST /admin/login ─► admin JWT (2h) saved as adminToken ─► /dashboard
```

---

## 🗄️ Data Model

### `User`

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, min 2 characters |
| `email` | String | Required, unique, lowercase, validated |
| `password` | String | Required, min 6, bcrypt-hashed |
| `phoneNumber` | String | Required, unique, 10 digits |
| `district` | String | Required |
| `taluka` | String | Required |
| `policeStation` | String | Required |
| `isVerified` | Boolean | Set to `true` after signup OTP |
| `otp`, `otpExpires` | String, Date | Login / reset OTP |
| `registeredAt` | Date | Defaults to now |
| `lastLogin`, `lastLogout` | Date | Session tracking |
| `loginHistory` | `[{ timestamp, ip }]` | Every login |
| `logoutHistory` | `[{ timestamp, ip }]` | Every logout |
| `logoutCount` | Number | Total logouts |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

---

## 🔗 e-MOB Submodule

`MOB-Application/` points to the separate repository **[Shantanu-Kulkarni1229/MOB-Application](https://github.com/Shantanu-Kulkarni1229/MOB-Application)**: the **e-Modus Operandi Bureau**, a crime-records management system for the Local Crime Branch, Chhatrapati Sambhajinagar Rural. It includes accused records, divisions/police stations, crime types, audit logs, English/Marathi UI and PDF/Excel exports, built with React + TypeScript and Node/Express/MongoDB.

It has its own backend, frontend and setup instructions. See [`MOB-Application/README.md`](MOB-Application/README.md).

---

## 🧩 Known Limitations & Roadmap

- [ ] Move the API base URL to an environment variable (`VITE_API_URL`) instead of hard-coding it in `api.js`
- [ ] Store pending signup OTPs in MongoDB or Redis instead of in memory (they are currently lost on server restart)
- [ ] Protect `/api/auth/logout` with the auth middleware so logout history is recorded reliably
- [ ] Compute "Top Active Users" with an aggregation on `loginHistory` size
- [ ] Add rate limiting and OTP attempt limits
- [ ] Connect Marathi voice/typed input directly to the chatbot conversation
- [ ] Deployment guide (Render / Railway / Vercel)
- [ ] Automated tests

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the existing code style and run `npm run lint` in `Frontend/` before submitting.

---

## 👤 Author

**Shantanu Kulkarni**

- GitHub: [@Shantanu-Kulkarni1229](https://github.com/Shantanu-Kulkarni1229)

---

<div align="center">

Built to support the officers of **Maharashtra Police** 🚔

⭐ Star this repository if you find it useful!

</div>
