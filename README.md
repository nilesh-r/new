# 🏢 Enterprise Task & Workflow Management System (TaskFlow)

A **production-ready**, secure, full-stack enterprise application for managing organizational projects, tasks, and team productivity. Built with Spring Boot + React, backed by PostgreSQL, fully Dockerized, and deployed on Render + Vercel.

---

## 🌐 Live Deployment

| Service | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | *(your Vercel URL)* |
| **Backend API** | Render | https://new-c4u6.onrender.com |
| **Swagger API Docs** | Render | https://new-c4u6.onrender.com/swagger-ui/index.html |
| **Docker Image** | Docker Hub | `nileshr08/new-backend:latest` |

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Roles](#-user-roles)
- [Live Deployment](#-live-deployment)
- [Getting Started (Docker)](#-getting-started-docker--recommended)
- [Local Development](#-local-development)
- [Default Credentials](#-default-credentials)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Deployment Guide](#-deployment-guide)

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based stateless authentication — token stored in `localStorage`, auto-attached to every API request
- Auto-logout on token expiry via Axios response interceptor
- BCrypt password hashing — no plaintext passwords stored ever
- Role-Based Access Control (RBAC) — every page and API endpoint protected per role
- CORS configured for Vercel + localhost

### 📁 Project Management
- Create projects (Manager/Admin only)
- Live card grid of all projects from PostgreSQL
- Member count per project
- Auto-tracked creation timestamps

### ✅ Task Management
- Create tasks assigned to projects with priority and deadline
- Live task list fetched from database
- **Inline status update** — change `TODO` → `IN PROGRESS` → `DONE` via dropdown (calls `PATCH /api/tasks/{id}/status`)
- Priority levels: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` with color-coded badges
- **Live search** — filter tasks by title, description, or project name instantly

### 📊 Dashboard & Analytics
- Real-time stats: Total Projects, Pending Tasks, Completed Tasks, Team Members
- Interactive bar chart (Recharts) showing tasks by priority — live from DB
- Loading spinners and graceful empty states

### 👥 User Directory (Admin Only)
- Full employee directory with role badges
- Sidebar "Directory" link only visible to Admin users
- 403 handled gracefully for non-admin users

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Spring Boot 3.2, Spring Security 6, Spring Data JPA |
| **Authentication** | JWT (io.jsonwebtoken), BCrypt |
| **Database** | PostgreSQL 15 |
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **HTTP Client** | Axios (with request & 401 response interceptors) |
| **Icons** | Lucide React |
| **API Docs** | Springdoc OpenAPI (Swagger UI) |
| **Containerization** | Docker, Docker Compose |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |
| **Build Tool** | Maven |

---

## 👤 User Roles

| Role | Permissions |
|---|---|
| `ROLE_ADMIN` | Full access: view all users, create projects & tasks, view dashboard |
| `ROLE_MANAGER` | Create & manage projects and tasks; view dashboard |
| `ROLE_EMPLOYEE` | View projects and tasks; update task status |

> New users registered via `/api/auth/register` are assigned `ROLE_EMPLOYEE` by default.

---

## 🚀 Getting Started (Docker — Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

```bash
# Clone the repository
git clone https://github.com/your-username/enterprise-task-management.git
cd enterprise-task-management

# Build and start all services
docker-compose up --build
```

| Service | URL |
|---|---|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8081 |
| **Swagger Docs** | http://localhost:8081/swagger-ui/index.html |

---

## 💻 Local Development

### Step 1 — Start the Database
```bash
docker-compose up -d postgres
```

### Step 2 — Start the Backend
```bash
# From project root
mvn spring-boot:run
```

### Step 3 — Start the Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

---

## 🔐 Default Credentials

Auto-created on first startup by `DataSeeder.java`:

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin` |
| **Role** | `ROLE_ADMIN` |

> ⚠️ Change this password in production!

---

## 📡 API Reference

All endpoints prefixed with `/api`. JWT required unless marked Public.

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login, receive JWT token |
| `POST` | `/api/auth/register` | Public | Register (assigned EMPLOYEE role) |
| `GET` | `/api/auth/me` | Authenticated | Get current user profile & roles |

### Projects
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Authenticated | List all projects |
| `GET` | `/api/projects/{id}` | Authenticated | Get single project |
| `POST` | `/api/projects` | MANAGER / ADMIN | Create project |
| `POST` | `/api/projects/{projectId}/members/{userId}` | MANAGER / ADMIN | Add member |

### Tasks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Authenticated | List all tasks (paginated) |
| `GET` | `/api/tasks/project/{projectId}` | Authenticated | Tasks by project |
| `POST` | `/api/tasks` | MANAGER / ADMIN | Create task |
| `PATCH` | `/api/tasks/{taskId}/status?status=DONE` | Authenticated | Update task status |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | ADMIN only | List all users |

---

## 📂 Project Structure

```
enterprise-task-management/
│
├── src/main/java/com/enterprise/taskmanagement/
│   ├── config/
│   │   ├── DataSeeder.java          # Seeds roles + default admin on startup
│   │   ├── SecurityConfig.java      # JWT, CORS, RBAC
│   │   └── SwaggerConfig.java
│   ├── controller/
│   │   ├── AuthController.java      # Login, Register, /me
│   │   ├── ProjectController.java
│   │   ├── TaskController.java      # Includes PATCH status
│   │   └── UserController.java      # Admin only
│   ├── dto/
│   │   ├── ApiResponse.java         # Standard wrapper {success, message, data}
│   │   ├── UserDto.java             # Safe user data (no password field)
│   │   └── ...
│   ├── entity/
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── Project.java
│   │   ├── Task.java
│   │   ├── TaskStatus.java          # TODO, IN_PROGRESS, DONE
│   │   └── TaskPriority.java        # LOW, MEDIUM, HIGH, CRITICAL
│   └── security/
│       ├── JwtTokenProvider.java
│       ├── JwtAuthenticationFilter.java
│       └── CustomUserDetailsService.java
│
├── frontend/
│   ├── .env                         # Production: VITE_API_URL=https://new-c4u6.onrender.com/api
│   ├── .env.local                   # Local dev: VITE_API_URL=http://localhost:8081/api
│   └── src/
│       ├── context/AuthContext.jsx  # Auth state + hasRole() helper
│       ├── services/api.js          # Axios instance + 401 auto-logout interceptor
│       └── pages/
│           ├── Login.jsx
│           ├── Dashboard.jsx        # Live metrics + bar chart
│           ├── Projects.jsx
│           ├── Tasks.jsx            # Search + inline status update
│           └── Users.jsx            # Admin directory
│
├── Dockerfile                       # Backend Docker build
├── frontend/Dockerfile              # Frontend Nginx build
└── docker-compose.yml               # Full stack orchestration
```

---

## ⚙️ Environment Variables

### Backend (`application.properties` / Render env vars)

| Variable | Local Value | Production Value |
|---|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/taskdb` | `jdbc:postgresql://dpg-xxx:xxxx/mydb_xxxx` |
| `SPRING_DATASOURCE_USERNAME` | `postgres` | `mydb_xxxx_user` |
| `SPRING_DATASOURCE_PASSWORD` | `password` | *(from Render DB page)* |
| `JWT_SECRET` | *(base64 key)* | *(same key set on Render)* |
| `JWT_EXPIRATION` | `xxxxxxxx` | `xxxxxxx` |
| `TZ` | — | `UTC` |

### Frontend

| File | Variable | Value |
|---|---|---|
| `.env.local` | `VITE_API_URL` | `http://localhost:8081/api` |
| `.env` | `VITE_API_URL` | `https://new-c4u6.onrender.com/api` |

---

## 🚢 Deployment Guide

### Backend → Render (via Docker Hub)

```bash
# Build and push Docker image
docker build -t nileshr08/new-backend:latest .
docker push nileshr08/new-backend:latest
```

On Render → **New Web Service** → **Deploy existing image from registry**:
- Image URL: `nileshr08/new-backend:latest`
- Add the 6 environment variables from the table above

### Frontend → Vercel

```bash
git push origin main
```

On Vercel → Import GitHub repo:
- Root Directory: `frontend`
- Framework: `Vite`
- Environment Variable: `VITE_API_URL` = `https://new-c4u6.onrender.com/api`

### Update Docker image after code changes

```bash
docker build -t nileshr08/new-backend:latest .
docker push nileshr08/new-backend:latest
# Then on Render: Manual Deploy → Deploy latest image
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

*Built with ❤️ using Spring Boot + React + PostgreSQL | Deployed on Render + Vercel*
