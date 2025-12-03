# Client — Daylytics (v1.0.0)

Frontend built with Vite + React + Bootstrap.

Quick start:

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`

Environment
- VITE_API_URL to point to `http://localhost:5000` or your API URL

## Key UI features

- GitHub-like navbar with desktop tabs and a mobile hamburger menu so you can jump between **Tasks** and **Analytics** without losing context.
- Global overlay loader that keeps the dashboard hidden until the auth handshake plus tasks/analytics queries finish.
- Toast notifications for every auth + task action (invalid credentials, saves, deletes, etc.).
- Profile modal that lets you edit display name/email and rotate passwords directly from the dashboard (talks to the new `/api/auth/profile` + `/api/auth/password` endpoints).
- Logout confirmation modal so accidental taps on mobile do not boot the session immediately.

Testing the archive flow locally
1. Register a user or use `test@example.com` seeded from the server's `npm run seed` action (password: `password`).
2. After seeding, sign in and click "Archive yesterday" in the Dashboard — this calls the API to archive yesterday's tasks and stores the completion percentage.
3. Confirm records on the dashboard under "Analytics" or query `/api/archive` on the server with the user token.

### Profile & password updates

1. Open the avatar/profile button in the navbar (or via the mobile hamburger) to launch the modal.
2. Update name/email, hit **Save profile**, and the AuthContext will refresh the signed-in user details immediately.
3. Use the _Change password_ form to rotate credentials — it validates the current password server-side before saving.
