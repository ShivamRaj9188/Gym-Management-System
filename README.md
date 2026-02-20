Gym Management System

A full-stack Gym Management System built using Spring Boot (Backend) and React + Vite (Frontend).

This system helps manage members, trainers, attendance, and payment tracking in one place.


Tech Stack

Backend
	•	Java 17+
	•	Spring Boot
	•	Spring Data JPA
	•	Hibernate
	•	H2 / MySQL (configurable)
	•	Maven

Frontend
	•	React
	•	Vite
	•	JavaScript (ES6+)
	•	CSS

Project Structure

Gym-Management-System
│
├── gym-backend        → Spring Boot REST API
│
├── gym-frontend       → React SPA
│
└── README.md

Features

Dashboard
	•	Total Members
	•	Active Members
	•	Total Trainers
	•	Today Attendance
	•	Total Revenue

Member Plans
	•	View subscription plans
	•	Track member status

Trainer Assignment
	•	Assign trainers
	•	Manage specialization

Attendance
	•	Daily attendance tracking
	•	Floor monitoring

Payment Tracking
	•	Track paid and pending payments
	•	Revenue summary

Backend Setup
	1.	Navigate to backend folder:
      cd gym-backend
  2.	Run using IntelliJ
or via terminal:
      ./mvnw spring-boot:run
  Backend runs on:
    http://localhost:9999
Frontend Setup
	1.	Navigate to frontend folder:    
      cd gym-frontend
	2.	Install dependencies:
      npm install
  3.	Start development server:
      npm run dev
  Frontend runs on:
      http://localhost:5173
  API Integration

Frontend connects to backend REST endpoints.

Make sure backend is running before starting frontend.

If CORS issues occur, verify:
	•	Correct backend port
	•	Proper CORS configuration in Spring Boot

Build for Production

Frontend
 npm run build
Output will be in:
 gym-frontend/dist
Backend
 ./mvnw clean package
Jar file will be generated in:
 gym-backend/target
Run using:
 java -jar your-file.jar
Future Improvements
	•	Authentication & Authorization (JWT)
	•	Role based access (Admin / Trainer)
	•	Database migration (Flyway)
	•	Docker support
	•	Deployment to cloud
	•	CI/CD pipeline
Author
Shivam Raj
GitHub:
https://github.com/ShivamRaj9188/Gym-Management-System

