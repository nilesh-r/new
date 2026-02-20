# Enterprise Task & Workflow Management System

A secure, role-based, full-stack application designed to manage organizational projects, task assignments, and productivity analytics.

## 🚀 Features

- **Authentication & Security**
  - Secure JWT-based stateless authentication.
  - Role-Based Access Control (RBAC) (`ADMIN`, `MANAGER`, `EMPLOYEE`).
  - Password encryption using BCrypt.

- **Project & Task Management**
  - Create and manage projects with deadlines.
  - Assign tasks with priorities (LOW, MEDIUM, HIGH) and statuses (TO DO, IN PROGRESS, DONE).
  - Productivity analytics dashboard.

- **Tech Stack**
  - **Backend**: Spring Boot 3, Spring Security, JWT, Spring Data JPA.
  - **Database**: PostgreSQL.
  - **Frontend**: React (Vite), Tailwind CSS, Recharts, Axios.
  - **DevOps**: Docker, Docker Compose.

## 🛠️ Prerequisites

- Docker & Docker Compose

## 🚀 Getting Started

The easiest way to run the application is using Docker Compose.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/task-management.git
    cd task-management
    ```

2.  **Run with Docker Compose**
    ```bash
    docker-compose up -d --build
    ```
    This will start:
    - **PostgreSQL Database** on port `5432`
    - **Backend API** on port `8081`
    - **Frontend Application** on port `5173`

3.  **Access the Application**
    - **Frontend**: [http://localhost:5173](http://localhost:5173)
    - **API Documentation (Swagger)**: [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)

## 🔐 Default Credentials

The application seeds a default Admin user on startup:

- **Username**: `admin`
- **Password**: `admin`

_Note: Please change these credentials immediately in a production environment._

## 📂 Project Structure

```
├── src/main/java/com/enterprise/taskmanagement  # Backend Source
│   ├── config/          # Security & App Config
│   ├── controller/      # REST Controllers
│   ├── entity/          # JPA Entities
│   ├── repository/      # Data Access Layer
│   ├── security/        # JWT & Auth Logic
│   └── service/         # Business Logic
├── frontend/            # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── context/     # State Management (Auth)
│   │   ├── pages/       # Application Pages
│   │   └── services/    # API Integration
├── Dockerfile           # Backend Dockerfile
├── docker-compose.yml   # Container Orchestration
└── pom.xml              # Maven Dependencies
```

## 🧪 Development

To run locally without Docker:

**Backend**:
1. Ensure PostgreSQL is running and update `application.properties`.
2. Run: `mvn spring-boot:run`

**Frontend**:
1. Navigate to `frontend/`.
2. Run: `npm install && npm run dev`.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
