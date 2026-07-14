# DeskSpace Backend API 🚀

DeskSpace is a premium platform for booking co-working desks, private offices, meeting rooms, and creative studios. This repository contains the **Express.js & TypeScript** backend that powers the DeskSpace platform, providing secure authentication, role-based access control, and a robust RESTful API for workspace and booking management.

## 🌟 Key Features

* **Secure Authentication & Authorization:** 
  * JWT-based authentication via secure, HTTP-only cookies.
  * Role-based access control separating standard `user` permissions from `admin` capabilities.
  * Cross-origin cookie support specifically configured for Vercel deployments.
* **Workspace Management:** 
  * Full CRUD (Create, Read, Update, Delete) endpoints for workspaces.
  * Advanced filtering, searching, and pagination capabilities for listing workspaces.
* **Booking System:**
  * Users can reserve workspaces by specifying dates and times.
  * Real-time calculation of pricing based on duration.
  * Easy cancellation and reservation tracking.
* **Production Ready:**
  * Fully configured for serverless deployment on Vercel.
  * Automatic `dotenv` environment variable loading.
  * Connected to MongoDB using Mongoose.

## 🛠️ Technology Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Deployment:** Vercel

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have Node.js and npm installed on your machine.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/syfulsharif/deskspace_backend.git
cd deskspace_backend
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following variables:
```env
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_secure_random_string"
```

### 4. Database Seeding
To populate your local or remote database with initial dummy data (users, workspaces, and bookings), run:
```bash
npx tsx seed.ts
```

### 5. Start the Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

## 🌐 API Endpoints

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Authenticate and receive a session cookie
* `POST /api/auth/logout` - Clear the session cookie
* `GET /api/auth/me` - Retrieve the currently authenticated user

### Workspaces
* `GET /api/workspaces` - List all workspaces (supports search, filters, pagination)
* `GET /api/workspaces/:id` - Get details of a specific workspace
* `POST /api/workspaces/create` - (Admin only) Add a new workspace
* `DELETE /api/workspaces/delete/:id` - (Admin only) Remove a workspace

### Bookings
* `GET /api/bookings` - (Protected) Get all bookings for the logged-in user
* `POST /api/bookings/create` - (Protected) Book a workspace
* `POST /api/bookings/cancel/:id` - (Protected) Cancel an existing booking

## 🤝 Live Demo
* **Frontend Client:** [https://deskspace-client.vercel.app/](https://deskspace-client.vercel.app/)

---
*Built with ❤️ for the SCIC Batch 13 DeskSpace Project.*
