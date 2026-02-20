# Enterprise Task Management API

A robust, secure, and production-ready RESTful backend API for Enterprise Task Management built with Spring Boot 3. This system provides comprehensive capabilities for managing users, projects, and tasks with advanced features like Role-Based Access Control (RBAC), Audit Logging, and JWT Authentication.

## 🚀 Features

- **Authentication & Security**
  - Secure JWT-based stateless authentication.
  - Role-Based Access Control (RBAC) with hierarchical roles: `ADMIN`, `MANAGER`, `EMPLOYEE`.
  - Password hashing using BCrypt.

- **User Management**
  - User registration and role assignment.
  - Admin-only user listing and management.

- **Project Management**
  - Create, update, and manage projects.
  - Assign members to projects.
  - Restrict actions based on roles (Managers/Admins only).

- **Task Management**
  - Comprehensive task lifecycle (TODO -> IN_PROGRESS -> DONE).
  - Priority levels (LOW, MEDIUM, HIGH, CRITICAL) and deadlines.
  - **Pagination & Sorting**: Efficiently retrieve large datasets using advanced filtering.
  - Audit logging for tracking changes.

- **Infrastructure**
  - **Global Exception Handling**: Standardized API error responses.
  - **API Documentation**: Integrated Swagger/OpenAPI UI.
  - **Audit Logging**: Automatic tracking of creation and modification timestamps.

## 🛠️ Tech Stack

- **Framework**: Spring Boot 3.2.3
- **Security**: Spring Security 6, JJWT (Java JWT)
- **Database**: H2 (Dev) / MySQL (Prod ready)
- **Persistence**: Spring Data JPA, Hibernate
- **Validation**: Hibernate Validator
- **Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Tooling**: Maven, Lombok

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-repo/task-management.git
    cd task-management
    ```

2.  **Build the project**
    ```bash
    mvn clean install
    ```

3.  **Run the application**
    ```bash
    mvn spring-boot:run
    ```

4.  **Access the Application**
    - The server will start on port `8081` (default).
    - **API Base URL**: `http://localhost:8081/api`
    - **Interactive API Docs (Swagger UI)**: [http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)

## 🔐 Default Credentials

The application seeds a default Admin user on startup:

- **Username**: `admin`
- **Password**: `admin`

_Note: Please change these credentials immediately in a production environment._

## 📖 API Documentation

The API is fully documented using Swagger. Once the application is running, navigate to:

> **[http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)**

### Key Endpoints

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate & get Token | Public |
| `POST` | `/api/projects` | Create a new Project | Manager, Admin |
| `GET` | `/api/tasks` | Get all tasks (Paginated) | Authenticated |
| `POST` | `/api/tasks` | Create a new Task | Manager, Admin |

## 🧪 Testing

To run the unit tests:

```bash
mvn test
```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
