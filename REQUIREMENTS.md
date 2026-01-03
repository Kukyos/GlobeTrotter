# GlobeTrotter - Project Requirements & Development Log

> **Empowering Personalized Travel Planning**

---

## 📋 Table of Contents
- [Project Vision](#project-vision)
- [Mission Statement](#mission-statement)
- [Core Features](#core-features)
- [Technical Stack](#technical-stack)
- [Database Schema](#database-schema)
- [Screen Requirements](#screen-requirements)
- [Development Progress](#development-progress)
- [Notes & Decisions](#notes--decisions)

---

## 🌍 Project Vision

GlobeTrotter aims to become a **personalized, intelligent, and collaborative platform** that transforms how individuals plan and experience travel. The platform empowers users to:

- Dream, design, and organize trips with ease
- Explore global destinations and visualize journeys
- Make cost-effective decisions with budget tracking
- Share travel plans within a community

**Making travel planning as exciting as the trip itself.**

---

## 🎯 Mission Statement

Build a **user-centric, responsive application** that simplifies multi-city travel planning. Provide travelers with intuitive tools to:

- ✅ Add and manage travel stops and durations
- ✅ Explore cities and activities of interest
- ✅ Estimate trip budgets automatically
- ✅ Visualize timelines and plans
- ✅ Share trip plans with others

---

## ⭐ Core Features

### 1. Login / Signup Screen
- **Description**: Entry point allowing users to create or access their account
- **Purpose**: Authenticate users to manage personal travel plans
- **Components**:
  - Email & password fields
  - Login button
  - Signup link
  - "Forgot Password" option
  - Basic validation
  - Profile photo placeholder

### 2. Dashboard / Home Screen
- **Description**: Central hub showing upcoming trips, popular cities, and quick actions
- **Purpose**: Navigation to trips and inspiration exploration
- **Components**:
  - Welcome message
  - Recent trips list
  - "Plan New Trip" button
  - Recommended destinations
  - Budget highlights
  - Banner image
  - Top regional selections

### 3. Create Trip Screen
- **Description**: Form to initiate a new trip with name, dates, and description
- **Purpose**: Begin the travel planning process
- **Components**:
  - Trip name input
  - Start & end date pickers
  - Destination selection
  - Place suggestions with AI
  - Save button

### 4. My Trips (Trip List) Screen
- **Description**: List view of all user-created trips with summary data
- **Purpose**: Access and manage existing/upcoming trips
- **Components**:
  - Trip cards (name, date range, destination count)
  - Edit/View/Delete actions
  - Status sections (Ongoing, Upcoming, Completed)
  - Search, filter, sort, group options

### 5. Itinerary Builder Screen
- **Description**: Interface to add cities, dates, and activities for each stop
- **Purpose**: Construct full day-wise trip plans interactively
- **Components**:
  - "Add Stop" button
  - City and date selection
  - Activity assignment per stop
  - Section-based organization
  - Date range and budget per section
  - Drag-to-reorder functionality

### 6. Itinerary View Screen
- **Description**: Visual representation of completed trip itinerary
- **Purpose**: Review plans in structured timeline format
- **Components**:
  - Day-wise layout
  - City headers
  - Activity blocks with time and cost
  - Physical activity and expense columns

### 7. City Search
- **Description**: Search interface for cities with country, cost index, popularity
- **Purpose**: Discover and include cities in itinerary
- **Components**:
  - Search bar
  - City cards with meta info
  - "Add to Trip" button
  - Filter by country/region

### 8. Activity Search
- **Description**: Browse activities by interest or cost
- **Purpose**: Enrich trips with experiences
- **Components**:
  - Activity filters (type, cost, duration)
  - Add/remove buttons
  - Quick view descriptions and images

### 9. Trip Budget & Cost Breakdown Screen
- **Description**: Summarized financial view with breakdowns
- **Purpose**: Help travelers stay within budget
- **Components**:
  - Cost breakdown (transport, stay, activities, meals)
  - Pie/bar charts
  - Average cost per day
  - Overbudget alerts

### 10. Trip Calendar / Timeline Screen
- **Description**: Calendar-based or vertical timeline view
- **Purpose**: Visualize journey and daily flow
- **Components**:
  - Calendar component
  - Expandable day views
  - Drag-to-reorder activities
  - Quick editing options

### 11. Shared/Public Itinerary View
- **Description**: Public page displaying shareable itinerary
- **Purpose**: Allow others to view, get inspired, or copy trips
- **Components**:
  - Public URL
  - Itinerary summary
  - "Copy Trip" button
  - Social media sharing
  - Read-only view

### 12. User Profile / Settings Screen
- **Description**: User settings for profile and preferences
- **Purpose**: Control data, preferences, and privacy
- **Components**:
  - Editable fields (name, photo, email)
  - Preplanned trips section
  - Previous trips display
  - Language preference
  - Delete account option
  - Saved destinations list

### 13. Admin / Analytics Dashboard
- **Description**: Admin-only interface for tracking trends
- **Purpose**: Monitor app adoption and user behavior
- **Components**:
  - Tables and charts of trips
  - Top cities/activities
  - User engagement stats
  - User management tools
  - Manage Users tab
  - Popular cities tab
  - Popular activities tab
  - User trends and analytics

### 14. Community Tab (Screen 10)
- **Description**: Community section for user sharing
- **Purpose**: Share experiences about trips or activities
- **Components**:
  - Post feed with user avatars
  - Search, groupby, filter, sortby options
  - Comment/interaction features

---

## 🛠 Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3.4
- **Icons**: Lucide React
- **Routing**: React Router DOM v6

### Backend (Planned)
- **API**: RESTful endpoints
- **Database**: PostgreSQL (relational)
- **Authentication**: JWT-based auth
- **File Storage**: Cloud storage for images

### Design System
- **Fonts**: Inter (body), Outfit (headings)
- **Theme**: Dark mode with green accent (#22c55e)
- **Effects**: Glass morphism, subtle glows, smooth animations

---

## 🗄 Database Schema (Planned)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  phone VARCHAR(20),
  photo_url TEXT,
  city VARCHAR(100),
  country VARCHAR(100),
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Trips table
CREATE TABLE trips (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  cover_photo TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  is_public BOOLEAN DEFAULT false,
  total_budget DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Stops table
CREATE TABLE stops (
  id UUID PRIMARY KEY,
  trip_id UUID REFERENCES trips(id),
  city_id UUID REFERENCES cities(id),
  city_name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  order_index INTEGER NOT NULL,
  notes TEXT
);

-- Activities table
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  stop_id UUID REFERENCES stops(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  activity_date DATE,
  start_time TIME,
  end_time TIME,
  location VARCHAR(255),
  image_url TEXT,
  is_booked BOOLEAN DEFAULT false
);

-- Cities reference table
CREATE TABLE cities (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  continent VARCHAR(50),
  description TEXT,
  image_url TEXT,
  cost_index INTEGER CHECK (cost_index BETWEEN 1 AND 5),
  popularity INTEGER DEFAULT 0,
  timezone VARCHAR(50)
);
```

---

## 📊 Development Progress

### Phase 1: Authentication (Current)
| Screen | Status | Date | Notes |
|--------|--------|------|-------|
| Login Screen | ✅ Complete | Jan 3, 2026 | Animated, glass morphism design |
| Register Screen | ✅ Complete | Jan 3, 2026 | Full form with validation |

### Phase 2: Core Features (Pending)
| Screen | Status | Date | Notes |
|--------|--------|------|-------|
| Dashboard | ⏳ Pending | - | - |
| Create Trip | ⏳ Pending | - | - |
| My Trips | ⏳ Pending | - | - |
| Itinerary Builder | ⏳ Pending | - | - |

### Phase 3: Search & Discovery (Pending)
| Screen | Status | Date | Notes |
|--------|--------|------|-------|
| City Search | ⏳ Pending | - | - |
| Activity Search | ⏳ Pending | - | - |

### Phase 4: Analytics & Sharing (Pending)
| Screen | Status | Date | Notes |
|--------|--------|------|-------|
| Budget Breakdown | ⏳ Pending | - | - |
| Calendar View | ⏳ Pending | - | - |
| Public Itinerary | ⏳ Pending | - | - |
| Admin Panel | ⏳ Pending | - | - |

---

## 📝 Notes & Decisions

### January 3, 2026
- **Project Initialization**
  - Created `GlobetrotterNULL` folder as clean implementation
  - Using reference from AI Studio prototype in `globetrotter` folder
  - Building step-by-step for cleaner commit history
  - Started with Login/Register screens

- **Design Decisions**
  - Dark theme with emerald/green accent (#22c55e) for travel vibes
  - Glass morphism effects for modern look
  - Smooth animations for better UX
  - Mobile-first responsive design
  - Accessibility considerations (focus states, ARIA labels)

- **Technical Decisions**
  - React 18 for concurrent features
  - TypeScript for type safety
  - TailwindCSS for rapid styling
  - Vite for fast development
  - Structured folder organization for scalability

---

## 🔗 Resources

- **Design Mockup**: https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1
- **GitHub Repository**: https://github.com/Kukyos/GlobeTrotter.git

---

*Last Updated: January 3, 2026*
