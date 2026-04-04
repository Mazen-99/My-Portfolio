# 🚀 Professional Portfolio Backend System

This is the robust backend engine for the Premium Portfolio Website. Built with **Node.js**, **Express**, and **MongoDB**, it provides a modular and secure RESTful API ecosystem for managing professional profiles, services, projects, and communications.

---

## 🛠️ Advanced Features

- **🔐 Admin Security:** Protected endpoints using an administrative password layer for all management actions.
- **🚀 Dynamic Services:** Full CRUD system for professional offerings with custom icon support.
- **📁 Project Management:** Image upload handling for projects with automated cleanup on deletion.
- **🧬 Theme Control:** Live management of the website's visual tokens and colors.
- **📧 Contact Ecosystem:** 
  - Integrated contact form with **Nodemailer**.
  - **OTP Verification:** Email verification logic to prevent spam and verify sender identity.
  - **Rate Limiting:** Global and targeted rate limiters to prevent DDoS and form abuse.
- **📄 CV Management:** Binary file handling for CV uploads and downloads.

---

## 📡 API Endpoints

### 🔑 Authentication
- `POST /api/admin/check` → Verify admin status (Rate Limited)

### 👤 About & Identity
- `GET /api/about` → Fetch public profile data.
- `PUT /api/about` → Update profile, skills, and socials (Admin Only).

### 🚀 Professional Services
- `GET /api/services` → List all services.
- `POST /api/services` → Deploy new service (Admin Only).
- `PUT /api/services/:id` → Update service details (Admin Only).
- `DELETE /api/services/:id` → Decommission service (Admin Only).

### 📁 Project Catalog
- `GET /api/projects` → Fetch project library.
- `POST /api/projects` → Launch new project (Image Upload | Admin Only).
- `PUT /api/projects/:id` → Refine project details (Admin Only).
- `DELETE /api/projects/:id` → Remove project (Admin Only).

### 📧 Communication (Contact)
- `POST /api/contact/send-otp` → Generate and send 6-digit verification code.
- `POST /api/contact` → Verify OTP and transmit contact message (Rate Limited).

### 📄 Document handling
- `GET /api/cv` → Download portfolio CV.
- `POST /api/cv` → Upload/Update CV document (Admin Only).

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_PASSWORD=your_secure_dashboard_password
EMAIL_USER=your_email_for_sending_messages
EMAIL_PASS=your_app_specific_password
```

---

## 🚀 Deployment Guide

1. **Database:** Create a cluster on [MongoDB Atlas](https://www.mongodb.com/atlas/database).
2. **Server:** Deploy to [Render](https://render.com/) or [Railway](https://railway.app/).
3. **Environment:** Ensure all `.env` variables are added to the hosting platform's environment settings.
4. **CORS:** The system is pre-configured to handle cross-origin requests from your frontend.

---

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

---

**Developed with ❤️ by Mazen Ahmed**
*Full Stack Developer | MERN Stack Specialist*
