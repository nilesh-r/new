# 🏢 Enterprise Task & Workflow Management System

A **production-ready**, secure, full-stack enterprise application for managing organizational projects, tasks, and team productivity. Built with Spring Boot + React, backed by PostgreSQL, and fully Dockerized.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [User Roles](#-user-roles)
- [Getting Started](#-getting-started)
- [Local Development](#-local-development)
- [Default Credentials](#-default-credentials)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based stateless authentication** — tokens are stored in `localStorage` and auto-attached to every API request.
- **Auto-logout on token expiry** — expired or invalid tokens automatically redirect to `/login`.
- **BCrypt password hashing** — no plaintext passwords ever stored.
- **Role-Based Access Control (RBAC)** — every page and API endpoint is protected based on user role.
- **CORS configured** — allows the React frontend to securely communicate with the Spring Boot backend.

### 📁 Project Management
- **Create Projects** — Managers and Admins can create new organizational projects.
- **View All Projects** — Browse a live card grid of all projects fetched from PostgreSQL.
- **Project Members** — See how many team members are assigned to each project.
- **Project Timestamps** — Automatic creation date tracking on every project.

### ✅ Task Management
- **Create Tasks** — Assign tasks to a specific project with priority and a deadline.
- **Live Task List** — All tasks fetched in real-time from the backend database.
- **Instant Status Updates** — Change task status (`TODO` → `IN PROGRESS` → `DONE`) via an inline dropdown without page refresh. Calls `PATCH /api/tasks/{id}/status` directly.
- **Priority Levels** — `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` with color-coded badges.
- **Task Search** — Live search bar filters the task list by title, description, or project name instantly.

### 📊 Dashboard & Analytics
- **Real-time Statistics** — Total Projects, Pending Tasks, Completed Tasks, and Team Members are all fetched from the database, not hardcoded.
- **Tasks by Priority Chart** — Interactive bar chart (Recharts) that updates based on the actual tasks stored in PostgreSQL.
- **Loading States** — Animated spinner while data loads; graceful empty states when no data exists.

### 👥 User Directory (Admin Only)
- **View All Users** — Administrators can browse the full employee directory.
- **Role Badges** — Each user displays their role badge (`Admin`, `Manager`, `Employee`).
- **Access Control** — The "Directory" sidebar link only appears for Admin users. Other roles get a 403 gracefully handled.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Spring Boot 3.2, Spring Security 6, Spring Data JPA (Hibernate) |
| **Authentication** | JWT (io.jsonwebtoken), BCrypt |
| **Database** | PostgreSQL 15 |
| **Frontend** | React 18, Vite, React Router v6 |
| **Styling** | Tailwind CSS v4 |
| **Charts** | Recharts |
| **HTTP Client** | Axios (with request & response interceptors) |
| **Icons** | Lucide React |
| **API Docs** | Springdoc OpenAPI (Swagger UI) |
| **Containerization** | Docker, Docker Compose |
| **Build Tool** | Maven |

---

## 👤 User Roles

| Role | Permissions |
|---|---|
| `ROLE_ADMIN` | Full access: view all users, create projects, create tasks, view dashboard |
| `ROLE_MANAGER` | Create & manage projects and tasks; view dashboard |
| `ROLE_EMPLOYEE` | View projects and tasks; update task status |

> New users registered via the `/api/auth/register` endpoint are assigned `ROLE_EMPLOYEE` by default.

---

## 🚀 Getting Started (Docker — Recommended)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/enterprise-task-management.git
cd enterprise-task-management

# 2. Build and start all services
docker-compose up --build
```

This starts 3 containers:

| Service | URL |
|---|---|
| **Frontend (React)** | http://localhost:5173 |
| **Backend (Spring Boot)** | http://localhost:8081 |
| **Swagger API Docs** | http://localhost:8081/swagger-ui/index.html |
| **PostgreSQL** | localhost:5432 (internal) |

---

## 💻 Local Development (Without Docker)

### Step 1: Start the Database
```bash
# Start only the PostgreSQL container
docker-compose up -d postgres
```

### Step 2: Start the Backend
```bash
# From the project root
mvn spring-boot:run
```
The backend will start on **http://localhost:8081**.
> On first run, Hibernate auto-creates all tables and the `DataSeeder` populates roles + the default admin account.

### Step 3: Start the Frontend
```bash
# From the /frontend directory
cd frontend
npm install
npm run dev
```
The frontend will start on **http://localhost:5173**.

---

## 🔐 Default Credentials

A default admin account is automatically created on first startup:

| Field | Value |
|---|---|
| **Username** | `admin` |
| **Password** | `admin` |
| **Role** | `ROLE_ADMIN` |

> ⚠️ **Change this password immediately in any non-development environment.**

---

## 📡 API Reference

All endpoints are prefixed with `/api`. Authentication required (Bearer JWT) unless marked as Public.

### Auth Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `POST` | `/api/auth/register` | Public | Register a new user (assigned EMPLOYEE role) |
| `GET` | `/api/auth/me` | Authenticated | Get current user profile & roles |

### Project Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Authenticated | List all projects |
| `GET` | `/api/projects/{id}` | Authenticated | Get a single project |
| `POST` | `/api/projects` | MANAGER / ADMIN | Create a new project |
| `POST` | `/api/projects/{projectId}/members/{userId}` | MANAGER / ADMIN | Add a member to a project |

### Task Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/tasks` | Authenticated | List all tasks (paginated) |
| `GET` | `/api/tasks/project/{projectId}` | Authenticated | Get tasks by project (paginated) |
| `POST` | `/api/tasks` | MANAGER / ADMIN | Create a new task |
| `PATCH` | `/api/tasks/{taskId}/status?status=DONE` | Authenticated | Update a task's status |

### User Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | ADMIN only | List all registered users |

> 📖 **Full interactive API documentation**: [Swagger UI](http://localhost:8081/swagger-ui/index.html)

---

## 📂 Project Structure

```
enterprise-task-management/
│
├── src/main/java/com/enterprise/taskmanagement/
│   ├── config/
│   │   ├── DataSeeder.java          # Seeds roles + default admin on startup
│   │   ├── SecurityConfig.java      # JWT, CORS, RBAC rules
│   │   └── SwaggerConfig.java       # Springdoc OpenAPI configuration
│   │
│   ├── controller/
│   │   ├── AuthController.java      # Login, Register, /me
│   │   ├── ProjectController.java   # Project CRUD
│   │   ├── TaskController.java      # Task CRUD + status patch
│   │   └── UserController.java      # User directory (admin only)
│   │
│   ├── dto/
│   │   ├── ApiResponse.java         # Standard API wrapper {success, message, data}
│   │   ├── AuthResponse.java        # JWT token response
│   │   ├── UserDto.java             # Safe user data (no password)
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── ProjectRequest.java
│   │   └── TaskRequest.java
│   │
│   ├── entity/
│   │   ├── User.java                # @ManyToMany roles, BCrypt password
│   │   ├── Role.java                # ROLE_ADMIN / ROLE_MANAGER / ROLE_EMPLOYEE
│   │   ├── Project.java             # Project with members Set<User>
│   │   ├── Task.java                # Task with priority, status, deadline
│   │   ├── TaskStatus.java          # Enum: TODO, IN_PROGRESS, DONE
│   │   └── TaskPriority.java        # Enum: LOW, MEDIUM, HIGH, CRITICAL
│   │
│   ├── security/
│   │   ├── JwtTokenProvider.java    # Token generation & validation
│   │   ├── JwtAuthenticationFilter.java # Per-request JWT verification
│   │   └── CustomUserDetailsService.java
│   │
│   └── service/
│       ├── AuthService.java
│       ├── ProjectService.java
│       └── TaskService.java
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Layout.jsx           # Main shell with sidebar + outlet
│       │   └── Sidebar.jsx          # Role-aware navigation menu
│       │
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state + hasRole() helper
│       │
│       ├── pages/
│       │   ├── Login.jsx            # JWT login form
│       │   ├── Dashboard.jsx        # Live metrics + bar chart
│       │   ├── Projects.jsx         # Project list + create modal
│       │   ├── Tasks.jsx            # Task list + search + inline status update
│       │   └── Users.jsx            # Admin user directory
│       │
│       └── services/
│           └── api.js               # Axios instance + request & 401 interceptors
│
├── Dockerfile                       # Backend multi-stage build
├── frontend/Dockerfile              # Frontend Nginx build
├── docker-compose.yml               # Full stack orchestration
└── pom.xml                          # Maven dependencies
```

---

## ⚙️ Environment Variables

### Backend (`src/main/resources/application.properties`)

| Property | Default | Description |
|---|---|---|
| `server.port` | `8081` | Port the backend listens on |
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/taskdb` | PostgreSQL connection string |
| `spring.datasource.username` | `postgres` | DB username |
| `spring.datasource.password` | `password` | DB password |
| `jwt.secret` | *(base64 key)* | Secret for signing JWT tokens |
| `jwt.expiration` | `86400000` | Token expiry in ms (24 hours) |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8081/api` | Backend API base URL |

---

## 📄 License

This project is licensed under the **MIT License**.

---

*Built with ❤️ using Spring Boot + React + PostgreSQL*
