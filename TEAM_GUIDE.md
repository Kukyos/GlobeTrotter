# 🌍 GlobeTrotter - Team Development Guide

> **Team Collaboration & Page Assignment Strategy**

---

## 👥 Team Structure

| Member | Role | Focus Area |
|--------|------|------------|
| **Member A** | Lead Developer | Core Infrastructure + Auth + Admin |
| **Member B** | Frontend Developer | Trip Management + Itinerary |
| **Member C** | Frontend Developer | Discovery + Analytics + Social |

---

## 📊 Page Assignment Matrix

### ✅ COMPLETED (Member A)
| Screen | Status | Commit |
|--------|--------|--------|
| Login Screen | ✅ Done | Initial commit |
| Register Screen | ✅ Done | Initial commit |

---

### 🔵 MEMBER A - Core & Admin
**Focus**: Authentication, Navigation, Admin, Profile

| Priority | Screen | Complexity | Dependencies |
|----------|--------|------------|--------------|
| 1 | Navigation Component | Medium | None |
| 2 | Dashboard / Home | High | Navigation |
| 3 | Profile Settings | Medium | Auth |
| 4 | Admin Panel | High | Auth (admin role) |

**Why this split**: Auth foundation is set, continue with core navigation and admin features.

---

### 🟢 MEMBER B - Trip Management
**Focus**: Trip CRUD, Itinerary Building, Calendar

| Priority | Screen | Complexity | Dependencies |
|----------|--------|------------|--------------|
| 1 | Create Trip | Medium | Navigation |
| 2 | My Trips (List) | Medium | Trips API |
| 3 | Itinerary Builder | High | Trips, Stops |
| 4 | Itinerary View | Medium | Builder |
| 5 | Calendar/Timeline | High | Itinerary |

**Why this split**: All trip-related CRUD operations and core planning workflow.

---

### 🟡 MEMBER C - Discovery & Social
**Focus**: Search, Budget, Sharing, Community

| Priority | Screen | Complexity | Dependencies |
|----------|--------|------------|--------------|
| 1 | City Search | Medium | Cities API |
| 2 | Activity Search | Medium | Activities API |
| 3 | Budget Breakdown | High | Trips, Activities |
| 4 | Public Itinerary | Medium | Trips |
| 5 | Community Tab | Medium | Users, Trips |

**Why this split**: Discovery features and analytics are standalone modules.

---

## 🔄 Development Workflow

### Git Branching Strategy
```
main
├── feat/navigation          (Member A)
├── feat/dashboard           (Member A)
├── feat/profile             (Member A)
├── feat/admin-panel         (Member A)
├── feat/create-trip         (Member B)
├── feat/my-trips            (Member B)
├── feat/itinerary-builder   (Member B)
├── feat/itinerary-view      (Member B)
├── feat/calendar            (Member B)
├── feat/city-search         (Member C)
├── feat/activity-search     (Member C)
├── feat/budget              (Member C)
├── feat/public-itinerary    (Member C)
└── feat/community           (Member C)
```

### Commit Convention
```
feat: Add [ScreenName] - [brief description]
fix: Fix [issue] in [ScreenName]
style: Update styling for [component]
refactor: Refactor [component/function]
docs: Update documentation for [feature]
```

### PR Process
1. Create feature branch from `main`
2. Build your assigned screen
3. Test locally (`npm run build`)
4. Commit with proper message
5. Push and create PR
6. Get 1 teammate review
7. Merge to main

---

## 📁 Project Structure

```
src/
├── components/          # Shared/reusable components
│   ├── ui/              # Basic UI (Button, Input, Card, Modal)
│   ├── layout/          # Layout (Navigation, Footer, PageWrapper)
│   └── common/          # Common (LoadingSpinner, ErrorBoundary)
│
├── pages/               # Page components (one per screen)
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── Dashboard.tsx
│   ├── CreateTrip.tsx
│   ├── MyTrips.tsx
│   ├── ItineraryBuilder.tsx
│   ├── ItineraryView.tsx
│   ├── CitySearch.tsx
│   ├── ActivitySearch.tsx
│   ├── BudgetBreakdown.tsx
│   ├── Calendar.tsx
│   ├── PublicItinerary.tsx
│   ├── ProfileSettings.tsx
│   ├── AdminPanel.tsx
│   └── Community.tsx
│
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useTrips.ts
│   └── useApi.ts
│
├── services/            # API service functions
│   ├── api.ts
│   ├── authService.ts
│   ├── tripService.ts
│   ├── cityService.ts
│   └── activityService.ts
│
├── types/               # TypeScript types
│   └── index.ts
│
├── utils/               # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
│
├── context/             # React Context providers
│   └── AuthContext.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🎨 Design System (MUST FOLLOW)

### Colors
```css
/* Primary - Green accent */
--globe-500: #22c55e;
--globe-600: #16a34a;

