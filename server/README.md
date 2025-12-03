# Server — Daylytics (v1.0.0)

This server implements a simple Express API with JWT auth and models for daily tasks and archives.

Quick start:

1. Copy `.env.example` to `.env` and update `MONGO_URI`, `JWT_SECRET`.
2. Install dependencies: `npm install`.
3. Start in dev mode: `npm run dev`.

API endpoints (v1):

- POST /api/auth/register
- POST /api/auth/login
- PUT /api/auth/profile
- PUT /api/auth/password
- GET /api/tasks?date=YYYY-MM-DD
- POST /api/tasks
- PATCH /api/tasks/:id
- DELETE /api/tasks/:id
- POST /api/archive/rollover?date=YYYY-MM-DD
- GET /api/archive

Utility scripts
- Seed test data (create a seeded test user and yesterday's tasks):

	npm run seed

- Rollover (archive) for all users for yesterday or a given date:

	npm run rollover -- YYYY-MM-DD

	Quick test / verification flow
	1. Run the server in one terminal: `npm run dev`
	2. In another terminal run the seed: `npm run seed` — this creates a `test@example.com` user (password `password`) and 4 tasks for _yesterday_.
	3. Make a request to archive the day (or use the rollover script):

		`npm run rollover` — archives yesterday's tasks and removes them from the tasks collection.

	4. Query `/api/archive` using the same user token to confirm the record exists.

	You can also use the Dashboard's "Archive yesterday" button when signed in as the test user.

