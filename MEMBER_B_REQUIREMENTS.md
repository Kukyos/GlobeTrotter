# 🟢 Member B - Trip Management Requirements

> **Focus**: Create Trip, My Trips, Itinerary Builder, Itinerary View, Calendar

---

## 📋 Your Assigned Screens

| # | Screen | Priority | Status |
|---|--------|----------|--------|
| 1 | Create Trip | HIGH | Done |
| 2 | My Trips (List) | HIGH | Done |
| 3 | Itinerary Builder | HIGH | Done |
| 4 | Itinerary View | MEDIUM | Done |
| 5 | Calendar/Timeline | MEDIUM | Pending |

---

## ✈️ Screen 1: Create Trip

### File: `src/pages/CreateTrip.tsx`

### Description
Form to initiate a new trip with destination, dates, and get AI-powered suggestions.

### Mockup Reference (Screen 4)
- "Plan a new trip" header
- Start Date, Select a Place, Start Date, End Date fields
- "Suggestions for Places to Visit/Activities" section
- Grid of suggestion cards

### Component Requirements

```tsx
interface CreateTripProps {
  userId: string;
  onTripCreated?: (trip: Trip) => void;
}
```

### UI Sections

#### 1. Page Header
```tsx
<div className="mb-8">
  <h1 className="text-3xl font-display font-bold glow-text">
    Plan a New Trip
  </h1>
  <p className="text-white/50 mt-2">
    Start your adventure by setting up the basics
  </p>
</div>
```

#### 2. Trip Form
```tsx
<form className="card space-y-6">
  {/* Trip Name */}
  <div>
    <label className="input-label">Trip Name</label>
    <input 
      className="input-field"
      placeholder="My Paris Adventure"
      value={tripName}
      onChange={(e) => setTripName(e.target.value)}
    />
  </div>

  {/* Destination Search */}
  <div>
    <label className="input-label">Select a Place</label>
    <div className="relative">
      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
      <input 
        className="input-field pl-12"
        placeholder="Search cities..."
        value={destination}
        onChange={(e) => handleDestinationSearch(e.target.value)}
      />
      {/* Dropdown suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-white/10 rounded-xl overflow-hidden z-10">
          {citySuggestions.map(city => (
            <button
              key={city.id}
              className="w-full px-4 py-3 text-left hover:bg-white/10 flex items-center gap-3"
              onClick={() => selectCity(city)}
            >
              <span>{city.name}, {city.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>

  {/* Date Range */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="input-label">Start Date</label>
      <input 
        type="date"
        className="input-field"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>
    <div>
      <label className="input-label">End Date</label>
      <input 
        type="date"
        className="input-field"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={startDate}
      />
    </div>
  </div>

  {/* Description */}
  <div>
    <label className="input-label">Description (Optional)</label>
    <textarea 
      className="input-field"
      rows={3}
      placeholder="What's this trip about?"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  </div>

  {/* Budget */}
  <div>
    <label className="input-label">Estimated Budget</label>
    <div className="relative">
      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
      <input 
        type="number"
        className="input-field pl-12"
        placeholder="5000"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
      />
    </div>
  </div>
</form>
```

#### 3. AI Suggestions Section
```tsx
<section className="mt-8">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-display font-semibold">
      Suggestions for Places to Visit / Activities
    </h2>
    <button 
      className="btn-secondary text-sm"
      onClick={refreshSuggestions}
    >
      <RefreshCw className="w-4 h-4" /> Refresh
    </button>
  </div>
  
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {suggestions.map(suggestion => (
      <SuggestionCard 
        key={suggestion.id}
        suggestion={suggestion}
        onAdd={() => addToItinerary(suggestion)}
      />
    ))}
  </div>
</section>
```

#### 4. Submit Section
```tsx
<div className="flex gap-4 mt-8">
  <button 
    type="button"
    className="btn-secondary"
    onClick={() => navigate(-1)}
  >
    Cancel
  </button>
  <button 
    type="submit"
    className="btn-primary flex-1"
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Creating...' : 'Create Trip'}
  </button>
</div>
```

