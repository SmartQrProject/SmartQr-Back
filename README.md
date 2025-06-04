# 🍽️ SmartQr Backend

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-EB5424?style=for-the-badge&logo=auth0&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

## 📋 Description

SmartQr Backend is a robust and scalable REST API built with NestJS for managing restaurant digital menus and orders. This system allows restaurant owners to create and manage their digital presence, including menus, categories, products, and more, with features like real-time order tracking and payment processing.

## ⚡ Key Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Auth0 integration for customer authentication
  - Role-based access control (Owner, SuperAdmin, Staff)
  - Secure password handling with bcrypt

- 🏪 **Restaurant Management**
  - Create and manage restaurant profiles
  - Customize restaurant details (name, address, contact info)
  - Manage operating hours and ordering times
  - Location services with latitude/longitude support
  - Table management system

- 📱 **Menu Management**
  - Category organization with sequence control
  - Product management with details and pricing
  - Image handling with Cloudinary integration
  - Real-time menu updates

- 💳 **Payment Processing**
  - Stripe integration for secure payments
  - Subscription management
  - Webhook handling for payment events
  - Reward code system

- 🔄 **Real-time Features**
  - WebSocket integration with Socket.io
  - Live order updates
  - Real-time notifications

- 📨 **Communication**
  - Email notifications via SMTP
  - Order confirmations
  - Customer communications

## 🛠️ Technologies

### Core Framework & Language
- **Framework:** NestJS v11
- **Language:** TypeScript v5
- **Runtime:** Node.js v20

### Database & ORM
- **Database:** PostgreSQL
- **ORM:** TypeORM v0.3
- **Migration Support:** Built-in TypeORM migrations

### Authentication & Security
- **JWT:** @nestjs/jwt
- **Auth0:** express-oauth2-jwt-bearer
- **Password Hashing:** bcryptjs
- **Role-based Access:** Custom implementation

### File Storage & Media
- **Cloud Storage:** Cloudinary
- **File Handling:** multer
- **Stream Processing:** buffer-to-stream

### Payment Processing
- **Payment Gateway:** Stripe v18
- **Webhook Handling:** Custom implementation

### Real-time Communication
- **WebSockets:** Socket.io v4
- **Event Handling:** @nestjs/event-emitter

### Documentation & API
- **API Documentation:** Swagger/OpenAPI v11
- **Schema Validation:** class-validator & class-transformer

### Development & Testing
- **Testing Framework:** Jest
- **E2E Testing:** Supertest
- **Code Quality:** ESLint & Prettier
- **Build Tools:** @nestjs/cli & swc

## 📝 API Documentation

### Restaurant Management
```http
POST   /restaurants/create          # Create new restaurant
GET    /restaurants?slug={slug}     # Get restaurant by slug
GET    /restaurants/public          # Get public restaurant data
PATCH  /restaurants/{slug}          # Update restaurant
DELETE /restaurants/{slug}          # Delete restaurant
GET    /restaurants/all            # Get all restaurants (SuperAdmin)
```

### Menu Management
```http
POST   /{slug}/categories          # Create category
GET    /{slug}/categories          # Get all categories
PATCH  /{slug}/categories/{id}     # Update category
DELETE /{slug}/categories/{id}     # Delete category

POST   /{slug}/products           # Create product
GET    /{slug}/products           # Get all products
PATCH  /{slug}/products/{id}      # Update product
DELETE /{slug}/products/{id}      # Delete product
```

### Table Management
```http
POST   /{slug}/restaurant-tables/seeder/{qty}/{prefix}  # Generate tables
DELETE /{slug}/restaurant-tables/{id}                   # Delete table
PATCH  /{slug}/restaurant-tables/{id}                   # Update table
```

### Order Management
```http
POST   /{slug}/orders             # Create order
GET    /{slug}/orders             # Get all orders
PATCH  /{slug}/orders/{id}        # Update order status
```

### Customer Management
```http
POST   /{slug}/customers/sincronizar  # Sync Auth0 customer
```

### Payment & Rewards
```http
POST   /stripe/webhook            # Handle Stripe webhooks
GET    /{slug}/reward-codes       # Get all reward codes
DELETE /{slug}/reward-codes/{id}  # Delete reward code
```

## 🚀 Getting Started

### Prerequisites

- Node.js v20 or higher
- PostgreSQL
- npm or yarn
- Stripe account
- Auth0 account
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/SmartQr-Back.git
cd SmartQr-Back
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Configure the following variables:
# - Database connection
# - JWT settings
# - Auth0 credentials
# - Stripe keys
# - Cloudinary credentials
# - SMTP settings
```

4. Start the development server
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`  
Swagger documentation will be at `http://localhost:3000/api`

## 🔒 Security Features

- Bearer token authentication
- Auth0 integration for customer authentication
- Role-based access control
- Input validation and sanitization
- Secure password hashing
- Protected routes
- CORS configuration
- Rate limiting
- Request validation

## 🚀 Deployment

This project is configured for deployment on Render:
- Node.js version: 20
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`

---

<div align="center">
Made By Smart-Qr
</div>
