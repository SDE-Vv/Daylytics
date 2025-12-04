# Daylytics

> A powerful daily task management app with built-in analytics to track your productivity.

**Current Version:** `1.2.1` (Stable)

---

## 🚀 Features

### Version 1.2.1 (Current — Stable)
- **Release Date:** December 4, 2025
- **Highlights:**
   - **Task Editing** - Edit task titles directly with inline editing mode
   - **Delete All Tasks** - Remove all tasks for a specific date with confirmation
   - **Task View Modal** - Click on any task to view full details in a popup
   - **Text Truncation** - Long task titles now show ellipsis (...) with overflow handling
   - **Task Validation** - Maximum 500 characters and 50 words per task
   - **Improved Archive System** - Tasks are no longer deleted after archiving, preserved in database
   - **Checkbox-only Toggle** - Task completion only toggles when clicking the checkbox
- **User Authentication** - Secure registration and login with JWT tokens
- **Daily Task Management** - Create, toggle, edit, and delete tasks for specific dates
- **Task Analytics** - Archive past tasks and view completion statistics
- **Profile Management** - Update name, email, and password directly from dashboard
- **Dark/Light Mode** - GitHub-inspired theme with seamless switching
- **Mobile Optimized** - Responsive design with slide-out sidebar and icon navigation
- **Toast Notifications** - Real-time feedback for all user actions
- **Logout Confirmation** - Prevent accidental logouts
- **Split-Screen Auth** - Beautiful login/register pages with branding
- **Server Pinging** - Automated keep-alive mechanism that reduces request delays
- **CORS Security** - Restricted access to localhost and production frontend only

---

## 🛠️ Tech Stack

### Frontend
- **React** `18.2.0` - UI library
- **Vite** `5.0.0` - Build tool and dev server
- **React Router** `6.14.0` - Client-side routing
- **Bootstrap** `5.3.0` - CSS framework with custom theming
- **Remix Icon** `4.7.0` - Icon library
- **Axios** `1.4.0` - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express** `4.18.2` - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** `7.0.0` - MongoDB ODM
- **JWT** `9.0.0` - Authentication tokens
- **bcryptjs** `2.4.3` - Password hashing
- **CORS** `2.8.5` - Cross-origin resource sharing

---

## 📁 Folder Structure

```
Daylytics/
├── client/                    # Frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProfileModal.jsx
│   │   │   └── ToastProvider.jsx
│   │   ├── context/           # React context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── styles/            # Custom CSS
│   │   │   ├── theme.css
│   │   │   └── motions.css
│   │   ├── api/               # API client
│   │   │   └── index.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── server/                    # Backend application
│   ├── src/
│   │   ├── models/            # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Task.js
│   │   │   └── DailyArchive.js
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.js
│   │   │   ├── tasks.js
│   │   │   └── archive.js
│   │   ├── middleware/        # Custom middleware
│   │   │   └── auth.js
│   │   ├── config/            # Configuration
│   │   │   └── db.js
│   │   └── index.js           # Server entry point
│   ├── scripts/               # Utility scripts
│   │   ├── seedTestData.js
│   │   └── rolloverAll.js
│   └── package.json
│
└── README.md
```

---

## 🏃 Running Locally

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Daylytics
   ```

2. **Setup Backend**
   ```powershell
   cd server
   npm install
   ```
   
   Create `.env` file in `server/` directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/daylytics
   JWT_SECRET=your_secret_key_here
   PORT=5000
   BACKEND_URL=http://localhost:5000/api/health
   ```

3. **Setup Frontend**
   ```powershell
   cd client
   npm install
   ```
   
   Create `.env` file in `client/` directory (optional):
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start Development Servers**
   
   **Terminal 1 - Backend:**
   ```powershell
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`
   
   **Terminal 2 - Frontend:**
   ```powershell
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

5. **Access the Application**
   - Open browser and navigate to `http://localhost:5173`
   - Register a new account or use seeded test data

### Optional: Seed Test Data
```powershell
cd server
npm run seed
```
This creates a test user:
- **Email:** `test@example.com`
- **Password:** `password`
- **Tasks:** 4 tasks for yesterday (2 completed, 2 pending)

