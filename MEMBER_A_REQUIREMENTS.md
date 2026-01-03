# 🔵 Member A - Core & Admin Requirements

> **Focus**: Navigation, Dashboard, Profile, Admin Panel

---

## 📋 Your Assigned Screens

| # | Screen | Priority | Status |
|---|--------|----------|--------|
| ✅ | Login Screen | - | DONE |
| ✅ | Register Screen | - | DONE |
| 1 | Navigation Component | HIGH | Pending |
| 2 | Dashboard / Home | HIGH | Pending |
| 3 | Profile Settings | MEDIUM | Pending |
| 4 | Admin Panel | HIGH | Pending |

---

## 🧭 Screen 1: Navigation Component

### File: `src/components/layout/Navigation.tsx`

### Description
Global navigation bar that appears on all authenticated pages. Sticky header with logo, menu items, and user actions.

### Mockup Reference
- Top bar with "GlobeTrotter" logo
- Search bar (optional)
- Group by, Filter, Sort buttons
- User avatar/profile dropdown

### Component Requirements

```tsx
interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}
```

### UI Elements
1. **Logo Section** (Left)
   - GlobeTrotter text logo with globe icon
   - Clickable → navigates to Dashboard

2. **Search Bar** (Center - Optional)
   - Placeholder: "Search trips, cities..."
   - Expandable on focus

3. **Action Buttons** (Center-Right)
   - "Group by" dropdown
   - "Filter" button
   - "Sort by" dropdown

4. **User Section** (Right)
   - User avatar (circular)
   - Dropdown menu on click:
     - My Profile
     - My Trips
     - Settings
     - Admin Panel (if admin)
     - Divider
     - Sign Out

### Styling
```tsx
// Sticky navigation
className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"

// Height
height: 64px (h-16)

// Container
className="container mx-auto px-6 flex items-center justify-between"
```

### State Management
- Active route highlighting
- Dropdown open/close states
- Mobile menu toggle (hamburger)

### Mobile Behavior
- Hamburger menu icon
- Slide-out drawer or dropdown
- All menu items accessible

---

## 🏠 Screen 2: Dashboard / Home

### File: `src/pages/Dashboard.tsx`

### Description
Central hub showing user's trips overview, recommendations, and quick actions after login.

### Mockup Reference (Screen 3)
- Banner image at top
- Search bar with filter options
- "Top Regional Selections" section
- "Previous Trips" section
- "Plan a Trip" button

### Component Requirements

```tsx
interface DashboardProps {
  user: User;
  trips: Trip[];
}
```

### UI Sections

#### 1. Welcome Banner
```tsx
<section className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8">
  {/* Background image with overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />
  <div className="relative z-10 p-8 flex flex-col justify-end h-full">
    <h1 className="text-4xl font-display font-bold">
      Welcome back, {user.firstName}! 👋
    </h1>
    <p className="text-white/60 mt-2">Ready for your next adventure?</p>
  </div>
</section>
```

#### 2. Quick Actions Bar
```tsx
<div className="flex flex-wrap gap-4 mb-8">
  <button className="btn-primary">
    <Plus /> Plan New Trip
  </button>
  <button className="btn-secondary">
    <Search /> Explore Cities
  </button>
  <button className="btn-secondary">
    <Calendar /> View Calendar
  </button>
</div>
```

#### 3. Trip Stats Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <StatCard title="Upcoming Trips" value={upcomingCount} icon={<Plane />} />
  <StatCard title="Countries Visited" value={countriesCount} icon={<Globe />} />
  <StatCard title="Total Budget" value={`$${totalBudget}`} icon={<DollarSign />} />
</div>
```

#### 4. Top Regional Selections
```tsx
<section className="mb-8">
  <h2 className="text-xl font-display font-semibold mb-4">
    Top Regional Selections
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {popularCities.map(city => (
      <CityCard key={city.id} city={city} />
    ))}
  </div>
</section>
```

#### 5. Recent/Previous Trips
```tsx
<section>
  <h2 className="text-xl font-display font-semibold mb-4">
    Your Recent Trips
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {recentTrips.map(trip => (
      <TripCard key={trip.id} trip={trip} />
    ))}
  </div>