/* Background */
--bg-primary: #000000;
--bg-card: rgba(255, 255, 255, 0.05);

/* Text */
--text-primary: #ffffff;
--text-secondary: rgba(255, 255, 255, 0.5);
--text-muted: rgba(255, 255, 255, 0.3);

/* Borders */
--border-default: rgba(255, 255, 255, 0.1);
--border-hover: rgba(255, 255, 255, 0.2);
```

### Component Classes (Use These!)
```tsx
// Buttons
className="btn-primary"    // Green gradient button
className="btn-secondary"  // Ghost/outline button

// Inputs
className="input-field"    // Styled input
className="input-label"    // Label above input

// Cards
className="card"           // Glass card
className="glass"          // Glass effect
className="glow-border"    // Subtle glow

// Text
className="glow-text"      // Glowing heading text
className="font-display"   // Outfit font for headings
```

### Animation Classes
```tsx
className="animate-float"      // Floating animation
className="animate-pulse-slow" // Slow pulse
className="gradient-mesh"      // Background gradient
```

---

## 🗄️ MySQL Database Schema

See `DATABASE_SCHEMA.sql` for complete schema.

### Key Tables
- `users` - User accounts
- `trips` - User trips
- `stops` - Cities within trips
- `activities` - Activities within stops
- `cities` - Reference city data
- `activity_templates` - Pre-defined activities per city
- `community_posts` - Community posts
- `post_comments` - Comments on posts
- `post_likes` - Post likes

### Relationships
```
users (1) ──► (N) trips
trips (1) ──► (N) stops
stops (1) ──► (N) activities
cities (1) ──► (N) activity_templates
users (1) ──► (N) community_posts
```

---

## 🔌 API Endpoints Summary

### Auth: `/api/auth/*`
- POST `/register`, `/login`, `/logout`
- GET `/me`

### Users: `/api/users/*`
- GET, PUT, DELETE `/:id`

### Trips: `/api/trips/*`
- GET `/` (list), POST `/` (create)
- GET, PUT, DELETE `/:id`

### Stops: `/api/trips/:tripId/stops/*`
- GET, POST, PUT, DELETE, reorder

### Activities: `/api/stops/:stopId/activities/*`
- GET, POST, PUT, DELETE

### Cities: `/api/cities/*`
- GET `/`, `/:id`, `/popular`, `/:id/activities`

### Community: `/api/community/*`
- GET, POST posts
- POST likes, comments

### Admin: `/api/admin/*`
- GET `/stats`, `/users`, `/analytics`

---

## ⚡ Quick Start

```bash
# 1. Clone & Setup
git clone https://github.com/Kukyos/GlobeTrotter.git
cd GlobeTrotter
npm install

# 2. Create Your Branch
git checkout -b feat/[your-screen-name]

# 3. Start Dev Server
npm run dev

# 4. Build & Test
npm run build

# 5. Commit & Push
git add .
git commit -m "feat: Add [ScreenName]"
git push origin feat/[your-screen-name]
```

---

## 🚨 Important Rules

1. ❌ DON'T modify other team members' files without discussion
2. ✅ DO use shared components in `src/components/ui/`
3. ❌ DON'T change design system colors/fonts
4. ✅ DO follow TypeScript types in `src/types/`
5. ❌ DON'T commit `node_modules` or `.env` files
6. ✅ DO test build before pushing
7. ✅ DO create meaningful commit messages
8. ✅ DO communicate blockers immediately

---

## 📋 Individual Requirements

- See `MEMBER_A_REQUIREMENTS.md` for Member A specs
- See `MEMBER_B_REQUIREMENTS.md` for Member B specs
- See `MEMBER_C_REQUIREMENTS.md` for Member C specs

---

*Last Updated: January 3, 2026*
