# Gateway Computers — Backend API

Node.js + Express + MongoDB REST API for the Gateway Computers website.

---

## 🚀 Setup

```bash
cd gateway-backend
npm install

# Copy env and fill in your values
cp .env.example .env

# Seed default admin + services
node utils/seeder.js

# Start dev server
npm run dev
```

Server runs on: `http://localhost:5000`

---

## 📁 Folder Structure

```
gateway-backend/
├── server.js                   ← Entry point
├── .env.example                ← Environment variables template
├── config/
│   └── db.js                   ← MongoDB connection
├── models/
│   ├── Admin.model.js          ← Admin schema
│   ├── Product.model.js        ← Product schema
│   ├── Service.model.js        ← Service schema
│   ├── Booking.model.js        ← Booking schema
│   └── Contact.model.js        ← Contact/Enquiry schema
├── controllers/
│   ├── auth.controller.js      ← Login, getMe
│   ├── product.controller.js   ← CRUD products
│   ├── booking.controller.js   ← CRUD bookings
│   ├── service.controller.js   ← CRUD services
│   └── contact.controller.js   ← CRUD contacts
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── booking.routes.js
│   ├── service.routes.js
│   └── contact.routes.js
├── middleware/
│   ├── auth.middleware.js      ← JWT protection
│   ├── upload.middleware.js    ← Multer image upload
│   └── error.middleware.js     ← Global error handler
└── utils/
    ├── seeder.js               ← DB seed script
    └── response.util.js        ← Response helpers
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint         | Access  | Description        |
|--------|------------------|---------|--------------------|
| POST   | /api/auth/login  | Public  | Admin login        |
| GET    | /api/auth/me     | Private | Get admin profile  |

### Products
| Method | Endpoint                    | Access  | Description              |
|--------|-----------------------------|---------|--------------------------|
| GET    | /api/products               | Public  | Get all products         |
| GET    | /api/products/:id           | Public  | Get single product       |
| GET    | /api/products/category/:cat | Public  | Get by category          |
| POST   | /api/products               | Private | Create product (+ images)|
| PUT    | /api/products/:id           | Private | Update product           |
| DELETE | /api/products/:id           | Private | Delete product           |

### Services
| Method | Endpoint           | Access  | Description      |
|--------|--------------------|---------|------------------|
| GET    | /api/services      | Public  | Get all services |
| GET    | /api/services/:id  | Public  | Get single       |
| POST   | /api/services      | Private | Create service   |
| PUT    | /api/services/:id  | Private | Update service   |
| DELETE | /api/services/:id  | Private | Delete service   |

### Bookings
| Method | Endpoint                    | Access  | Description          |
|--------|-----------------------------|---------|----------------------|
| POST   | /api/bookings               | Public  | Submit booking       |
| GET    | /api/bookings               | Private | Get all bookings     |
| GET    | /api/bookings/:id           | Private | Get single booking   |
| PUT    | /api/bookings/:id/status    | Private | Update status        |
| DELETE | /api/bookings/:id           | Private | Delete booking       |

### Contacts
| Method | Endpoint           | Access  | Description        |
|--------|--------------------|---------|---------------------|
| POST   | /api/contacts      | Public  | Submit enquiry      |
| GET    | /api/contacts      | Private | Get all contacts    |
| PUT    | /api/contacts/:id  | Private | Mark read/replied   |
| DELETE | /api/contacts/:id  | Private | Delete contact      |

---

## 🗄️ MongoDB Models

| Model    | Key Fields                                                    |
|----------|---------------------------------------------------------------|
| Admin    | name, email, password (hashed), role, isActive               |
| Product  | name, description, price, category, images[], specs[], stock |
| Service  | title, description, startingPrice, features[], icon, order   |
| Booking  | name, phone, service (ref), preferredDate, status, bookingRef|
| Contact  | name, phone, message, product (ref), type, isRead            |

---

## 🔐 Authentication

All **Private** routes require a Bearer token in the header:

```
Authorization: Bearer <your_jwt_token>
```

Get the token by calling `POST /api/auth/login`.

---

## 🌱 Seeder

```bash
node utils/seeder.js
```

Creates the default admin account and seeds all 5 services into MongoDB.
