# 🟡 Member C - Discovery & Social Requirements

> **Focus**: City Search, Activity Search, Budget Breakdown, Public Itinerary, Community

---

## 📋 Your Assigned Screens

| # | Screen | Priority | Status |
|---|--------|----------|--------|
| 1 | City Search | HIGH | Pending |
| 2 | Activity Search | HIGH | Pending |
| 3 | Budget Breakdown | HIGH | Pending |
| 4 | Public Itinerary | MEDIUM | Pending |
| 5 | Community Tab | MEDIUM | Pending |

---

## 🏙️ Screen 1: City Search

### File: `src/pages/CitySearch.tsx`

### Description
Search interface to find and explore cities with detailed information, cost index, and popularity.

### Mockup Reference (Screen 8)
- Search bar with filters at top
- Results list showing options with details
- Each result is clickable/selectable

### Component Requirements

```tsx
interface CitySearchProps {
  onCitySelect?: (city: City) => void;
  mode?: 'browse' | 'select'; // select mode for adding to trip
}
```

### UI Sections

#### 1. Search Header
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-display font-bold glow-text">
    Explore Cities
  </h1>
  <p className="text-white/50 mt-2">
    Discover your next destination
  </p>
</div>
```

#### 2. Search and Filters Bar
```tsx
<div className="flex flex-col md:flex-row gap-4 mb-8">
  {/* Main search */}
  <div className="relative flex-1">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
    <input
      className="input-field pl-12"
      placeholder="Search cities... (e.g., Paris, Tokyo)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  
  {/* Filters row */}
  <div className="flex gap-2 flex-wrap">
    {/* Group By */}
    <select className="input-field w-auto" value={groupBy} onChange={...}>
      <option value="">Group by</option>
      <option value="continent">Continent</option>
      <option value="country">Country</option>
      <option value="cost">Cost Level</option>
    </select>
    
    {/* Filter */}
    <button 
      className="btn-secondary flex items-center gap-2"
      onClick={() => setShowFilters(!showFilters)}
    >
      <Filter className="w-4 h-4" />
      Filter
      {activeFiltersCount > 0 && (
        <span className="w-5 h-5 bg-globe-500 rounded-full text-xs flex items-center justify-center">
          {activeFiltersCount}
        </span>
      )}
    </button>
    
    {/* Sort */}
    <select className="input-field w-auto" value={sortBy} onChange={...}>
      <option value="popularity">Sort by Popularity</option>
      <option value="name">Sort by Name</option>
      <option value="cost-low">Cost: Low to High</option>
      <option value="cost-high">Cost: High to Low</option>
    </select>
  </div>
</div>
```

#### 3. Filter Panel (Expandable)
```tsx
{showFilters && (
  <div className="card mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
    {/* Continent filter */}
    <div>
      <label className="input-label">Continent</label>
      <select className="input-field" value={filters.continent} onChange={...}>
        <option value="">All Continents</option>
        <option value="europe">Europe</option>
        <option value="asia">Asia</option>
        <option value="north-america">North America</option>
        <option value="south-america">South America</option>
        <option value="africa">Africa</option>
        <option value="oceania">Oceania</option>
      </select>
    </div>
    
    {/* Cost Index */}
    <div>
      <label className="input-label">Budget Level</label>
      <select className="input-field" value={filters.costIndex} onChange={...}>
        <option value="">Any Budget</option>
        <option value="1">$ - Budget</option>
        <option value="2">$$ - Affordable</option>
        <option value="3">$$$ - Moderate</option>
        <option value="4">$$$$ - Expensive</option>
        <option value="5">$$$$$ - Luxury</option>
      </select>
    </div>
    
    {/* Country */}
    <div>
      <label className="input-label">Country</label>
      <input 
        className="input-field" 
        placeholder="Filter by country"
        value={filters.country}
        onChange={...}
      />
    </div>
    
    {/* Clear filters */}
    <div className="flex items-end">
      <button className="btn-secondary w-full" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  </div>
)}
```

#### 4. Results List
```tsx
<div className="space-y-3">
  {/* Results count */}
  <p className="text-white/50 text-sm mb-4">
    {filteredCities.length} cities found
  </p>
  
  {filteredCities.map(city => (
    <CityResultCard 
      key={city.id} 
      city={city} 
      onSelect={() => handleCitySelect(city)}
      isSelectable={mode === 'select'}
    />
  ))}
  
  {/* Empty state */}
  {filteredCities.length === 0 && (
    <div className="card text-center py-12">
      <Globe className="w-12 h-12 mx-auto text-white/20 mb-4" />
      <p className="text-white/50">No cities found matching your criteria</p>
      <button className="btn-secondary mt-4" onClick={clearFilters}>
        Clear Filters
      </button>
    </div>
  )}
  
  {/* Load more */}
  {hasMore && (
    <button 
      className="btn-secondary w-full"
      onClick={loadMore}
      disabled={isLoading}
    >
      {isLoading ? 'Loading...' : 'Load More Cities'}
    </button>
  )}
