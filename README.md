# Asto Gear 🖥️

> A full-stack e-commerce platform for computer accessories with real-time notifications, multi-language support, and integrated Bakong KHQR payment.

![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![React](https://img.shields.io/badge/React-Vite-blue?logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?logo=mysql)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Contact](#contact)

---

## Overview

Asto Gear lets users browse, configure, and purchase computer accessories online. The platform supports three roles — **Customer**, **Seller**, and **Admin** — each with tailored functionality. All orders include free delivery.

---

## Features

**Customers**
- Register / login via email or Google OAuth
- Browse, search, and filter products by brand or category
- Add to cart and checkout
- Pay via Bakong KHQR
- Real-time order status updates via WebSocket
- Choose delivery provider: JNT Express, Vireak Buntham, or Grab
- Switch UI language: Khmer, Chinese, English

**Sellers & Admins**
- Full CRUD for products, brands, and categories
- Monitor user login/signup activity
- Track and manage all orders

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, Tailwind CSS, Socket.io Client |
| Backend | Node.js, Express.js, WebSocket |
| Database | MySQL 8, Sequelize ORM |
| Auth | JWT, Firebase (Google OAuth) |
| Payment | Bakong KHQR API |
| Storage | Cloudinary |
| Email | Nodemailer |
| DevOps | Docker, Docker Compose, Nginx |

---

## Project Structure

```
asto-gear/
├── backend/
│   ├── config/           # DB & service configs
│   ├── controllers/      # Business logic
│   ├── mail/             # Email templates
│   ├── middleware/       # Auth & authorization
│   ├── models/           # Sequelize models
│   ├── routes/           # API route definitions
│   ├── utils/            # Helper functions
│   ├── server.js         # Entry point
│   └── wait-for-db.sh    # DB connection wait script
│
├── frontend/
│   ├── src/              # React components & pages
│   ├── context/          # Global state (React Context)
│   ├── public/           # Static assets
│   ├── utils/            # Frontend helpers
│   ├── socket.js         # WebSocket config
│   ├── nginx.dev.conf
│   ├── nginx.prod.conf
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v16+
- MySQL 8
- Docker & Docker Compose (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/asto-gear.git
cd asto-gear
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in your values
nodemon server.js
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

> ⚠️ Start the database first, then the backend, then the frontend.

### 4. Docker (Recommended)

Runs everything in one command:

```bash
docker-compose up --build
```

This starts three containers: MySQL, Node.js backend, and Nginx frontend.

```bash
docker-compose down   # to stop
```

---

## Environment Variables

### `backend/.env`

```env
# Database
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret

# Firebase
FIREBASE_API_KEY=your_firebase_key

# Bakong
BAKONG_API_KEY=your_bakong_key

# Email
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

### `frontend/.env.development`

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### `frontend/.env.production`

```env
VITE_API_URL=https://your-production-api.com
VITE_SOCKET_URL=https://your-production-api.com
```

---

## Available Scripts

### Backend

```bash
npm start          # Start with Node
nodemon server.js  # Start with auto-reload
```

### Frontend

```bash
npm run dev        # Development server
npm run build      # Production build
npm run preview    # Preview production build
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/products` | List all products |
| POST | `/api/products` | Create a product *(seller)* |
| PUT | `/api/products/:id` | Update a product *(seller)* |
| DELETE | `/api/products/:id` | Delete a product *(seller)* |
| GET | `/api/categories` | List categories |
| GET | `/api/brands` | List brands |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/payments` | Process a payment |
| GET | `/api/users/me` | Get current user profile |

---

## Security

- JWT with HTTP-only cookies
- Google OAuth via Firebase
- Authorization middleware on protected routes
- Secure password hashing
- Environment-based configuration (no secrets in code)

---

## Acknowledgments

- [Bakong API](https://bakong.nbc.gov.kh) — KHQR payment
- [Cloudinary](https://cloudinary.com) — Image storage
- [Firebase](https://firebase.google.com) — Google OAuth

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

- Telegram: [@Reajasey](https://t.me/Reajasey)
- Facebook: [Pisey Khenchandara](https://www.facebook.com/pisey.khenchandara)