### Sub-Components

#### SuggestionCard
```tsx
interface SuggestionCardProps {
  suggestion: {
    id: string;
    name: string;
    type: 'place' | 'activity';
    imageUrl?: string;
    description?: string;
  };
  onAdd: () => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onAdd }) => (
  <div className="card overflow-hidden group cursor-pointer" onClick={onAdd}>
    <div className="aspect-square bg-white/5 relative">
      {suggestion.imageUrl ? (
        <img src={suggestion.imageUrl} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-white/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <Plus className="w-8 h-8 text-white" />
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-medium truncate">{suggestion.name}</h3>
      <p className="text-white/50 text-sm">{suggestion.type}</p>
    </div>
  </div>
);
```

### State Management
```typescript
const [tripName, setTripName] = useState('');
const [destination, setDestination] = useState('');
const [selectedCity, setSelectedCity] = useState<City | null>(null);
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [description, setDescription] = useState('');
const [budget, setBudget] = useState('');
const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
const [isSubmitting, setIsSubmitting] = useState(false);
```

### API Calls
```typescript
// Search cities (debounced)
GET /api/cities?search={query}&limit=5

// Get activity suggestions for a city
GET /api/cities/:cityId/activities?limit=6

// Create new trip
POST /api/trips
Body: {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  totalBudget?: number;
}
```

---

## 📋 Screen 2: My Trips (List)

### File: `src/pages/MyTrips.tsx`

### Description
List view of all user's trips organized by status with search, filter, and sort options.

### Mockup Reference (Screen 6)
- Search bar with Group by, Filter, Sort buttons
- Sections: Ongoing, Upcoming, Completed
- Trip cards with overview

### Component Requirements

```tsx
interface MyTripsProps {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
}
```

### UI Sections

#### 1. Header with Actions
```tsx
<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
  <div>
    <h1 className="text-3xl font-display font-bold">My Trips</h1>
    <p className="text-white/50">{trips.length} trips total</p>
  </div>
  
  <Link to="/create-trip" className="btn-primary">
    <Plus className="w-5 h-5" /> New Trip
  </Link>
</div>
```

#### 2. Search and Filters Bar
```tsx
<div className="flex flex-wrap gap-3 mb-8">
  {/* Search */}
  <div className="relative flex-1 min-w-[200px]">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
    <input
      className="input-field pl-12"
      placeholder="Search trips..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
  
  {/* Group By */}
  <select 
    className="input-field w-auto"
    value={groupBy}
    onChange={(e) => setGroupBy(e.target.value)}
  >
    <option value="status">Group by Status</option>
    <option value="date">Group by Date</option>
    <option value="destination">Group by Destination</option>
  </select>
  
  {/* Filter */}
  <select
    className="input-field w-auto"
    value={filter}
    onChange={(e) => setFilter(e.target.value)}
  >
    <option value="all">All Trips</option>
    <option value="ongoing">Ongoing</option>
    <option value="upcoming">Upcoming</option>
    <option value="completed">Completed</option>
    <option value="draft">Drafts</option>
  </select>
  
  {/* Sort */}
  <select
    className="input-field w-auto"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="date-desc">Newest First</option>
    <option value="date-asc">Oldest First</option>
    <option value="name-asc">Name A-Z</option>
    <option value="name-desc">Name Z-A</option>
  </select>
</div>
```

#### 3. Trip Sections by Status
```tsx
{/* Ongoing Section */}
{ongoingTrips.length > 0 && (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      Ongoing
    </h2>
    <div className="space-y-4">
      {ongoingTrips.map(trip => (
        <TripListCard key={trip.id} trip={trip} onEdit={...} onDelete={...} />
      ))}
    </div>
  </section>
)}

{/* Upcoming Section */}
{upcomingTrips.length > 0 && (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <Calendar className="w-4 h-4 text-blue-400" />
      Upcoming
    </h2>
    <div className="space-y-4">
      {upcomingTrips.map(trip => (
        <TripListCard key={trip.id} trip={trip} onEdit={...} onDelete={...} />
      ))}
    </div>
  </section>
)}

{/* Completed Section */}
{completedTrips.length > 0 && (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
      <CheckCircle className="w-4 h-4 text-white/50" />
      Completed
    </h2>
    <div className="space-y-4">
      {completedTrips.map(trip => (
        <TripListCard key={trip.id} trip={trip} onEdit={...} onDelete={...} />
      ))}
    </div>
  </section>
)}
```

