# Daylytics — Task Manager (v1.0.0)

This repository contains a MERN-stack task manager app planned across 5 versions. Version 1.0.0 (this workspace) includes:

- User registration and login (JWT)
- Daily tasks: users add tasks per day; tasks belong to a specific day
- Daily archive: tasks from previous days are stored as analytics (percentage complete)
- GitHub-inspired dashboard UI with loader, custom toasts, and a responsive navbar/hamburger experience
- Profile modal for updating name/email/password without leaving the dashboard
- Logout confirmation workflow and dedicated tabs for Tasks vs Analytics (mobile-friendly)

Tech stack (v1):
- Backend: Node.js, Express, MongoDB (Mongoose), JWT
- Frontend: React (Vite), JavaScript, Bootstrap with a custom theme

Quick start (dev):

1. Open two terminals (server and client). Install dependencies for each and start both systems.

Server — in ./server

```powershell
cd server; npm install
# copy .env.example to .env and update MONGO_URI & JWT_SECRET
npm run dev
```

Client — in ./client

```powershell
cd client; npm install
# set VITE_API_URL in environment or use .env
npm run dev
```

This is a minimal, industry-aware scaffolding to get started. See the `server/` and `client/` directories for details.

Repository layout (industry-friendly)

- client/ — Vite + React frontend
	- src/components — small reusable components
	- src/pages — Register, Login, Dashboard
	- public/index.html

- server/ — Express / Mongoose API
	- src/models — Mongoose models (User, Task, DailyArchive)
	- src/routes — API route handlers
	- src/middleware — auth middleware and helpers
	- scripts/ — developer scripts (seed, rollover)

Recommended next-version roadmap (v2 → v5)

v2 (v1.1): Improve frontend UX, add validation, better error handling, and user profile

v3 (v1.5): Add scheduled archiving (cron or cloud scheduler) and analytics dashboards (graphs)

v4 (v2.0): Add offline mode, task syncing, and more granular analytics (time-of-day, categories)

v5 (v3.0): Add collaboration features, multi-user workspaces, and mobile-first design

If you'd like, I can implement any of these next steps — tell me which one to prioritize and I'll scaffold it next.