</div>
```

### Sub-Components

#### CityResultCard
```tsx
interface CityResultCardProps {
  city: City;
  onSelect: () => void;
  isSelectable?: boolean;
}

const CityResultCard: React.FC<CityResultCardProps> = ({ city, onSelect, isSelectable }) => (
  <div 
    className={`card flex gap-4 items-center transition-all
      ${isSelectable ? 'cursor-pointer hover:border-globe-500/50' : ''}`}
    onClick={isSelectable ? onSelect : undefined}
  >
    {/* City image */}
    <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
      {city.imageUrl ? (
        <img src={city.imageUrl} className="w-full h-full object-cover" alt={city.name} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <MapPin className="w-6 h-6 text-white/20" />
        </div>
      )}
    </div>
    
    {/* City info */}
    <div className="flex-1 min-w-0">
      <h3 className="font-semibold text-lg">{city.name}</h3>
      <p className="text-white/50">{city.country}, {city.continent}</p>
      
      <div className="flex gap-4 mt-2 text-sm">
        {/* Cost index */}
        <span className="text-white/40">
          {'$'.repeat(city.costIndex)}
          <span className="text-white/20">{'$'.repeat(5 - city.costIndex)}</span>
        </span>
        
        {/* Popularity */}
        <span className="text-white/40 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {city.popularity.toLocaleString()} visits
        </span>
      </div>
    </div>
    
    {/* Action */}
    <div>
      {isSelectable ? (
        <button className="btn-primary">
          <Plus className="w-4 h-4" /> Add
        </button>
      ) : (
        <button className="btn-secondary" onClick={onSelect}>
          View Details
        </button>
      )}
    </div>
  </div>
);
```

### API Calls
```typescript
// Search cities
GET /api/cities?search={query}&continent={continent}&country={country}&costIndex={costIndex}&sortBy={sortBy}&page={page}&limit=20

// Get popular cities
GET /api/cities/popular?limit=10

// Get city details
GET /api/cities/:id
```

---

## 🎯 Screen 2: Activity Search

### File: `src/pages/ActivitySearch.tsx`

### Description
Browse and search activities that can be added to trip stops. Filter by category, cost, duration.

### Mockup Reference (Screen 8 - similar layout)
- Search bar at top
- Results list with activity details
- Filter options

### Component Requirements

```tsx
interface ActivitySearchProps {
  stopId?: string; // If provided, activities can be added to this stop
  cityId?: string; // Filter by city
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}
```

### UI Sections

#### 1. Search Header
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-display font-bold glow-text">
    Discover Activities
  </h1>
  <p className="text-white/50 mt-2">
    {cityName ? `Things to do in ${cityName}` : 'Find your next adventure'}
  </p>
</div>
```