### Sub-Components

#### TripListCard
```tsx
interface TripListCardProps {
  trip: Trip;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TripListCard: React.FC<TripListCardProps> = ({ trip, onView, onEdit, onDelete }) => (
  <div className="card flex flex-col md:flex-row md:items-center gap-4 hover:border-white/20 transition-all">
    {/* Cover image */}
    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
      {trip.coverPhoto ? (
        <img src={trip.coverPhoto} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Plane className="w-8 h-8 text-white/20" />
        </div>
      )}
    </div>
    
    {/* Trip info */}
    <div className="flex-1">
      <h3 className="text-xl font-semibold">{trip.name}</h3>
      <p className="text-white/50 text-sm mt-1">
        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
      </p>
      {trip.description && (
        <p className="text-white/40 text-sm mt-2 line-clamp-2">{trip.description}</p>
      )}
      
      {/* Stats */}
      <div className="flex gap-4 mt-3 text-sm text-white/50">
        <span>{calculateDays(trip.startDate, trip.endDate)} days</span>
        <span>{trip.stops?.length || 0} stops</span>
        {trip.totalBudget && <span>${trip.totalBudget}</span>}
      </div>
    </div>
    
    {/* Actions */}
    <div className="flex md:flex-col gap-2">
      <button onClick={onView} className="btn-primary py-2">
        View
      </button>
      <button onClick={onEdit} className="btn-secondary py-2">
        Edit
      </button>
      <button onClick={onDelete} className="btn-secondary py-2 text-red-400">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);
```

### API Calls
```typescript
GET /api/trips                    // Get all user trips
DELETE /api/trips/:id             // Delete a trip
PUT /api/trips/:id                // Update trip
```

---

## 🏗️ Screen 3: Itinerary Builder

### File: `src/pages/ItineraryBuilder.tsx`

### Description
Interactive interface to add cities, dates, and activities for each stop in a trip.

### Mockup Reference (Screen 5)
- Multiple sections (Section 1, 2, 3...)
- Each section has info, date range, budget
- "+ Add another Section" button

### Component Requirements

```tsx
interface ItineraryBuilderProps {
  trips: Trip[];
  stops: Stop[];
  setStops: React.Dispatch<React.SetStateAction<Stop[]>>;
}
```

### UI Sections

#### 1. Trip Header
```tsx
<div className="flex items-center justify-between mb-8">
  <div>
    <Link to="/my-trips" className="text-white/50 hover:text-white text-sm flex items-center gap-1 mb-2">
      <ArrowLeft className="w-4 h-4" /> Back to My Trips
    </Link>
    <h1 className="text-3xl font-display font-bold">{trip.name}</h1>
    <p className="text-white/50">
      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
    </p>
  </div>
  
  <div className="flex gap-2">
    <button className="btn-secondary">
      <Eye className="w-4 h-4" /> Preview
    </button>
    <button className="btn-primary">
      <Save className="w-4 h-4" /> Save
    </button>
  </div>
</div>
```

#### 2. Sections/Stops List
```tsx
<div className="space-y-6">
  {stops.map((stop, index) => (
    <StopSection
      key={stop.id}
      stop={stop}
      index={index}
      onUpdate={(updated) => updateStop(stop.id, updated)}
      onDelete={() => deleteStop(stop.id)}
      onMoveUp={() => moveStop(index, index - 1)}
      onMoveDown={() => moveStop(index, index + 1)}
      isFirst={index === 0}
      isLast={index === stops.length - 1}
    />
  ))}
</div>
```

