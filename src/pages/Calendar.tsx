import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { Trip } from "../types";
import { getTrips } from "../services/supabaseService";

/**
 * Calendar.tsx
 *
 * Screen: Calendar / Timeline (monthly view)
 *
 * - Custom calendar grid built with date-fns
 * - Shows trips spanning multiple days
 * - Click a day to view trips for that date
 * - Highlights today
 */

/* ---------------- Types ---------------- */
interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

interface CalendarProps {
  trips?: Trip[];
}

/* ---------------- Helpers ---------------- */
function getCalendarDays(month: Date): CalendarDay[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
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

function tripSpansDay(trip: Trip, day: Date): boolean {
  try {
    const tripStart = parseISO(trip.startDate);
    const tripEnd = parseISO(trip.endDate);
    // compare by date objects (time portion is relevant but trips are stored as ISO date strings)
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
    const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
    return tripStart <= dayEnd && tripEnd >= dayStart;
  } catch {
    return false;
  }
}

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
};

/* ---------------- CalendarDay Component ---------------- */
interface CalendarDayProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  trips: Trip[];
  onClick: () => void;
}

const CalendarDayCell: React.FC<CalendarDayProps> = ({ date, isCurrentMonth, isToday, trips, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`min-h-[100px] p-2 border border-white/5 rounded-lg cursor-pointer hover:bg-white/5 transition-all
        ${!isCurrentMonth ? "opacity-30" : ""}
        ${isToday ? "border-globe-500/50 bg-globe-500/10" : ""}`}
    >
      <span className={`text-sm ${isToday ? "text-globe-400 font-bold" : "text-white/70"}`}>{format(date, "d")}</span>

      <div className="mt-1 space-y-1">
        {trips.slice(0, 2).map((trip) => (
          <div key={trip.id} className="text-xs px-1 py-0.5 rounded bg-globe-500/20 text-globe-300 truncate">
            {trip.name}
          </div>
        ))}
        {trips.length > 2 && <div className="text-xs text-white/50">+{trips.length - 2} more</div>}
      </div>
    </div>
  );
};

/* ---------------- Main Calendar Component ---------------- */
const Calendar: React.FC<CalendarProps> = ({ trips: propTrips }) => {
  const [trips, setTrips] = useState<Trip[]>(propTrips || []);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!propTrips);

  useEffect(() => {
    // If trips passed as props, use those
    if (propTrips) {
      setTrips(propTrips);
      setIsLoading(false);
      return;
    }

    // Otherwise fetch from Supabase
    let mounted = true;
    setIsLoading(true);
    getTrips().then(({ trips: userTrips, error }) => {
      if (!mounted) return;
      if (!error && userTrips) {
        // Map Supabase trip format to component format
        setTrips(userTrips.map((t: any) => ({
          id: t.id,
          userId: t.user_id,
          name: t.name,
          destination: t.destination,
          startDate: t.start_date,
          endDate: t.end_date,
          description: t.description,
          coverPhoto: t.cover_photo,
          totalBudget: t.total_budget,
          status: t.status,
        })));
      }
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const calendarDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);

  const getTripsForDay = (day: Date) => trips.filter((t) => tripSpansDay(t, day));

  const prevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const nextMonth = () => setCurrentMonth((m) => addMonths(m, 1));

  const calculateTotalDays = useMemo(() => {
    if (!selectedDay) return 0;
    return getTripsForDay(selectedDay).length;
  }, [selectedDay, trips]);

  const calculateDayExpenses = (day: Date) => {
    const dayTrips = getTripsForDay(day);
    const total = dayTrips.reduce((sum, t) => sum + (t.totalBudget || 0), 0);
    return total;
  };

  return (
    <div className="max-w-5xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Calendar View</h1>

        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="btn-secondary p-2">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-semibold min-w-[200px] text-center">{format(currentMonth, "MMMM yyyy")}</h2>

          <button onClick={nextMonth} className="btn-secondary p-2">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("month")}
            className={viewMode === "month" ? "btn-primary" : "btn-secondary"}
          >
            Month
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={viewMode === "week" ? "btn-primary" : "btn-secondary"}
          >
            Week
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
            <div key={d} className="text-center text-white/50 text-sm py-2">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayObj, idx) => (
            <CalendarDayCell
              key={idx}
              date={dayObj.date}
              isCurrentMonth={dayObj.isCurrentMonth}
              isToday={dayObj.isToday}
              trips={getTripsForDay(dayObj.date)}
              onClick={() => setSelectedDay(dayObj.date)}
            />
          ))}
        </div>
      </div>

      {/* Selected Day Panel */}
      {selectedDay && (
        <div className="card mt-4 p-4">
          <h3 className="font-semibold mb-4">{format(selectedDay, "EEEE, MMMM d, yyyy")}</h3>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-white/50">{getTripsForDay(selectedDay).length} trips</div>
            <div className="text-right">
              <p className="text-sm text-white/50">Total Expenses</p>
              <p className="text-xl font-semibold text-globe-400">${calculateDayExpenses(selectedDay)}</p>
            </div>
          </div>

          {getTripsForDay(selectedDay).map((trip) => (
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

      {/* Loading state */}
      {isLoading && <div className="text-sm text-white/50">Loading trips...</div>}
    </div>
  );
};

export default Calendar;