#### 2. Category Tabs
```tsx
const categories = [
  { id: 'all', label: 'All', icon: <Grid /> },
  { id: 'sightseeing', label: 'Sightseeing', icon: <Camera /> },
  { id: 'food', label: 'Food & Dining', icon: <Utensils /> },
  { id: 'adventure', label: 'Adventure', icon: <Mountain /> },
  { id: 'entertainment', label: 'Entertainment', icon: <Music /> },
  { id: 'shopping', label: 'Shopping', icon: <ShoppingBag /> },
  { id: 'transport', label: 'Transport', icon: <Car /> },
];

<div className="flex gap-2 overflow-x-auto pb-2 mb-6">
  {categories.map(cat => (
    <button
      key={cat.id}
      onClick={() => setSelectedCategory(cat.id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all
        ${selectedCategory === cat.id 
          ? 'bg-globe-500 text-white' 
          : 'bg-white/5 hover:bg-white/10'}`}
    >
      {cat.icon}
      {cat.label}
    </button>
  ))}
</div>
```

#### 3. Search and Filters
```tsx
<div className="flex flex-col md:flex-row gap-4 mb-6">
  <div className="relative flex-1">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
    <input
      className="input-field pl-12"
      placeholder="Search activities..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  
  {/* Price range */}
  <select className="input-field w-auto" value={priceRange} onChange={...}>
    <option value="">Any Price</option>
    <option value="free">Free</option>
    <option value="0-25">Under $25</option>
    <option value="25-50">$25 - $50</option>
    <option value="50-100">$50 - $100</option>
    <option value="100+">$100+</option>
  </select>
  
  {/* Duration */}
  <select className="input-field w-auto" value={duration} onChange={...}>
    <option value="">Any Duration</option>
    <option value="0-60">Under 1 hour</option>
    <option value="60-180">1-3 hours</option>
    <option value="180-360">3-6 hours</option>
    <option value="360+">Full day</option>
  </select>
  
  {/* Sort */}
  <select className="input-field w-auto" value={sortBy} onChange={...}>
    <option value="popular">Most Popular</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
    <option value="rating">Highest Rated</option>
  </select>
</div>
```

#### 4. Activities Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {filteredActivities.map(activity => (
    <ActivityCard
      key={activity.id}
      activity={activity}
      onAdd={stopId ? () => addActivityToStop(activity) : undefined}
      onView={() => openActivityModal(activity)}
    />
  ))}
</div>
```

### Sub-Components

