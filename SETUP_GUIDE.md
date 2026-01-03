# 🚀 GlobeTrotter - Complete Setup Guide

## ⚠️ IMPORTANT: Follow steps in order!

---

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ MySQL 8.0+ installed and running
- ✅ MySQL root password ready
- ✅ Git installed

---

## 🗄️ Part 1: Database Setup (Do This First!)

### Step 1.1: Start MySQL Service

**Windows:**
```powershell
net start MySQL80
# or
services.msc  # Then manually start MySQL service
```

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

### Step 1.2: Verify MySQL is Running
```bash
mysql -u root -p
# Enter your MySQL root password
# If successful, you'll see: mysql>
# Type: exit
```

---

## 🔧 Part 2: Backend Setup

### Step 2.1: Navigate to Backend
```bash
cd backend
```

### Step 2.2: Install Dependencies
```bash
npm install
```

### Step 2.3: Configure Environment
```bash
# Copy the example file
cp .env.example .env
```

**Edit `.env` file with your MySQL credentials:**
```env
PORT=5000
NODE_ENV=development

# IMPORTANT: Update these with YOUR MySQL credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD_HERE
DB_NAME=globetrotter
DB_PORT=3306

# Generate a random string for JWT (minimum 32 characters)
JWT_SECRET=globetrotter_super_secret_key_change_this_in_production_123456789
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
```

### Step 2.4: Setup Database & Tables
```bash
npm run db:setup
```

You should see:
```
✅ Connected to MySQL server
✅ Database 'globetrotter' created
✅ Database schema created successfully
✅ Default admin user created
```

**Default Admin Account Created:**
- Email: `admin@globetrotter.com`
- Password: `admin123`

### Step 2.5: Start Backend Server
```bash
npm run dev
```

You should see:
```
🚀 GlobeTrotter API server running on port 5000
📍 http://localhost:5000
✅ MySQL Database connected successfully
```

**✅ Backend is now running! Keep this terminal open.**

---

## 💻 Part 3: Frontend Setup

### Step 3.1: Open New Terminal
Open a NEW terminal window/tab (keep backend running)

### Step 3.2: Navigate to Project Root
```bash
cd GlobetrotterNULL  # or wherever you cloned the project
```

### Step 3.3: Install Dependencies
```bash
npm install
```

### Step 3.4: Configure Environment
```bash
# Copy the example file
cp .env.example .env
```

**Content of `.env` (should already be correct):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3.5: Start Frontend
```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

**✅ Frontend is now running!**

---

## 🧪 Part 4: Test Everything

### Test 1: Backend Health Check
Open browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "success": true,
  "message": "GlobeTrotter API is running",
  "timestamp": "..."
}
```

### Test 2: Test Login
Open browser: `http://localhost:3000`

Try admin login:
- Email: `admin@globetrotter.com`
- Password: `admin123`

### Test 3: Test Registration
Click "Create an Account" and register a new user.

---

## ❌ Troubleshooting

### Problem: "Registration failed"

**Check Backend Console** - Look for error messages

**Common Causes:**
1. **Database not setup**
   ```bash
   cd backend
   npm run db:setup
   ```

2. **MySQL not running**
   ```bash
   # Windows
   net start MySQL80
   ```

3. **Wrong MySQL credentials in backend/.env**
   - Double-check DB_PASSWORD
   - Try connecting manually: `mysql -u root -p`

4. **Port 5000 already in use**
   ```bash
   # Windows: Find and kill process
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   ```

### Problem: "CORS error" or "Network error"

1. **Backend not running**
   - Check terminal where you ran `npm run dev` in backend folder
   - Should see: "🚀 GlobeTrotter API server running"

2. **Wrong API URL**
   - Check `.env` in root folder
   - Should have: `VITE_API_URL=http://localhost:5000/api`
   - Restart frontend after changing

3. **Firewall blocking**
   - Allow Node.js through Windows Firewall
   - Try: `http://127.0.0.1:5000/api/health`

### Problem: "ER_ACCESS_DENIED_ERROR"

**Solution:** MySQL credentials wrong in `backend/.env`
```bash
# Test your credentials
mysql -u root -p
# If this fails, reset MySQL root password
```

### Problem: "ER_BAD_DB_ERROR: Unknown database"

**Solution:** Database not created
```bash
cd backend
npm run db:setup
```

### Problem: Database tables don't exist

**Solution:** Re-run setup script
```bash
cd backend
# This will DROP and recreate everything
npm run db:setup
```

**⚠️ Warning:** This deletes all existing data!

---

## 📊 Verify Database Tables

```bash
# Connect to MySQL
mysql -u root -p

# Switch to database
USE globetrotter;

# List all tables
SHOW TABLES;

# Should show:
# +------------------------+
# | Tables_in_globetrotter |
# +------------------------+
# | activities             |
# | activity_templates     |
# | cities                 |
# | community_posts        |
# | post_comments          |
# | post_likes             |
# | stops                  |
# | trips                  |
# | users                  |
# +------------------------+

# Check users table
SELECT id, email, first_name, role FROM users;

# Should show admin user
```

---

## 🎯 Quick Commands Summary

```bash
# Backend (Terminal 1)
cd backend
npm install
cp .env.example .env  # Edit with MySQL password
npm run db:setup
npm run dev

# Frontend (Terminal 2)
npm install
cp .env.example .env
npm run dev

# Test
# Browser: http://localhost:3000
# Login with: admin@globetrotter.com / admin123
```

---

## 📞 Still Having Issues?

### Check These:
1. ✅ MySQL service is running
2. ✅ Backend terminal shows no errors
3. ✅ Frontend terminal shows no errors
4. ✅ Browser console (F12) shows no CORS errors
5. ✅ backend/.env has correct MySQL password
6. ✅ Both servers running on correct ports (3000 and 5000)

### Console Logs to Check:
**Backend should show:**
```
✅ MySQL Database connected successfully
🚀 GlobeTrotter API server running on port 5000
```

**On registration/login attempts, backend shows:**
```
2026-01-03... - POST /api/auth/register
Registration attempt for: user@example.com
User created successfully: user@example.com
```

If you don't see these logs, the request isn't reaching the backend!

---

## 🔄 Complete Reset

If everything is broken, start fresh:

```bash
# 1. Stop all servers (Ctrl+C in both terminals)

# 2. Reset database
mysql -u root -p
DROP DATABASE globetrotter;
exit

# 3. Re-setup
cd backend
npm run db:setup
npm run dev

# 4. Restart frontend (in new terminal)
npm run dev
```

---

*Last Updated: January 3, 2026*
