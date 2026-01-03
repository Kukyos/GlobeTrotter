import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Save,
  Plus,
  ChevronUp,
  ChevronDown,
  Trash2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { getTrip, getStops, updateStop as updateStopApi, createStop, deleteStop as deleteStopApi } from "../services/supabaseService";
import type { Trip, Stop, Activity } from "../types";

/**
 * ItineraryBuilder.tsx
 *
 * Screen: Itinerary Builder
 *
 * Requirements implemented:
 * - Interactive interface to add Cities/Stops to a trip.
 * - Allow reordering of stops (Move Up/Down).
 * - StopSection component with drag handle (move buttons), date range, activity list.
 */

// Helper to map Supabase trip (snake_case) to frontend Trip (camelCase)
const mapSupabaseTrip = (dbTrip: any): Trip => ({
  id: dbTrip.id,
  userId: dbTrip.user_id,
  name: dbTrip.name,
  destination: dbTrip.destination || dbTrip.name,
  description: dbTrip.description || undefined,
  startDate: dbTrip.start_date,
  endDate: dbTrip.end_date,
  coverPhoto: dbTrip.cover_photo || undefined,
  status: dbTrip.status,
  isPublic: dbTrip.is_public,
  totalBudget: dbTrip.total_budget,
  createdAt: dbTrip.created_at,
  updatedAt: dbTrip.updated_at,
  stops: [],
});

// Helper to map Supabase stop (snake_case) to frontend Stop (camelCase)
const mapSupabaseStop = (dbStop: any): Stop => ({
  id: dbStop.id,
  tripId: dbStop.trip_id,
  cityId: dbStop.city_id,
  cityName: dbStop.city_name,
  country: dbStop.country,
  startDate: dbStop.start_date,
  endDate: dbStop.end_date,
  order: dbStop.order_index,
  budget: dbStop.budget,
  notes: dbStop.notes,
});

/* ---------------- Helpers ---------------- */
const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
};

const calculateStopBudget = (stopId: string, stops: Stop[], activities: Activity[]) => {
  const stop = stops.find((s) => s.id === stopId);
  const activitiesSum = activities.filter((a) => a.stopId === stopId).reduce((s, a) => s + (a.cost || 0), 0);
  return (stop?.budget || 0) + activitiesSum;
};

/* ---------------- ActivityItem (simple) ---------------- */
const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => (
  <div className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2">
    <div>
      <div className="text-sm font-medium">{activity.name}</div>
      <div className="text-xs text-white/50">{activity.category} • {activity.location || "—"}</div>
    </div>
    <div className="text-sm text-white/50">${activity.cost.toFixed(2)}</div>
  </div>
);

