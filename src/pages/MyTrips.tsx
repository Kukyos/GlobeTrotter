import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Calendar as CalendarIcon, CheckCircle, Plane, Trash2 } from "lucide-react";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { getTrips, deleteTrip } from "../services/supabaseService";
import type { Trip } from "../types";

/**
 * MyTrips.tsx
 *
 * Screen: My Trips (List View)
 *
 * - Header: "My Trips" with New Trip button linking to /create-trip
 * - Search, Group By, Filter, Sort controls
 * - List grouped by status: ongoing, upcoming, completed
 * - TripListCard sub-component with actions: View, Edit, Delete
 */

// Helper to map Supabase trip (snake_case) to frontend Trip (camelCase)
const mapSupabaseTrip = (dbTrip: any): Trip => ({
  id: dbTrip.id,
  userId: dbTrip.user_id,
  name: dbTrip.name,
  description: dbTrip.description || undefined,
  startDate: dbTrip.start_date,
  endDate: dbTrip.end_date,
  coverPhoto: dbTrip.cover_photo || undefined,
  status: dbTrip.status,
  isPublic: dbTrip.is_public,
  totalBudget: dbTrip.total_budget,
  createdAt: dbTrip.created_at,
  updatedAt: dbTrip.updated_at,
  destination: dbTrip.destination || dbTrip.name,
  stops: [],
});

/* ---------------- Utility helpers ---------------- */
const formatDate = (isoDate?: string) => {
  if (!isoDate) return "";
  try {
    const date = parseISO(isoDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoDate;
  }
};

const calculateDays = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  try {
    const d1 = parseISO(start);
    const d2 = parseISO(end);
    return Math.max(1, differenceInCalendarDays(d2, d1) + 1);
  } catch {
    return 0;
  }
};

