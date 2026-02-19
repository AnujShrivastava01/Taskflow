# 🚀 TaskFlow - MERN Stack Dashboard with Authentication

A full-stack web application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) featuring secure JWT authentication, a beautiful dark-themed dashboard, and full CRUD operations on tasks.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Security Practices](#-security-practices)
- [Scalability Notes](#-scalability-notes)
- [Screenshots](#-screenshots)

---

## ✨ Features

### Authentication
- ✅ User registration with validation
- ✅ JWT-based login/logout
- ✅ Password hashing with bcrypt (12 salt rounds)
- ✅ Protected routes (frontend + backend)
- ✅ Auto-redirect on token expiry
- ✅ Password change functionality

### Dashboard
- ✅ Real-time task statistics (aggregation pipeline)
- ✅ Priority distribution with progress bars
- ✅ Completion rate tracker
- ✅ Recent tasks overview
- ✅ Quick action shortcuts
- ✅ Overdue & due-today alerts

### Task Management (CRUD)
- ✅ Create, Read, Update, Delete tasks
- ✅ Search by title/description
- ✅ Filter by status (pending/in-progress/completed)
- ✅ Filter by priority (low/medium/high)
- ✅ Pagination
- ✅ Quick status toggle
- ✅ Due dates and tags
- ✅ Form validation (client + server)

### User Profile
- ✅ View/edit profile (name, email, bio)
- ✅ Change password (with current password verification)
- ✅ Account information display

### UI/UX
- ✅ Dark theme with glassmorphism
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations (Framer Motion)
- ✅ Collapsible sidebar
- ✅ Toast notifications
- ✅ Loading skeletons
- ✅ Custom scrollbar
- ✅ Password strength indicator

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 19, Vite, TailwindCSS v4 |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **HTTP** | Axios with interceptors |
| **State** | React Context API |
| **UI** | Framer Motion, Lucide Icons |
| **Validation** | express-validator (server), custom (client) |
| **Security** | Helmet.js, CORS, rate limiting ready |

---

## 📁 Project Structure

```
Project/
├── Backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Auth business logic
│   │   └── taskController.js    # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── errorHandler.js      # Centralized error handling
│   ├── models/
│   │   ├── User.js              # User schema + password hashing
│   │   └── Task.js              # Task schema + indexes
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints + validation
│   │   └── taskRoutes.js        # Task endpoints + validation
│   ├── utils/
│   │   └── generateToken.js     # JWT token generator
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment template
│   ├── package.json
│   └── server.js                # Express entry point
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx  # Layout with sidebar + header
│   │   │   ├── ProtectedRoute.jsx   # Auth guard component
│   │   │   └── Sidebar.jsx          # Collapsible navigation
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── pages/
│   │   │   ├── DashboardHome.jsx    # Stats + analytics
│   │   │   ├── Landing.jsx          # Public homepage
│   │   │   ├── Login.jsx            # Login form
│   │   │   ├── Profile.jsx          # Profile management
│   │   │   ├── Register.jsx         # Registration form
│   │   │   ├── Settings.jsx         # Password change
│   │   │   └── Tasks.jsx            # Full CRUD interface
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + interceptors
│   │   ├── App.jsx                  # Root component + routing
│   │   ├── index.css                # TailwindCSS + design system
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js              # Vite + TailwindCSS + proxy
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ installed
- **MongoDB** running locally or MongoDB Atlas account
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Project
```

### 2. Backend Setup
```bash
cd Backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env with your MongoDB URI and JWT secret
cp .env.example .env

# Start the development server
npm run dev
```
The backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd Frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
The frontend will run on `http://localhost:5173`

### 4. Access the Application
Open `http://localhost:5173` in your browser.

---

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| PUT | `/auth/profile` | Update profile | ✅ |
| PUT | `/auth/password` | Change password | ✅ |

### Task Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | Get all tasks (with filters) | ✅ |
| GET | `/tasks/stats` | Get task statistics | ✅ |
| POST | `/tasks` | Create a task | ✅ |
| GET | `/tasks/:id` | Get single task | ✅ |
| PUT | `/tasks/:id` | Update a task | ✅ |
| DELETE | `/tasks/:id` | Delete a task | ✅ |

### Query Parameters (GET /tasks)

| Param | Description | Example |
|-------|-------------|---------|
| search | Search title/description | `?search=design` |
| status | Filter by status | `?status=pending` |
| priority | Filter by priority | `?priority=high` |
| sort | Sort field (prefix - for desc) | `?sort=-createdAt` |
| page | Page number | `?page=2` |
| limit | Items per page | `?limit=10` |

### Request/Response Examples

#### Register
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response (201):
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOi..."
}
```

#### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": { ... },
  "token": "eyJhbGciOi..."
}
```

#### Create Task
```json
POST /api/tasks
Authorization: Bearer <token>
{
  "title": "Design landing page",
  "description": "Create wireframes for the new landing page",
  "priority": "high",
  "dueDate": "2026-03-01",
  "tags": ["design", "frontend"]
}
```

### Utility Endpoint
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

---

## 🔒 Security Practices

1. **Password Hashing**: bcrypt with 12 salt rounds
2. **JWT Tokens**: Signed with HS256, 7-day expiry
3. **Protected Routes**: Both frontend (ProtectedRoute) and backend (auth middleware)
4. **Input Validation**: express-validator on all endpoints
5. **Helmet.js**: Sets security HTTP headers
6. **CORS**: Configured to allow only the frontend origin
7. **Error Handling**: Centralized, no stack traces leaked in production
8. **Password Select**: Password field excluded from queries by default
9. **Generic Auth Errors**: "Invalid credentials" (prevents email enumeration)
10. **Request Size Limit**: 10MB max body size

---

## 📈 Scalability Notes

### How to Scale for Production

1. **Database**
   - Use MongoDB Atlas for managed hosting
   - Add indexes for frequently queried fields (already done)
   - Consider Redis for session/cache layer

2. **Backend**
   - Add rate limiting (express-rate-limit)
   - Implement request logging (Morgan → Winston/Pino)
   - Add input sanitization (express-mongo-sanitize)
   - Containerize with Docker
   - Use PM2 for process management
   - Add health checks and monitoring

3. **Frontend**
   - Code splitting with React.lazy()
   - Image optimization and CDN
   - Service workers for offline support
   - Consider SSR with Next.js for SEO

4. **Architecture**
   - Separate services for auth, tasks, notifications
   - Message queues for async operations (RabbitMQ/Redis)
   - API gateway (nginx) for load balancing
   - CI/CD pipeline (GitHub Actions)

5. **Security Enhancements**
   - Move JWT to httpOnly cookies
   - Add refresh token rotation
   - Implement RBAC (Role-Based Access Control)
   - Add 2FA (Two-Factor Authentication)
   - Rate limit login attempts

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).