/* ---------------- StopSection component ---------------- */
interface StopSectionProps {
  stop: Stop;
  index: number;
  stops: Stop[];
  activities: Activity[];
  onUpdate: (partial: Partial<Stop>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const StopSection: React.FC<StopSectionProps> = ({
  stop,
  index,
  stops,
  activities,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) => {
  const stopActivities = activities.filter((a) => a.stopId === stop.id);

  return (
    <div className="card relative border rounded-xl p-4">
      {/* Drag handle & section number */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex flex-col gap-1">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
            aria-label={`Move section ${index + 1} up`}
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
            aria-label={`Move section ${index + 1} down`}
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold">Section {index + 1}:</h3>
          <p className="text-white/50 text-sm">{stop.cityName}, {stop.country}</p>
        </div>

        <button onClick={onDelete} className="text-red-400 hover:text-red-300 p-2" aria-label="Delete section">
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
            <div className="mt-2 flex gap-2">
              <input
                type="date"
                className="input-field"
                value={stop.startDate}
                onChange={(e) => onUpdate({ startDate: e.target.value })}
              />
              <input
                type="date"
                className="input-field"
                value={stop.endDate}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-3">
            <label className="text-xs text-white/40">Budget of this section</label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={0}
                className="input-field"
                value={stop.budget ?? ""}
                onChange={(e) => onUpdate({ budget: e.target.value === "" ? undefined : Number(e.target.value) })}
              />
              <div className="text-sm text-white/50">Estimated: ${calculateStopBudget(stop.id, stops, activities)}</div>
            </div>
          </div>
        </div>

        {/* Activities list */}
        <div>
          <h4 className="text-sm font-medium mb-2">Activities</h4>
          <div className="space-y-2">
            {stopActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button className="btn-secondary text-sm inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Main ItineraryBuilder Component ---------------- */
interface ItineraryBuilderProps {
  tripId?: string;
  // optional props to allow parent-managed stops for integration tests
  initialStops?: Stop[];
}

const ItineraryBuilder: React.FC<ItineraryBuilderProps> = ({ tripId: propTripId, initialStops = [] }) => {
  const { tripId: paramTripId } = useParams<{ tripId: string }>();
  // Use propTripId if provided and non-empty, otherwise use URL param
  const tripId = (propTripId && propTripId.trim()) ? propTripId : paramTripId;
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>(initialStops);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!tripId) {
        setError("No trip ID provided");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      // Fetch trip and stops from Supabase
      const [tripResult, stopsResult] = await Promise.all([
        getTrip(tripId),
        getStops(tripId)
      ]);
      
      if (!mounted) return;
      
      if (tripResult.error) {
        setError(tripResult.error);
        setIsLoading(false);
        return;
      }
      
      if (!tripResult.trip) {
        setError("Trip not found");
        setIsLoading(false);
        return;
      }
      
      // Map snake_case to camelCase
      setTrip(mapSupabaseTrip(tripResult.trip));
      setStops((stopsResult.stops || []).map(mapSupabaseStop));
      // activities would be fetched per-stop in a real app; keep empty sample here
      setActivities([]);
      setIsLoading(false);
    };
    if (!initialStops.length) load();
    else setIsLoading(false);
    return () => {
      mounted = false;
    };
  }, [tripId, initialStops.length]);

  const addNewStop = () => {
    if (!tripId) return;
    const newStop: Stop = {
      id: `stop-${Date.now()}`,
      tripId: tripId,
      cityName: "New City",
      country: "Country",
      startDate: format(new Date(), "yyyy-MM-dd"),
      endDate: format(new Date(), "yyyy-MM-dd"),
      order: stops.length,
      budget: 0,
    };
    setStops((prev) => [...prev, newStop]);
    setIsDirty(true);
  };

  const updateStop = (stopId: string, partial: Partial<Stop>) => {
    setStops((prev) => prev.map((s) => (s.id === stopId ? { ...s, ...partial } : s)));
    setIsDirty(true);
  };

  const deleteStop = (stopId: string) => {
    setStops((prev) => prev.filter((s) => s.id !== stopId));
    setIsDirty(true);
  };

  const moveStop = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= stops.length) return;
    setStops((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, item);
      return copy;
    });
    setIsDirty(true);
  };

  const saveItinerary = async () => {
    // In real app: call API to save stops and order
    // Mock with timeout
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsDirty(false);
    setIsLoading(false);
    alert("Itinerary saved (mock).");
  };

  const preview = () => {
    alert("Preview (mock)");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Loading itinerary builder...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-white/50">{error || "Trip not found"}</div>
        <Link to="/my-trips" className="btn-secondary">
          Back to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/my-trips" className="text-white/50 hover:text-white text-sm flex items-center gap-1 mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to My Trips
          </Link>
          <h1 className="text-3xl font-display font-bold">{trip?.name ?? "Untitled Trip"}</h1>
          <p className="text-white/50">
            {trip ? `${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}` : "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={preview} className="btn-secondary inline-flex items-center gap-2">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button onClick={saveItinerary} className="btn-primary inline-flex items-center gap-2">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Sections / Stops List */}
      <div className="space-y-6">
        {stops.map((stop, index) => (
          <StopSection
            key={stop.id}
            stop={stop}
            index={index}
            stops={stops}
            activities={activities}
            onUpdate={(partial) => updateStop(stop.id, partial)}
            onDelete={() => deleteStop(stop.id)}
            onMoveUp={() => moveStop(index, index - 1)}
            onMoveDown={() => moveStop(index, index + 1)}
            isFirst={index === 0}
            isLast={index === stops.length - 1}
          />
        ))}
      </div>

      {/* Add Section Button */}
      <div>
        <button
          onClick={addNewStop}
          className="w-full border-2 border-dashed border-white/20 rounded-2xl p-8 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-2 text-white/50 hover:text-white"
        >
          <Plus className="w-5 h-5" />
          Add another Section
        </button>
      </div>

      {/* Dirty indicator */}
      {isDirty && <div className="text-sm text-yellow-300">You have unsaved changes.</div>}
    </div>
  );
};

export default ItineraryBuilder;