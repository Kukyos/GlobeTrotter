import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Share2,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import type { Trip, Stop } from "../types/trip";

/**
 * ItineraryView.tsx
 *
 * Screen: Itinerary View (Read-only)
 *
 * Displays the trip itinerary in a beautiful, read-only format.
 * Users can navigate to the builder to edit.
 */

/* ---------------- Mock API (simulated) ---------------- */
const mockGetTrip = (tripId: string): Promise<Trip> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          id: tripId,
          userId: "member-b",
          name: "European Adventure",
          destination: "Various",
          startDate: format(new Date(), "yyyy-MM-dd"),
          endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
          status: "upcoming",
          description: "An amazing journey through Europe's most beautiful cities.",
          coverPhoto: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
          totalBudget: 5000,
        }),
      350
    )
  );

const mockGetStops = (tripId: string): Promise<Stop[]> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          {
            id: "stop-1",
            tripId,
            cityName: "Lisbon",
            country: "Portugal",
            startDate: format(new Date(), "yyyy-MM-dd"),
            endDate: format(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
            budget: 800,
          },
          {
            id: "stop-2",
            tripId,
            cityName: "Seville",
            country: "Spain",
            startDate: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
            endDate: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
            budget: 600,
          },
          {
            id: "stop-3",
            tripId,
            cityName: "Barcelona",
            country: "Spain",
            startDate: format(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
            endDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
            budget: 900,
          },
        ]),
      400
    )
  );

/* ---------------- Helpers ---------------- */
const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
};

const calculateDays = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  try {
    return Math.max(1, differenceInCalendarDays(parseISO(end), parseISO(start)) + 1);
  } catch {
    return 0;
  }
};

/* ---------------- StopCard Component (Read-only) ---------------- */
interface StopCardProps {
  stop: Stop;
  index: number;
}

const StopCard: React.FC<StopCardProps> = ({ stop, index }) => {
  const days = calculateDays(stop.startDate, stop.endDate);
  
  return (
    <div className="card hover-lift animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl font-bold">
            {index + 1}
          </div>
          <div>
            <h3 className="text-2xl font-bold font-heading">{stop.cityName}</h3>
            <p className="text-white/50 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {stop.country}
            </p>
          </div>
        </div>
        {stop.budget && (
          <div className="text-right">
            <div className="text-sm text-white/40">Budget</div>
            <div className="text-xl font-bold">${stop.budget}</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-white/60">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(stop.startDate)}</span>
        </div>
        <span>→</span>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(stop.endDate)}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Clock className="w-4 h-4" />
          <span>{days} {days === 1 ? 'day' : 'days'}</span>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Main ItineraryView Component ---------------- */
interface ItineraryViewProps {
  tripId?: string;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ tripId: propTripId }) => {
  const { tripId: paramTripId } = useParams<{ tripId: string }>();
  const tripId = propTripId || paramTripId || "trip-1";
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      const [t, s] = await Promise.all([mockGetTrip(tripId), mockGetStops(tripId)]);
      if (!mounted) return;
      setTrip(t);
      setStops(s);
      setIsLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, [tripId]);

  const totalDays = calculateDays(trip?.startDate, trip?.endDate);
  const totalBudget = stops.reduce((sum, stop) => sum + (stop.budget || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50 animate-pulse">Loading itinerary...</div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/50">Trip not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <Link 
          to="/my-trips" 
          className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all mb-6 hover:translate-x-[-4px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Trips</span>
        </Link>

        {/* Hero Section */}
        <div className="relative h-96 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-scale-in">
          {trip.coverPhoto && (
            <img
              src={trip.coverPhoto}
              alt={trip.name}
              className="w-full h-full object-cover brightness-[0.4]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
            <div className="mb-4">
              <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full ${
                trip.status === 'ongoing' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                trip.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                'bg-white/10 text-white/60 border border-white/20'
              }`}>
                {trip.status}
              </span>
            </div>
            <h1 className="text-5xl font-bold font-heading glow-text mb-4">{trip.name}</h1>
            {trip.description && (
              <p className="text-xl text-white/70 max-w-2xl">{trip.description}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 animate-fade-in-up">
          <Link
            to={`/itinerary/${tripId}/builder`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Itinerary
          </Link>
          <button className="btn-secondary inline-flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="card hover-scale">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-white/40">Duration</div>
              <div className="text-2xl font-bold">{totalDays} Days</div>
            </div>
          </div>
        </div>

        <div className="card hover-scale">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-white/40">Stops</div>
              <div className="text-2xl font-bold">{stops.length} Cities</div>
            </div>
          </div>
        </div>

        <div className="card hover-scale">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-white/40">Total Budget</div>
              <div className="text-2xl font-bold">${totalBudget}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold font-heading">Your Journey</h2>
          <div className="text-sm text-white/50">
            {formatDate(trip.startDate)} → {formatDate(trip.endDate)}
          </div>
        </div>

        {/* Stops List */}
        <div className="space-y-4">
          {stops.map((stop, index) => (
            <StopCard key={stop.id} stop={stop} index={index} />
          ))}
        </div>

        {stops.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-white/40 mb-4">No stops added yet</p>
            <Link
              to={`/itinerary/${tripId}/builder`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Start Planning
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryView;