---

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Tasks
- `GET /api/tasks?date=YYYY-MM-DD` - Get tasks for date
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Edit task title
- `PATCH /api/tasks/:id` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task
- `DELETE /api/tasks?date=YYYY-MM-DD` - Delete all tasks for date

### Archive
- `POST /api/archive/rollover?date=YYYY-MM-DD` - Archive tasks for date
- `GET /api/archive` - Get all archived days

---

## 📦 Version History

### v1.2.1 (Current — Stable)
**Release Date:** December 4, 2025

**New Features:**
- ✅ **Task Editing** - Edit task titles with inline editing mode (Save/Cancel icons with hover animations)
- ✅ **Delete All Tasks** - Bulk delete all tasks for a specific date with confirmation modal
- ✅ **Task View Modal** - Click on task content to view full details in popup
- ✅ **Task Validation** - Maximum 500 characters and 50 words per task title
- ✅ **Text Truncation** - Long task titles display with ellipsis (...) and proper overflow handling

**Improvements:**
- ✅ **Improved Archive System** - Tasks no longer deleted after archiving, preserved in database for history
- ✅ **Checkbox-only Toggle** - Task completion only triggers when clicking checkbox (not entire row)
- ✅ **Enhanced Button Styles** - Edit, save, cancel buttons use same hover animation pattern as delete
- ✅ **Better Mobile Spacing** - Reduced padding and margins on mobile to prevent component overlap

**API Updates:**
- `PUT /api/tasks/:id` - New endpoint for editing task titles
- `DELETE /api/tasks?date=YYYY-MM-DD` - New endpoint for bulk deletion
- Enhanced validation on task creation and editing

---

### v1.1.1 (Stable)
**Release Date:** December 4, 2025

**Fixes & Improvements:**
- ✅ Fixed login redirection — users now go straight to the dashboard after successful login.
- ✅ Theme improvements — dark/light theme is now dynamic and fetched/persisted per-user (supports `system`, `light`, `dark`).
- ✅ Better UX for task updates/deletes — per-task loaders and disabled controls while requests are in-flight.
- ✅ Improved responsiveness on very small screens so layout and controls remain usable.
- ✅ Added GitHub contribution button directly on the dashboard.
- ✅ Fixed task border visual issues for consistent item styling.

---

### v1.0.1 (Stable)
**Release Date:** December 4, 2025

**New Features:**
- ✅ Server pinging mechanism - Keeps backend alive and reduces cold start delays
- ✅ Version display on dashboard - Shows current version in bottom-right corner
- ✅ Updated version badges on auth pages
- ✅ CORS security - Configured to only allow localhost and production frontend (https://daylytics.onrender.com)

**Improvements:**
- Optimized server response times with automated health checks every 10 minutes
- Better user experience with reduced initial request latency
- Enhanced security with restricted CORS origins

**Tech Updates:**
- Added Axios to server dependencies for health check requests
- Configured CORS whitelist for allowed origins

---

### v1.0.0 (Stable)
**Release Date:** December 2025

**Features:**
- ✅ Complete authentication system
- ✅ Daily task CRUD operations
- ✅ Task archiving and analytics
- ✅ Profile management
- ✅ Dark/light theme toggle
- ✅ Mobile-responsive design
- ✅ Toast notification system
- ✅ Split-screen auth pages

**Tech Stack:**
- React 18.2.0, Vite 5.0.0
- Express 4.18.2, MongoDB, Mongoose 7.0.0
- JWT authentication, bcryptjs

---

## 🎯 Usage

1. **Register/Login** - Create account or sign in
2. **Add Tasks** - Use quick-add panel or inline form to create tasks
3. **Manage Tasks** - Toggle completion status or delete tasks
4. **View Analytics** - Check completion statistics for archived days
5. **Update Profile** - Change name, email, or password from profile modal
6. **Toggle Theme** - Switch between light and dark mode
7. **Archive Tasks** - Archive previous days to track productivity

---

## 🧪 Development Scripts

### Server Scripts
```powershell
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed test data
npm run rollover # Archive tasks for all users
```

### Client Scripts
```powershell
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 📝 License

MIT

---
