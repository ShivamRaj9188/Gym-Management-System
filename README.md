# Gym Management System

A comprehensive, full-stack enterprise platform designed for gym administration and member lifecycle management.
The application operates on a decoupled architecture utilizing a Spring Boot REST API for backend services and a React Single Page Application (SPA) for the frontend interface.

**Live Application:** [https://gym-management-system-blond.vercel.app](https://gym-management-system-blond.vercel.app)
**Backend API:** `https://gym-backend-production-2509.up.railway.app`

## 1. System Architecture

The application is engineered using the following technology stack:

- **Frontend:** React 19, Vite, React Router, Axios, Bootstrap 5. Deployed statically on Vercel.
- **Backend:** Java 17, Spring Boot 3.5.x, Spring Security, Spring Data JPA. Containerized and deployed on Railway.
- **Database:** PostgreSQL. Hosted on Supabase utilizing optimal connection pooling.
- **Security:** Stateless JSON Web Token (JWT) architecture leveraging `jjwt`.

## 2. Core Functional Modules

- **Authentication & Security:** JWT-driven access control featuring secure Refresh Token rotation, programmatic Rate Limiting, and XSS payload sanitization.
- **Administrative Control:** Dedicated workflows mapping to the `ROLE_ADMIN` authority, handling user verification, suspension, and account termination.
- **Operational Dashboard:** Real-time aggregation of active memberships, daily check-ins, trainer assignments, and revenue metrics.
- **Member & Subscription Management:** Full CRUD operations managing the association between registered members and their active subscription tiers.
- **Trainer Allocation:** Bidirectional mapping associating specialized trainers with respective gym members.
- **Attendance Tracking:** Time-stamped event logging for member facility access (check-in / check-out).
- **Financial Tracking:** Centralized ledger for tracking membership dues, outstanding balances, and payment status updates.

## 3. Security Specifications

- **Endpoint Protection:** Public access is strictly localized to `/api/auth/**`. All operational endpoints demand a valid `Authorization: Bearer <token>` header.
- **Role-Based Access Control (RBAC):** Privileged endpoints (`/api/admin/**`) enforce strict `ROLE_ADMIN` validation.
- **Cross-Origin Resource Sharing (CORS):** The backend API explicitly whitelists the Vercel production origin and standard local development ports (`5173`, `5174`) to prevent unauthorized cross-origin execution.

## 4. Deployment Prerequisites

To build and run the application locally, the following environments are required:
- Java SE 17 or higher
- Node.js 18 or higher (with NPM)
- PostgreSQL 14 or higher

## 5. Production Environment Configuration

The application is designed to be configured externally via environment variables to uphold 12-factor application principles.

### Backend Requirements (Railway)
Ensure the following variables are injected into the production container:
- `SPRING_DATASOURCE_URL`: The fully qualified PostgreSQL JDBC connection string.
- `DB_USERNAME`: Database privileged user.
- `DB_PASSWORD`: Corresponding privileged password.
- `JWT_SECRET`: A cryptographic secret key (minimum 256-bit) utilized for HMAC signing.
- `CORS_ORIGINS`: Defines the allowed frontend hosts (e.g., `https://gym-management-system-blond.vercel.app`).

*Note: The backend utilizes Spring Boot's `ddl-auto: update` configuration in the primary production profile to dynamically ensure database schema correctness upon deployment.*

### Frontend Requirements (Vercel)
Ensure the following variable is defined during the static build phase:
- `VITE_API_URL`: The fully qualified URI to the backend REST API, terminating with the base path (`https://gym-backend-production-2509.up.railway.app/api`).

## 6. Local Build Instructions

**Frontend Execution:**
```bash
cd gym-frontend
npm install
npm run build
# The optimized production build is generated in gym-frontend/dist/
```

**Backend Execution:**
```bash
cd gym-backend
./mvnw clean package
# The executable JAR is initialized in gym-backend/target/
java -jar gym-backend/target/GymManagementSystem-0.0.1-SNAPSHOT.jar
```