/* ---------------- TripListCard Sub-component ---------------- */
interface TripListCardProps {
  trip: Trip;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TripListCard: React.FC<TripListCardProps> = ({ trip, onView, onEdit, onDelete }) => {
  return (
    <div className="card flex flex-col md:flex-row md:items-center gap-4 hover:border-white/20 transition-all border rounded-xl p-4 animate-scale-in hover-lift">
      {/* Cover image */}
      <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
        {trip.coverPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Plane className="w-8 h-8 text-white/20" />
          </div>
        )}
      </div>

      {/* Trip info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-xl font-semibold">{trip.name}</h3>
        <p className="text-white/50 text-sm mt-1">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </p>
        {trip.description && <p className="text-white/40 text-sm mt-2 line-clamp-2">{trip.description}</p>}

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
        <button onClick={onDelete} className="btn-secondary py-2 text-red-400 flex items-center justify-center">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ---------------- Main MyTrips Component ---------------- */
interface MyTripsProps {
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
}

const MyTrips: React.FC<MyTripsProps> = ({ trips, setTrips }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [groupBy, setGroupBy] = useState<string>("status");
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");

  // Load trips on mount - always fetch from Supabase
  useEffect(() => {
    let mounted = true;
    const loadTrips = async () => {
      setIsLoading(true);
      const { trips: dbTrips, error } = await getTrips();
      if (!mounted) return;
      
      if (error) {
        console.error('Failed to load trips:', error);
        setIsLoading(false);
        return;
      }
      
      // Map snake_case database fields to camelCase for frontend
      const mappedTrips = dbTrips.map(mapSupabaseTrip);
      setTrips(mappedTrips);
      setIsLoading(false);
    };
    
    loadTrips();
    return () => {
      mounted = false;
    };
  }, [setTrips]);

  // Filtered + searched + sorted trips
  const processedTrips = useMemo(() => {
    let out = [...trips];

    // Filter by filter state
    if (filter !== "all") {
      out = out.filter((t) => t.status === filter);
    }

    // Search by name or destination
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      out = out.filter((t) => t.name.toLowerCase().includes(q) || (t.destination && t.destination.toLowerCase().includes(q)));
    }

    // Sort
    out.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      if (sortBy === "date-asc") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return out;
  }, [trips, filter, searchQuery, sortBy]);

  // Group into statuses
  const ongoingTrips = processedTrips.filter((t) => t.status === "ongoing");
  const upcomingTrips = processedTrips.filter((t) => t.status === "upcoming");
  const completedTrips = processedTrips.filter((t) => t.status === "completed");
  const draftTrips = processedTrips.filter((t) => t.status === "draft" || !t.status);

  /* Handlers for card actions */
  const handleView = (trip: Trip) => {
    // Navigate to itinerary view
    window.location.href = `/itinerary/${trip.id}`;
  };

  const handleEdit = (trip: Trip) => {
    // Navigate to edit or open modal; mocked here
    // eslint-disable-next-line no-console
    console.log("Edit trip", trip.id);
    alert(`Edit trip: ${trip.name} (mock)`);
  };

  const handleDelete = async (trip: Trip) => {
    if (!confirm(`Delete trip "${trip.name}"? This action cannot be undone.`)) return;
    // optimistic update
    const prev = [...trips];
    setTrips((cur) => cur.filter((t) => t.id !== trip.id));
    try {
      const { error } = await deleteTrip(trip.id);
      if (error) {
        throw new Error(error);
      }
    } catch (err) {
      // rollback
      setTrips(prev);
      console.error(err);
      alert("Failed to delete trip.");
    }
  };

  return (
    <div>
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold">My Trips</h1>
          <p className="text-white/50">{trips.length} trips total</p>
        </div>

        <Link to="/create-trip" className="btn-primary inline-flex items-center gap-2">
          <Plus className="w-5 h-5" /> New Trip
        </Link>
      </div>

      {/* Search and Filters Bar */}
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
          className="input-field w-auto transition-all duration-300 hover:bg-white/10 hover:border-white/30 cursor-pointer animate-fade-in"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="status">Group by Status</option>
          <option value="date">Group by Date</option>
          <option value="destination">Group by Destination</option>
        </select>

        {/* Filter */}
        <select
          className="input-field w-auto transition-all duration-300 hover:bg-white/10 hover:border-white/30 cursor-pointer animate-fade-in"
          style={{ animationDelay: '100ms' }}
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
          className="input-field w-auto transition-all duration-300 hover:bg-white/10 hover:border-white/30 cursor-pointer animate-fade-in"
          style={{ animationDelay: '200ms' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
        </select>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-sm text-white/50">Loading trips...</div>
      ) : (
        <>
          {/* Ongoing Section */}
          {ongoingTrips.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Ongoing
              </h2>
              <div className="space-y-4">
                {ongoingTrips.map((trip) => (
                  <TripListCard
                    key={trip.id}
                    trip={trip}
                    onView={() => handleView(trip)}
                    onEdit={() => handleEdit(trip)}
                    onDelete={() => handleDelete(trip)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Section */}
          {upcomingTrips.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-blue-400" />
                Upcoming
              </h2>
              <div className="space-y-4">
                {upcomingTrips.map((trip) => (
                  <TripListCard
                    key={trip.id}
                    trip={trip}
                    onView={() => handleView(trip)}
                    onEdit={() => handleEdit(trip)}
                    onDelete={() => handleDelete(trip)}
                  />
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
                {completedTrips.map((trip) => (
                  <TripListCard
                    key={trip.id}
                    trip={trip}
                    onView={() => handleView(trip)}
                    onEdit={() => handleEdit(trip)}
                    onDelete={() => handleDelete(trip)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Draft Section */}
          {draftTrips.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane className="w-4 h-4 text-yellow-400" />
                Drafts
              </h2>
              <div className="space-y-4">
                {draftTrips.map((trip) => (
                  <TripListCard
                    key={trip.id}
                    trip={trip}
                    onView={() => handleView(trip)}
                    onEdit={() => handleEdit(trip)}
                    onDelete={() => handleDelete(trip)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {ongoingTrips.length === 0 && upcomingTrips.length === 0 && completedTrips.length === 0 && draftTrips.length === 0 && (
            <div className="text-sm text-white/50">No trips found for the current filters.</div>
          )}
        </>
      )}
    </div>
  );
};

export default MyTrips;