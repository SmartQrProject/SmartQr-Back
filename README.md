# 🍽️ SmartQr Backend

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)

</div>

## 📋 Description

SmartQr Backend is a robust and scalable REST API built with NestJS for managing restaurant digital menus and orders. This system allows restaurant owners to create and manage their digital presence, including menus, categories, products, and more.

## ⚡ Key Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Owner, SuperAdmin)
  - Secure password handling

- 🏪 **Restaurant Management**
  - Create and manage restaurant profiles
  - Customize restaurant details (name, address, contact info)
  - Manage operating hours and ordering times
  - Location services with latitude/longitude support

- 📱 **Menu Management**
  - Category organization
  - Product management with details and pricing
  - Image handling for products and restaurant banners
  - Sequence control for categories and products

- 📚 **API Documentation**
  - Complete Swagger/OpenAPI documentation
  - Detailed endpoint descriptions
  - Request/response examples

## 🛠️ Technologies

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Documentation:** Swagger/OpenAPI
- **Authentication:** JWT (JSON Web Tokens)
- **API Security:** Bearer token authentication
- **Image Storage:** Cloudinary integration
- **Validation:** Class-validator & class-transformer

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

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
# Edit .env with your configuration
```

4. Start the development server
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`  
Swagger documentation will be at `http://localhost:3000/api`

## 📝 API Documentation

### Available Endpoints

#### Restaurant Management
- `POST /restaurants` - Create a new restaurant
- `GET /restaurants/:slug` - Get restaurant information
- `GET /restaurants/:slug/public` - Get public restaurant data
- `PATCH /restaurants/:slug` - Update restaurant information
- `DELETE /restaurants/:slug` - Delete a restaurant
- `GET /restaurants` - Get all restaurants (SuperAdmin only)

## 🔒 Security

- Bearer token authentication
- Role-based access control
- Input validation
- Secure password hashing
- Protected routes


<div align="center">
Made with ❤️ by [Your Name]
</div> 
