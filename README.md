# Frontend Library Management System (React + Vite)

[![Deploy on Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)](https://front-end-library.onrender.com)
[![Backend Repository](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Dragon-Ky/Bookstore-API.git)

> **Note to Recruiters / Technical Interviewers:**
> My primary focus and objective is to secure a position as a **Java Backend Developer**. 
> While I have functional knowledge of React and frontend development, this frontend application was built **primarily to demonstrate the capabilities and interactions with the Java Spring Boot Backend API** that I developed. 
> The UI/UX here is meant to be functional rather than heavily polished, emphasizing API integration, data binding, routing, state management, and full-stack system comprehension.

---

## 🔗 Live Links

- **Frontend Live Demo:** [https://front-end-library.onrender.com](https://front-end-library.onrender.com)
- **Backend (Spring Boot) Repository:** [https://github.com/Dragon-Ky/Bookstore-API.git](https://github.com/Dragon-Ky/Bookstore-API.git)

> [!WARNING]
> **Server Wake-up Time:** Because the backend is deployed on Render's free tier, the server may go to sleep after periods of inactivity. Upon initial access, **please allow 2 to 3 minutes for the server to fully start up** and respond to requests.

---

## 🎯 About The Project

This project is the client-side module for a Library Management System. It communicates with a secure and robust Java Spring Boot REST API. It handles authentication (JWT), user authorization, book browsing, borrowing processes, and admin dashboard functionalities. It also includes an AI Chat Interface.

### Core Features Demonstrated

*   **Authentication & Security:** 
    *   Login & Registration.
    *   Reset Password flow (using OTP).
    *   JWT-based protected routes.
*   **User Roles (RBAC):** 
    *   Different views and privileges for Admin vs. Standard Users.
*   **Book Management (User):** 
    *   Browse books with categories.
    *   View Book Details.
    *   Borrow books and track personal borrow history.
*   **Admin Dashboard:**
    *   Manage Books (Add, Edit, Delete).
    *   Manage Categories.
    *   Manage Borrow Requests (Approve/Reject).
*   **AI Integration:**
    *   Custom ChatBox communicating with the backend `/api/chat/search` endpoint.

---

## 💻 Tech Stack

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Styling:** Vanilla CSS, Lucide React (Icons)

---

## 🚀 Running Locally

If you'd like to run this frontend application locally, simply follow these steps:

### Prerequisites

*   Node.js (v18+ recommended)
*   npm or yarn

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone <frontend-repo-url>
   cd <frontend-repo-name>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   * Create a `.env` file in the root directory.
   * Add the backend API URL (e.g., `VITE_API_URL=http://localhost:8080/api`)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

*I appreciate your time in reviewing this project! Feel free to check out the [Backend Repository](https://github.com/Dragon-Ky/Bookstore-API.git) for the core domain logic, Spring Security implementation, database design, and RESTful architectural patterns.*
