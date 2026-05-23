# 💎 Urban Gems

Urban Gems is a full-stack web application designed to help users discover, review, and share their city's hidden spots—from quiet study cafes and street food stalls to breathtaking viewpoints.

Originally built as a monolithic application, this project has been fully migrated to a modern **decoupled architecture**, featuring a blazing-fast Next.js frontend and a secure, RESTful Node/Express API.

### 🚀 Live Demo

- **Frontend (Vercel):** [https://urban-gems.vercel.app/]
- **Backend API (Render):** [https://urban-gems-1.onrender.com]

---

## 🛠 Tech Stack

**Frontend**

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Mapping:** MapTiler API

**Backend**

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas & Mongoose
- **Authentication:** JSON Web Tokens (JWT) & Passport.js
- **Image Hosting:** Cloudinary

---

## ✨ Key Features

- **Decoupled Architecture:** Complete separation of concerns between the React client and the Express data pipeline.
- **JWT Authentication:** Secure, stateless user sessions replacing legacy cookie-based sessions.
- **Interactive Clustering Maps:** Visual representation of all locations using MapTiler, with custom map points for individual places.
- **Full CRUD Functionality:** Users can Create, Read, Update, and Delete their own locations and reviews.
- **Authorization:** Strict backend middleware and frontend route protection ensuring users can only modify content they created.
- **Cloud Image Uploads:** Seamless image uploading and storage via Cloudinary.

---

## 💻 Local Development Setup

Because this application uses a decoupled architecture, you will need to run two separate servers locally: one for the Express API and one for the Next.js frontend.

### Prerequisites

- Node.js installed
- A local MongoDB connection or MongoDB Atlas URI
- API Keys for Cloudinary and MapTiler

### 1. Backend Setup (Express API)

Open your terminal and navigate to the root directory of the project.

```bash
# Install dependencies
npm install

# Create an environment file
touch .env
```