</section>
```

### Sub-Components to Create

#### StatCard
```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
}
```

#### CityCard (Small)
```tsx
interface CityCardProps {
  city: {
    id: string;
    name: string;
    country: string;
    imageUrl?: string;
  };
  onClick?: () => void;
}
```

#### TripCard (Preview)
```tsx
interface TripCardProps {
  trip: Trip;
  onView?: () => void;
  onEdit?: () => void;
}
```

### API Calls Needed
```typescript
// Get user's trips
GET /api/trips?status=upcoming&limit=6

// Get popular cities
GET /api/cities/popular?limit=5

// Get user stats (optional - can calculate client-side)
GET /api/users/:id/stats
```

### State
```typescript
const [trips, setTrips] = useState<Trip[]>([]);
const [popularCities, setPopularCities] = useState<City[]>([]);
const [isLoading, setIsLoading] = useState(true);
```

---

## 👤 Screen 3: Profile Settings

### File: `src/pages/ProfileSettings.tsx`

### Description
User profile page to view and edit personal information, preferences, and account settings.

### Mockup Reference (Screen 7)
- User image (large, circular)
- User details with edit options
- "Preplanned Trips" section with View buttons
- "Previous Trips" section

### Component Requirements

```tsx
interface ProfileSettingsProps {
  user: User;
  setUser: (user: User | null) => void;
}
```

### UI Sections

#### 1. Profile Header
```tsx
<div className="flex flex-col md:flex-row items-center gap-6 mb-8">
  {/* Avatar with edit button */}
  <div className="relative">
    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-globe-500/30">
      <img src={user.photoUrl || defaultAvatar} alt="Profile" />
    </div>
    <button className="absolute bottom-0 right-0 w-10 h-10 bg-globe-500 rounded-full">
      <Camera className="w-5 h-5" />
    </button>
  </div>
  
  {/* Name and role */}
  <div>
    <h1 className="text-2xl font-display font-bold">
      {user.firstName} {user.lastName}
    </h1>
    <p className="text-white/50">{user.email}</p>
    <span className="inline-block mt-2 px-3 py-1 bg-globe-500/20 text-globe-400 rounded-full text-sm">
      {user.role}
    </span>
  </div>
</div>
```

#### 2. Edit Profile Form
```tsx
<form className="card space-y-6">
  <h2 className="text-lg font-semibold">Personal Information</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <InputField label="First Name" name="firstName" value={...} />
    <InputField label="Last Name" name="lastName" value={...} />
    <InputField label="Email" name="email" type="email" value={...} />
    <InputField label="Phone" name="phone" type="tel" value={...} />
    <InputField label="City" name="city" value={...} />
    <InputField label="Country" name="country" value={...} />
  </div>
  
  <div>
    <label className="input-label">Bio</label>
    <textarea className="input-field" rows={4} />
  </div>
  
  <button type="submit" className="btn-primary">
    Save Changes
  </button>
</form>
```

#### 3. Preplanned Trips Section
```tsx
<section className="mt-8">
  <h2 className="text-lg font-semibold mb-4">Preplanned Trips</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {upcomingTrips.map(trip => (
      <TripCard key={trip.id} trip={trip} showViewButton />
    ))}
  </div>
</section>
```

#### 4. Previous Trips Section
```tsx
<section className="mt-8">
  <h2 className="text-lg font-semibold mb-4">Previous Trips</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {completedTrips.map(trip => (
      <TripCard key={trip.id} trip={trip} showViewButton />
    ))}
  </div>
</section>
```

#### 5. Account Settings
```tsx
<section className="mt-8 card">
  <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
  
  <div className="space-y-4">
    <button className="btn-secondary w-full justify-start">
      <Key /> Change Password
    </button>
    <button className="btn-secondary w-full justify-start">
      <Bell /> Notification Preferences
    </button>
    <button className="btn-secondary w-full justify-start text-red-400 hover:text-red-300">
      <Trash2 /> Delete Account
    </button>
  </div>
</section>
```

### API Calls
```typescript
PUT /api/users/:id          // Update profile
PUT /api/auth/password      // Change password
DELETE /api/users/:id       // Delete account
GET /api/trips?userId=:id   // Get user's trips
```

---

## 🛡️ Screen 4: Admin Panel

### File: `src/pages/AdminPanel.tsx`

### Description
Admin-only dashboard for managing users, viewing analytics, and monitoring platform usage.

### Mockup Reference (Screen 12)
- Search bar with Group by, Filter, Sort
- Tabs: Manage Users, Popular Cities, Popular Activities, User Trends
- Charts and graphs
- Data tables

### Component Requirements

```tsx
interface AdminPanelProps {
  user: User; // Must be admin role
}
```

### Access Control
```tsx
// At component start
if (user.role !== UserRole.ADMIN) {
  return <Navigate to="/dashboard" replace />;
}
```

### UI Sections

#### 1. Admin Header
```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
    <p className="text-white/50">Platform overview and management</p>
  </div>
  <div className="flex gap-2">
    <button className="btn-secondary">Export Data</button>
    <button className="btn-primary">Generate Report</button>
  </div>