#### ActivityCard
```tsx
interface ActivityCardProps {
  activity: ActivityTemplate;
  onAdd?: () => void;
  onView: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onAdd, onView }) => (
  <div className="card overflow-hidden group">
    {/* Image */}
    <div className="aspect-video bg-white/5 relative overflow-hidden">
      {activity.imageUrl ? (
        <img 
          src={activity.imageUrl} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          alt={activity.name}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Activity className="w-8 h-8 text-white/20" />
        </div>
      )}
      
      {/* Category badge */}
      <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium
        ${getCategoryStyles(activity.category)}`}>
        {activity.category}
      </span>
      
      {/* Rating */}
      {activity.rating && (
        <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs">{activity.rating}</span>
        </div>
      )}
    </div>
    
    {/* Content */}
    <div className="p-4">
      <h3 className="font-semibold truncate">{activity.name}</h3>
      
      {activity.description && (
        <p className="text-white/50 text-sm mt-1 line-clamp-2">{activity.description}</p>
      )}
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-sm text-white/50">
          {/* Price */}
          <span className="text-globe-400 font-semibold">
            {activity.averageCost === 0 ? 'Free' : `$${activity.averageCost}`}
          </span>
          
          {/* Duration */}
          {activity.durationMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDuration(activity.durationMinutes)}
            </span>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          {onAdd && (
            <button 
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="btn-primary py-1 px-3 text-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onView}
            className="btn-secondary py-1 px-3 text-sm"
          >
            View
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Helper function for category styles
function getCategoryStyles(category: string): string {
  const styles: Record<string, string> = {
    sightseeing: 'bg-blue-500/80 text-white',
    food: 'bg-orange-500/80 text-white',
    adventure: 'bg-green-500/80 text-white',
    entertainment: 'bg-purple-500/80 text-white',
    shopping: 'bg-pink-500/80 text-white',
    transport: 'bg-gray-500/80 text-white',
    accommodation: 'bg-indigo-500/80 text-white',
    other: 'bg-white/20 text-white',
  };
  return styles[category] || styles.other;
}
```

### API Calls
```typescript
// Search activities (templates)
GET /api/cities/:cityId/activities?search={query}&category={category}&priceMin={min}&priceMax={max}&sortBy={sortBy}

// Add activity to stop
POST /api/stops/:stopId/activities
Body: {
  name: string;
  description?: string;
  category: string;
  cost: number;
  date: string;
  startTime?: string;
  endTime?: string;
}
```

---

## 💰 Screen 3: Budget Breakdown

### File: `src/pages/BudgetBreakdown.tsx`

### Description
Comprehensive financial overview with cost breakdowns, charts, and budget alerts.

### Mockup Reference (Screen 9 - expense column, Screen 12 - charts)
- Cost breakdown by category
- Pie charts, bar charts
- Per-day average
- Budget warnings

### Component Requirements

```tsx
interface BudgetBreakdownProps {
  trips: Trip[];
  stops: Stop[];
  activities: Activity[];
}
```

### UI Sections

#### 1. Budget Header
```tsx
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
  <div>
    <h1 className="text-3xl font-display font-bold">Budget Breakdown</h1>
    <p className="text-white/50">{trip.name}</p>
  </div>
  
  {/* Budget vs Actual */}
  <div className="card flex items-center gap-6 p-4">
    <div className="text-center">
      <p className="text-white/50 text-sm">Budget</p>
      <p className="text-2xl font-bold">${trip.totalBudget || 0}</p>
    </div>
    <div className="h-12 w-px bg-white/10" />
    <div className="text-center">
      <p className="text-white/50 text-sm">Spent</p>
      <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-globe-400'}`}>
        ${totalSpent}
      </p>
    </div>
    <div className="h-12 w-px bg-white/10" />
    <div className="text-center">
      <p className="text-white/50 text-sm">Remaining</p>
      <p className={`text-2xl font-bold ${isOverBudget ? 'text-red-400' : 'text-white'}`}>
        ${remaining}
      </p>
    </div>
  </div>
</div>
```

#### 2. Budget Progress Bar
```tsx
<div className="card mb-8">
  <div className="flex justify-between mb-2">
    <span className="text-white/50">Budget Usage</span>
    <span className={budgetPercentage > 100 ? 'text-red-400' : 'text-white'}>
      {budgetPercentage.toFixed(0)}%
    </span>
  </div>
  <div className="h-4 bg-white/10 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full transition-all ${
        budgetPercentage > 100 ? 'bg-red-500' : 
        budgetPercentage > 80 ? 'bg-yellow-500' : 'bg-globe-500'
      }`}
      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
    />
  </div>
  
  {budgetPercentage > 80 && (
    <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
      budgetPercentage > 100 ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
    }`}>
      <AlertTriangle className="w-5 h-5" />
      {budgetPercentage > 100 
        ? `You're over budget by $${Math.abs(remaining)}`
        : 'You\'re approaching your budget limit'
      }
    </div>
  )}
