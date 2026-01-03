# GlobeTrotter Backend API

Node.js + Express + MySQL backend for GlobeTrotter application.

## Prerequisites

- Node.js 18+
- MySQL 8.0+

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your MySQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=globetrotter
JWT_SECRET=your_random_secret_key
```

### 3. Setup Database

Make sure MySQL is running, then run:

```bash
npm run db:setup
```

This will:
- Create the `globetrotter` database
- Create all required tables
- Insert a default admin user

**Default Admin Credentials:**
- Email: `admin@globetrotter.com`
- Password: `admin123`

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "city": "New York",
  "country": "USA",
  "bio": "Travel enthusiast"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## Database Schema

See `DATABASE_SCHEMA.sql` in the root directory for complete schema.

## Project Structure

```
backend/
├── config/
│   └── database.js       # MySQL connection pool
├── routes/
│   └── auth.js           # Authentication routes
├── scripts/
│   └── setup-database.js # Database setup script
├── .env.example          # Environment template
├── server.js             # Express server
└── package.json
```

## Testing the API

Using curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Troubleshooting

### MySQL Connection Error
- Verify MySQL is running: `mysql --version`
- Check credentials in `.env`
- Ensure MySQL port 3306 is not blocked

### "Database doesn't exist"
- Run `npm run db:setup` to create database

### JWT Token Invalid
- Token expires after 7 days by default
- Clear browser localStorage and login again

---

Built with Express.js + MySQL