</div>
```

#### 2. Stats Overview
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  <StatCard title="Total Users" value={stats.totalUsers} icon={<Users />} />
  <StatCard title="Active Trips" value={stats.activeTrips} icon={<Map />} />
  <StatCard title="Cities Explored" value={stats.citiesExplored} icon={<Globe />} />
  <StatCard title="Total Revenue" value={`$${stats.revenue}`} icon={<DollarSign />} />
</div>
```

#### 3. Tab Navigation
```tsx
const tabs = [
  { id: 'users', label: 'Manage Users', icon: <Users /> },
  { id: 'cities', label: 'Popular Cities', icon: <MapPin /> },
  { id: 'activities', label: 'Popular Activities', icon: <Activity /> },
  { id: 'analytics', label: 'User Trends', icon: <TrendingUp /> },
];

<div className="flex gap-2 mb-6 overflow-x-auto">
  {tabs.map(tab => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap
        ${activeTab === tab.id ? 'bg-globe-500 text-white' : 'btn-secondary'}`}
    >
      {tab.icon}
      {tab.label}
    </button>
  ))}
</div>
```

#### 4. Users Management Tab
```tsx
<div className="card">
  {/* Search and filters */}
  <div className="flex gap-4 mb-4">
    <input className="input-field flex-1" placeholder="Search users..." />
    <select className="input-field w-40">
      <option>All Roles</option>
      <option>Users</option>
      <option>Admins</option>
    </select>
  </div>
  
  {/* Users table */}
  <table className="w-full">
    <thead>
      <tr className="text-left text-white/50 border-b border-white/10">
        <th className="pb-3">User</th>
        <th className="pb-3">Email</th>
        <th className="pb-3">Trips</th>
        <th className="pb-3">Role</th>
        <th className="pb-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <UserRow key={user.id} user={user} onRoleChange={...} />
      ))}
    </tbody>
  </table>
</div>
```

#### 5. Analytics Charts
```tsx
// Use recharts library
import { LineChart, PieChart, BarChart } from 'recharts';

// User growth over time
<LineChart data={userGrowthData}>
  <Line type="monotone" dataKey="users" stroke="#22c55e" />
</LineChart>

// Popular cities pie chart
<PieChart>
  <Pie data={cityData} dataKey="visits" nameKey="city" />
</PieChart>

// Activity categories bar chart
<BarChart data={activityData}>
  <Bar dataKey="count" fill="#22c55e" />
</BarChart>
```

### API Calls
```typescript
GET /api/admin/stats           // Platform statistics
GET /api/admin/users           // All users (paginated)
PUT /api/admin/users/:id/role  // Update user role
GET /api/admin/analytics       // Analytics data
GET /api/cities/popular        // Popular cities data
GET /api/admin/activities      // Popular activities
```

### Charts Data Structure
```typescript
interface AnalyticsData {
  userGrowth: { date: string; count: number }[];
  tripsByStatus: { status: string; count: number }[];
  popularCities: { city: string; visits: number }[];
  activityCategories: { category: string; count: number }[];
  revenueByMonth: { month: string; amount: number }[];
}
```

---

## 🎨 Shared Components to Create

### Button Component
```tsx
// src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}
```

### Input Component
```tsx
// src/components/ui/Input.tsx
interface InputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // ...extends HTMLInputElement props
}
```

### Card Component
```tsx
// src/components/ui/Card.tsx
interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}
```

### Modal Component
```tsx
// src/components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}
```

---

## 📝 Checklist Before Committing

- [ ] Component renders without errors
- [ ] All TypeScript types are correct
- [ ] Mobile responsive design works
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Accessibility (aria labels, focus states)
- [ ] Design matches mockup
- [ ] `npm run build` passes
- [ ] No console errors/warnings
- [ ] Tested navigation flow

---

## 🔗 Useful Links

- [Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1)
- [Lucide Icons](https://lucide.dev/icons/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Recharts Docs](https://recharts.org/)

---

*Assigned to: Member A*
*Last Updated: January 3, 2026*