#### 3. Stop Section Component
```tsx
interface StopSectionProps {
  stop: Stop;
  index: number;
  onUpdate: (stop: Partial<Stop>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const StopSection: React.FC<StopSectionProps> = ({ stop, index, ... }) => (
  <div className="card relative">
    {/* Drag handle & section number */}
    <div className="flex items-center gap-4 mb-4">
      <div className="flex flex-col gap-1">
        <button 
          onClick={onMoveUp} 
          disabled={isFirst}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <button 
          onClick={onMoveDown} 
          disabled={isLast}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold">Section {index + 1}:</h3>
        <p className="text-white/50 text-sm">{stop.cityName}, {stop.country}</p>
      </div>
      
      <button onClick={onDelete} className="text-red-400 hover:text-red-300 p-2">
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
    
    {/* Section content */}
    <div className="pl-12 space-y-4">
      <p className="text-white/60">
        All the necessary information about this section.
        This can be anything like travel section, hotel or any other activity.
      </p>
      
      {/* Date range and budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-3">
          <label className="text-xs text-white/40">Date Range</label>
          <p className="font-medium">
            {formatDate(stop.startDate)} to {formatDate(stop.endDate)}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <label className="text-xs text-white/40">Budget of this section</label>
          <p className="font-medium">${calculateStopBudget(stop.id)}</p>
        </div>
      </div>
      
      {/* Activities list */}
      <div>
        <h4 className="text-sm font-medium mb-2">Activities</h4>
        <div className="space-y-2">
          {getActivitiesForStop(stop.id).map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
        <button className="btn-secondary text-sm mt-2">
          <Plus className="w-4 h-4" /> Add Activity
        </button>
      </div>
    </div>
  </div>
);
```

#### 4. Add Section Button
```tsx
<button 
  onClick={addNewStop}
  className="w-full border-2 border-dashed border-white/20 rounded-2xl p-8 
           hover:border-globe-500/50 hover:bg-globe-500/5 transition-all
           flex items-center justify-center gap-2 text-white/50 hover:text-white"
>
  <Plus className="w-5 h-5" />
  Add another Section
</button>
```

### State Management
```typescript
const [trip, setTrip] = useState<Trip | null>(null);
const [stops, setStops] = useState<Stop[]>([]);
const [activities, setActivities] = useState<Activity[]>([]);
const [isDirty, setIsDirty] = useState(false);
```

### API Calls
```typescript
GET /api/trips/:tripId                     // Get trip details
GET /api/trips/:tripId/stops               // Get stops
POST /api/trips/:tripId/stops              // Add stop
PUT /api/stops/:id                         // Update stop
DELETE /api/stops/:id                      // Delete stop
PUT /api/trips/:tripId/stops/reorder       // Reorder stops
GET /api/stops/:stopId/activities          // Get activities for stop
```

---

## 👁️ Screen 4: Itinerary View

### File: `src/pages/ItineraryView.tsx`

### Description
Read-only visual representation of the completed trip itinerary with day-wise layout.

### Mockup Reference (Screen 9)
- Day tabs (Day 1, Day 2...)
- Physical Activity column
- Expense column
- Timeline view

### Component Requirements

```tsx
interface ItineraryViewProps {
  trips: Trip[];
  stops: Stop[];
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}
```

### UI Sections

#### 1. Trip Header
```tsx
<div className="mb-8">
  <div className="flex items-center gap-4 mb-4">
    <Link to="/my-trips" className="btn-secondary">
      <ArrowLeft className="w-4 h-4" />
    </Link>
    <div className="flex-1">
      <h1 className="text-3xl font-display font-bold">
        Itinerary for {trip.name}
      </h1>
      <p className="text-white/50">
        {stops.length} stops • {calculateTotalDays()} days
      </p>
    </div>
    <button className="btn-secondary">
      <Share2 className="w-4 h-4" /> Share
    </button>
    <Link to={`/builder/${tripId}`} className="btn-primary">
      <Edit className="w-4 h-4" /> Edit
    </Link>
  </div>
</div>
```

#### 2. Day Tabs
```tsx
<div className="flex gap-2 mb-6 overflow-x-auto pb-2">
  {days.map((day, index) => (
    <button
      key={day}
      onClick={() => setSelectedDay(index)}
      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all
        ${selectedDay === index 
          ? 'bg-globe-500 text-white' 
          : 'bg-white/5 hover:bg-white/10'}`}
    >
      Day {index + 1}
    </button>
  ))}