</div>
```

#### 3. Category Breakdown
```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
  {/* Pie Chart */}
  <div className="card">
    <h3 className="font-semibold mb-4">Spending by Category</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
          >
            {categoryData.map((entry, index) => (
              <Cell key={index} fill={CATEGORY_COLORS[entry.category]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
  
  {/* Category List */}
  <div className="card">
    <h3 className="font-semibold mb-4">Category Details</h3>
    <div className="space-y-3">
      {categoryData.map(cat => (
        <div key={cat.category} className="flex items-center gap-3">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: CATEGORY_COLORS[cat.category] }}
          />
          <span className="flex-1 capitalize">{cat.category}</span>
          <span className="font-semibold">${cat.amount}</span>
          <span className="text-white/50 text-sm w-12 text-right">
            {((cat.amount / totalSpent) * 100).toFixed(0)}%
          </span>
        </div>
      ))}
    </div>
  </div>
</div>
```

#### 4. Daily Spending Chart
```tsx
<div className="card mb-8">
  <h3 className="font-semibold mb-4">Daily Spending</h3>
  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dailyData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="date" stroke="#666" />
        <YAxis stroke="#666" />
        <Tooltip 
          contentStyle={{ background: '#111', border: '1px solid #333' }}
          cursor={{ fill: 'rgba(34, 197, 94, 0.1)' }}
        />
        <Bar dataKey="amount" fill="#22c55e" radius={[4, 4, 0, 0]} />
        {/* Budget line */}
        <ReferenceLine 
          y={dailyBudget} 
          stroke="#ef4444" 
          strokeDasharray="5 5"
          label={{ value: 'Daily Budget', fill: '#ef4444' }}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
  
  <div className="flex justify-between mt-4 text-sm text-white/50">
    <span>Average: ${averageDaily}/day</span>
    <span>Daily budget: ${dailyBudget}/day</span>
  </div>
</div>
```

#### 5. Expenses Table
```tsx
<div className="card">
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-semibold">All Expenses</h3>
    <button className="btn-secondary text-sm">
      <Download className="w-4 h-4" /> Export CSV
    </button>
  </div>
  
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="text-left text-white/50 border-b border-white/10">
          <th className="pb-3">Date</th>
          <th className="pb-3">Activity</th>
          <th className="pb-3">Category</th>
          <th className="pb-3">Location</th>
          <th className="pb-3 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(expense => (
          <tr key={expense.id} className="border-b border-white/5">
            <td className="py-3">{formatDate(expense.date)}</td>
            <td className="py-3">{expense.name}</td>
            <td className="py-3">
              <span className={`px-2 py-1 rounded-full text-xs ${getCategoryStyles(expense.category)}`}>
                {expense.category}
              </span>
            </td>
            <td className="py-3 text-white/50">{expense.location || '-'}</td>
            <td className="py-3 text-right font-medium">${expense.cost}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-white/20">
          <td colSpan={4} className="py-3 font-semibold">Total</td>
          <td className="py-3 text-right font-bold text-globe-400">${totalSpent}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</div>
```

### Chart Constants
```typescript
const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: '#3b82f6',
  food: '#f97316',
  adventure: '#22c55e',
  entertainment: '#a855f7',
  shopping: '#ec4899',
  transport: '#6b7280',
  accommodation: '#6366f1',
  other: '#78716c',
};
```

### Utility Functions
```typescript
// Calculate spending by category
function calculateCategoryBreakdown(activities: Activity[]): CategoryData[] {
  const breakdown: Record<string, number> = {};
  
  activities.forEach(activity => {
    breakdown[activity.category] = (breakdown[activity.category] || 0) + activity.cost;
  });
  
  return Object.entries(breakdown).map(([category, amount]) => ({
    category,
    amount,
  }));
}

// Calculate daily spending
function calculateDailySpending(activities: Activity[], startDate: string, endDate: string): DailyData[] {
  // ... implementation
}
```

---

## 🔗 Screen 4: Public Itinerary

### File: `src/pages/PublicItinerary.tsx`

### Description
Shareable, read-only view of a trip itinerary for non-logged-in users.

### Mockup Reference (Screen 10 - Community style)
- Clean, minimal design
- Itinerary summary
- Copy/share options

### Component Requirements

```tsx
interface PublicItineraryProps {
  trips: Trip[];
  stops: Stop[];
  activities: Activity[];
}
```

### UI Sections

#### 1. Public Header
```tsx
<div className="text-center mb-12">
  <p className="text-globe-400 text-sm font-medium mb-2">SHARED ITINERARY</p>
  <h1 className="text-4xl font-display font-bold glow-text mb-4">
    {trip.name}
  </h1>
  <p className="text-white/50">
    {formatDate(trip.startDate)} - {formatDate(trip.endDate)} • {stops.length} stops
  </p>
  
  {/* Author */}
  <div className="flex items-center justify-center gap-3 mt-6">
    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
      <User className="w-5 h-5 text-white/50" />
    </div>
    <span className="text-white/70">Created by {trip.authorName || 'A GlobeTrotter'}</span>
  </div>
</div>
```

#### 2. Action Buttons
```tsx
<div className="flex justify-center gap-4 mb-8">
  <button 
    className="btn-primary"
    onClick={copyItinerary}
  >
    <Copy className="w-4 h-4" /> Copy This Trip
  </button>
  <button 
    className="btn-secondary"
    onClick={() => setShowShareModal(true)}
  >
    <Share2 className="w-4 h-4" /> Share
  </button>
</div>
```

#### 3. Itinerary Timeline (Simplified)
```tsx
<div className="max-w-3xl mx-auto">
  {stops.map((stop, index) => (
    <div key={stop.id} className="relative">
      {/* Connection line */}
      {index < stops.length - 1 && (
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-white/10" />
      )}
      
      {/* Stop card */}
      <div className="flex gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-globe-500/20 border border-globe-500/50 flex items-center justify-center flex-shrink-0">
          <MapPin className="w-5 h-5 text-globe-400" />
        </div>
        
        <div className="flex-1 card">
          <h3 className="text-xl font-semibold">{stop.cityName}, {stop.country}</h3>
          <p className="text-white/50 text-sm">
            {formatDate(stop.startDate)} - {formatDate(stop.endDate)}
          </p>
          
          {/* Activities preview */}
          <div className="mt-4 space-y-2">
            {getStopActivities(stop.id).slice(0, 3).map(activity => (
              <div key={activity.id} className="flex items-center gap-2 text-sm text-white/70">
                <span className={`w-2 h-2 rounded-full ${getCategoryColor(activity.category)}`} />
                <span>{activity.name}</span>
              </div>
            ))}
            {getStopActivities(stop.id).length > 3 && (
              <p className="text-white/40 text-sm">
                +{getStopActivities(stop.id).length - 3} more activities
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

#### 4. Share Modal
```tsx
{showShareModal && (
  <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Itinerary">
    <div className="space-y-4">
      {/* Copy link */}
      <div>
        <label className="input-label">Share Link</label>
        <div className="flex gap-2">
          <input 
            className="input-field flex-1" 
            value={shareUrl} 
            readOnly 
          />
          <button 
            className="btn-primary"
            onClick={copyLink}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {/* Social share */}
      <div>
        <label className="input-label">Share on Social</label>
        <div className="flex gap-2">
          <button className="btn-secondary flex-1" onClick={shareTwitter}>
            Twitter
          </button>
          <button className="btn-secondary flex-1" onClick={shareFacebook}>
            Facebook
          </button>
          <button className="btn-secondary flex-1" onClick={shareWhatsApp}>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  </Modal>
)}
```

---

## 👥 Screen 5: Community Tab

### File: `src/pages/Community.tsx`

### Description
Social feed where users share trip experiences and interact with others.

### Mockup Reference (Screen 10)
- Post feed with user avatars
- Search, filter, sort options
- Card-based layout

### Component Requirements

```tsx
interface CommunityProps {
  currentUser: User | null;
}
```

### UI Sections

#### 1. Community Header
```tsx
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
  <div>
    <h1 className="text-3xl font-display font-bold">Community</h1>
    <p className="text-white/50">Share your adventures and get inspired</p>
  </div>
  
  {currentUser && (
    <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
      <Plus className="w-5 h-5" /> Share Your Trip
    </button>
  )}
</div>
```

#### 2. Search and Filters
```tsx
<div className="flex flex-wrap gap-3 mb-8">
  <div className="relative flex-1 min-w-[200px]">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
    <input
      className="input-field pl-12"
      placeholder="Search posts..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  
  <select className="input-field w-auto">
    <option>Group by</option>
    <option value="destination">Destination</option>
    <option value="author">Author</option>
  </select>
  
  <select className="input-field w-auto">
    <option>Filter</option>
    <option value="following">Following</option>
    <option value="popular">Popular</option>
  </select>
  
  <select className="input-field w-auto">
    <option value="recent">Sort by: Recent</option>
    <option value="popular">Most Liked</option>
    <option value="comments">Most Comments</option>
  </select>
</div>
```

#### 3. Post Feed
```tsx
<div className="space-y-6">
  {posts.map(post => (
    <PostCard 
      key={post.id} 
      post={post}
      onLike={() => handleLike(post.id)}
      onComment={() => openComments(post.id)}
      onShare={() => handleShare(post.id)}
    />
  ))}
  
  {/* Load more */}
  {hasMore && (
    <button className="btn-secondary w-full" onClick={loadMore}>
      Load More Posts
    </button>
  )}
</div>
```

### Sub-Components

#### PostCard
```tsx
interface PostCardProps {
  post: CommunityPost;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare }) => (
  <div className="card">
    {/* Author header */}
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10">
        {post.author.photoUrl ? (
          <img src={post.author.photoUrl} className="w-full h-full object-cover" alt="" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <User className="w-6 h-6 text-white/30" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{post.author.firstName} {post.author.lastName}</p>
        <p className="text-white/50 text-sm">{formatRelativeTime(post.createdAt)}</p>
      </div>
      <button className="text-white/30 hover:text-white">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
    
    {/* Content */}
    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
    <p className="text-white/70 mb-4">{post.content}</p>
    
    {/* Image */}
    {post.imageUrl && (
      <div className="rounded-xl overflow-hidden mb-4 aspect-video">
        <img src={post.imageUrl} className="w-full h-full object-cover" alt="" />
      </div>
    )}
    
    {/* Trip reference */}
    {post.trip && (
      <Link 
        to={`/share/${post.trip.id}`}
        className="bg-white/5 rounded-lg p-3 mb-4 flex items-center gap-3 hover:bg-white/10 transition-colors"
      >
        <MapPin className="w-5 h-5 text-globe-400" />
        <div>
          <p className="font-medium">{post.trip.name}</p>
          <p className="text-white/50 text-sm">
            {formatDate(post.trip.startDate)} - {formatDate(post.trip.endDate)}
          </p>
        </div>
      </Link>
    )}
    
    {/* Actions */}
    <div className="flex items-center gap-6 pt-4 border-t border-white/10">
      <button 
        className={`flex items-center gap-2 transition-colors ${
          post.isLiked ? 'text-red-400' : 'text-white/50 hover:text-white'
        }`}
        onClick={onLike}
      >
        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
        <span>{post.likesCount}</span>
      </button>
      
      <button 
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        onClick={onComment}
      >
        <MessageCircle className="w-5 h-5" />
        <span>{post.commentsCount}</span>
      </button>
      
      <button 
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        onClick={onShare}
      >
        <Share2 className="w-5 h-5" />
        <span>Share</span>
      </button>
    </div>
  </div>
);
```

### API Calls
```typescript
// Get community posts
GET /api/community/posts?page={page}&limit=10&sortBy={sortBy}

// Create post
POST /api/community/posts
Body: { title, content, tripId?, imageUrl? }

// Like post
POST /api/community/posts/:id/like

// Unlike post
DELETE /api/community/posts/:id/like

// Get comments
GET /api/community/posts/:id/comments

// Add comment
POST /api/community/posts/:id/comments
Body: { content }
```

---

## 📦 Dependencies to Install

```bash
npm install recharts date-fns
```

- **recharts**: For pie charts, bar charts, line charts
- **date-fns**: For date formatting and manipulation

---

## 📝 Checklist Before Committing

- [ ] Component renders without errors
- [ ] All TypeScript types are correct
- [ ] Charts render correctly with data
- [ ] Filters work properly
- [ ] Loading states implemented
- [ ] Empty states handled
- [ ] Mobile responsive design
- [ ] `npm run build` passes

---

## 🔗 Useful Links

- [Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1)
- [Recharts Documentation](https://recharts.org/)
- [date-fns Documentation](https://date-fns.org/)

---

*Assigned to: Member C*
*Last Updated: January 3, 2026*