</div>
```

#### 3. Day View with Activities
```tsx
<div className="card">
  {/* Day header */}
  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
    <div>
      <h2 className="text-xl font-semibold">Day {selectedDay + 1}</h2>
      <p className="text-white/50">{formatDate(days[selectedDay])}</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-white/50">Total Expenses</p>
      <p className="text-xl font-semibold text-globe-400">
        ${calculateDayExpenses(selectedDay)}
      </p>
    </div>
  </div>
  
  {/* Activity timeline */}
  <div className="space-y-4">
    {getDayActivities(selectedDay).map((activity, index) => (
      <div key={activity.id} className="flex gap-4">
        {/* Timeline indicator */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-globe-500" />
          {index < getDayActivities(selectedDay).length - 1 && (
            <div className="w-0.5 flex-1 bg-white/10 my-1" />
          )}
        </div>
        
        {/* Activity card */}
        <div className="flex-1 flex gap-4 pb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/50">
                {activity.startTime} - {activity.endTime}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(activity.category)}`}>
                {activity.category}
              </span>
            </div>
            <h3 className="font-medium mt-1">{activity.name}</h3>
            {activity.description && (
              <p className="text-white/50 text-sm mt-1">{activity.description}</p>
            )}
            {activity.location && (
              <p className="text-white/40 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" /> {activity.location}
              </p>
            )}
          </div>
          
          {/* Expense */}
          <div className="text-right">
            <p className="font-semibold">${activity.cost}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

#### 4. Summary Stats
```tsx
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
  <div className="card text-center">
    <Calendar className="w-6 h-6 mx-auto mb-2 text-globe-400" />
    <p className="text-2xl font-bold">{calculateTotalDays()}</p>
    <p className="text-white/50 text-sm">Days</p>
  </div>
  <div className="card text-center">
    <MapPin className="w-6 h-6 mx-auto mb-2 text-globe-400" />
    <p className="text-2xl font-bold">{stops.length}</p>
    <p className="text-white/50 text-sm">Stops</p>
  </div>
  <div className="card text-center">
    <Activity className="w-6 h-6 mx-auto mb-2 text-globe-400" />
    <p className="text-2xl font-bold">{activities.length}</p>
    <p className="text-white/50 text-sm">Activities</p>
  </div>
  <div className="card text-center">
    <DollarSign className="w-6 h-6 mx-auto mb-2 text-globe-400" />
    <p className="text-2xl font-bold">${calculateTotalCost()}</p>
    <p className="text-white/50 text-sm">Total Cost</p>
  </div>
</div>
```

---

## 📅 Screen 5: Calendar / Timeline

### File: `src/pages/Calendar.tsx`

### Description
Calendar-based view showing all trips and activities in a monthly/weekly format.

### Mockup Reference (Screen 11)
- Month navigation (arrows)
- Calendar grid with day cells
- Trip spans across multiple days
- Events marked on days

### Component Requirements

```tsx
interface CalendarProps {
  trips: Trip[];
}
```

### UI Sections

#### 1. Calendar Header
```tsx
<div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-display font-bold">Calendar View</h1>
  
  <div className="flex items-center gap-4">
    <button onClick={prevMonth} className="btn-secondary p-2">
      <ChevronLeft className="w-5 h-5" />
    </button>
    <h2 className="text-xl font-semibold min-w-[200px] text-center">
      {format(currentMonth, 'MMMM yyyy')}
    </h2>
    <button onClick={nextMonth} className="btn-secondary p-2">
      <ChevronRight className="w-5 h-5" />
    </button>
  </div>
  
  <div className="flex gap-2">
    <button className={viewMode === 'month' ? 'btn-primary' : 'btn-secondary'}>
      Month
    </button>
    <button className={viewMode === 'week' ? 'btn-primary' : 'btn-secondary'}>
      Week
    </button>
  </div>
</div>
```

#### 2. Calendar Grid
```tsx
<div className="card">
  {/* Weekday headers */}
  <div className="grid grid-cols-7 gap-1 mb-2">
    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
      <div key={day} className="text-center text-white/50 text-sm py-2">
        {day}
      </div>
    ))}
  </div>
  
  {/* Calendar days */}
  <div className="grid grid-cols-7 gap-1">
    {calendarDays.map((day, index) => (
      <CalendarDay
        key={index}
        date={day.date}
        isCurrentMonth={day.isCurrentMonth}
        isToday={day.isToday}
        trips={getTripsForDay(day.date)}
        onClick={() => setSelectedDay(day.date)}
      />
    ))}
  </div>
</div>
```

#### 3. Calendar Day Cell
```tsx
interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  trips: Trip[];
  onClick: () => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, isCurrentMonth, isToday, trips, onClick }) => (
  <div
    onClick={onClick}
    className={`min-h-[100px] p-2 border border-white/5 rounded-lg cursor-pointer
      hover:bg-white/5 transition-all
      ${!isCurrentMonth ? 'opacity-30' : ''}
      ${isToday ? 'border-globe-500/50 bg-globe-500/10' : ''}`}
  >
    <span className={`text-sm ${isToday ? 'text-globe-400 font-bold' : 'text-white/70'}`}>
      {format(date, 'd')}
    </span>
    
    <div className="mt-1 space-y-1">
      {trips.slice(0, 2).map(trip => (
        <div
          key={trip.id}
          className="text-xs px-1 py-0.5 rounded bg-globe-500/20 text-globe-300 truncate"
        >
          {trip.name}
        </div>
      ))}
      {trips.length > 2 && (
        <div className="text-xs text-white/50">+{trips.length - 2} more</div>
      )}
    </div>
  </div>
);
```

#### 4. Selected Day Detail Panel
```tsx
{selectedDay && (
  <div className="card mt-4">
    <h3 className="font-semibold mb-4">
      {format(selectedDay, 'EEEE, MMMM d, yyyy')}
    </h3>
    
    {getTripsForDay(selectedDay).map(trip => (
      <div key={trip.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg mb-2">
        <div>
          <p className="font-medium">{trip.name}</p>
          <p className="text-white/50 text-sm">
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </p>
        </div>
        <Link to={`/itinerary/${trip.id}`} className="btn-secondary text-sm">
          View
        </Link>
      </div>
    ))}
    
    {getTripsForDay(selectedDay).length === 0 && (
      <p className="text-white/50 text-center py-4">No trips on this day</p>
    )}
  </div>
)}
```

### Utility Functions
```typescript
// Generate calendar days for a month
function getCalendarDays(month: Date): CalendarDay[] {
  const start = startOfWeek(startOfMonth(month));
  const end = endOfWeek(endOfMonth(month));
  const days: CalendarDay[] = [];
  
  let current = start;
  while (current <= end) {
    days.push({
      date: current,
      isCurrentMonth: isSameMonth(current, month),
      isToday: isToday(current),
    });
    current = addDays(current, 1);
  }
  
  return days;
}

// Check if a trip spans a specific day
function tripSpansDay(trip: Trip, day: Date): boolean {
  const tripStart = parseISO(trip.startDate);
  const tripEnd = parseISO(trip.endDate);
  return day >= tripStart && day <= tripEnd;
}
```

---

## 📝 Checklist Before Committing

- [ ] Component renders without errors
- [ ] All TypeScript types are correct
- [ ] Forms have validation
- [ ] Loading states implemented
- [ ] Error states handled
- [ ] Mobile responsive design
- [ ] Accessibility (aria labels)
- [ ] `npm run build` passes
- [ ] Tested CRUD operations work

---

## 🔗 Useful Links

- [Mockup](https://link.excalidraw.com/l/65VNwvy7c4X/6CzbTgEeSr1)
- [date-fns](https://date-fns.org/) - Date formatting library
- [React DnD](https://react-dnd.github.io/react-dnd/) - For drag and drop

---

*Assigned to: Member B*
*Last Updated: January 3, 2026*
