import React, { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, DollarSign, Check, X } from "lucide-react";
import { formatISO } from "date-fns";
import type { City, Trip } from "../types/trip";

/**
 * CreateTrip.tsx
 *
 * Screen: Create Trip
 *
 * Requirements implemented:
 * - Form to initiate a new trip
 * - Exact header class: "text-3xl font-display font-bold glow-text"
 * - Inputs use classes "input-label" for labels and "input-field" for inputs
 * - State: tripName, destination, startDate, endDate, budget
 * - Destination input has a dropdown for citySuggestions
 * - "Suggestions" section grid that maps suggestions via SuggestionCard
 *
 * Notes:
 * - Mocked API calls use setTimeout to simulate latency.
 * - Functional components and strict TypeScript interfaces are used.
 */

/* ---------- Mock API (kept simple and structured) ---------- */
const mockFetchCitySuggestions = (query = ""): Promise<City[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const all: City[] = [
        { id: "c1", name: "Lisbon", country: "Portugal", imageUrl: "https://images.unsplash.com/photo-1505238680356-667803448bb6?w=800&q=60" },
        { id: "c2", name: "Paris", country: "France", imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=60" },
        { id: "c3", name: "Kyoto", country: "Japan", imageUrl: "https://images.unsplash.com/photo-1549693578-d683be217e58?w=800&q=60" },
        { id: "c4", name: "New York", country: "USA", imageUrl: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&q=60" },
        { id: "c5", name: "Cape Town", country: "South Africa", imageUrl: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=60" },
      ];

      const filtered = query.trim()
        ? all.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()))
        : all;
      resolve(filtered);
    }, 450);
  });

/* ---------- SuggestionCard sub-component ---------- */
interface SuggestionCardProps {
  city: City;
  onSelect: (city: City) => void;
}

const SuggestionCard: React.FC<SuggestionCardProps> = ({ city, onSelect }) => {
  return (
    <div
      className="flex items-center space-x-3 rounded-lg border p-3 hover:shadow-md transition cursor-pointer"
      onClick={() => onSelect(city)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(city);
      }}
    >
      <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        {city.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={city.imageUrl} alt={`${city.name} cover`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">No Image</div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="text-sm font-semibold">{city.name}</div>
        <div className="text-xs text-gray-500">{city.country}</div>
      </div>

      <div className="ml-2">
        <Check className="h-5 w-5 text-green-500" />
      </div>
    </div>
  );
};

/* ---------- Main CreateTrip Component ---------- */
const CreateTrip: React.FC = () => {
  const [tripName, setTripName] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [startDate, setStartDate] = useState<string>(() => formatISO(new Date(), { representation: "date" }));
  const [endDate, setEndDate] = useState<string>(() => formatISO(new Date(), { representation: "date" }));
  const [budget, setBudget] = useState<number | "">("");
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // initial load of suggestions
    refreshSuggestions("");
  }, []);

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target as Node)) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const refreshSuggestions = (query: string) => {
    setIsLoadingSuggestions(true);
    mockFetchCitySuggestions(query)
      .then((res) => {
        setCitySuggestions(res);
      })
      .finally(() => setIsLoadingSuggestions(false));
  };

  const handleDestinationChange = (val: string) => {
    setDestination(val);
    setSelectedCity(null);
    setShowDropdown(true);
    refreshSuggestions(val);
  };

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setDestination(`${city.name}, ${city.country}`);
    setShowDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // basic validation
    if (!tripName.trim()) {
      alert("Please enter a trip name.");
      return;
    }
    if (!destination.trim()) {
      alert("Please select a destination.");
      return;
    }

    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      userId: "member-b", // placeholder for Member B
      name: tripName.trim(),
      destination: destination.trim(),
      startDate: startDate,
      endDate: endDate,
      description: undefined,
      coverPhoto: selectedCity?.imageUrl,
      totalBudget: typeof budget === "number" ? budget : undefined,
      status: "upcoming",
      stops: [],
    };

    // mock API call to create trip
    setTimeout(() => {
      // In a real app we'd POST newTrip to an endpoint
      // For now, we just log it and reset the form
      // eslint-disable-next-line no-console
      console.log("Created trip (mock):", newTrip);
      alert("Trip created (mock). Check console for object.");
      // reset
      setTripName("");
      setDestination("");
      setSelectedCity(null);
      setStartDate(formatISO(new Date(), { representation: "date" }));
      setEndDate(formatISO(new Date(), { representation: "date" }));
      setBudget("");
    }, 700);
  };

  return (
    <div className="max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-3xl font-display font-bold glow-text">Plan a New Trip</h1>
        <p className="mt-2 text-sm text-gray-500">Start by filling the basics — you can add stops and activities later.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip name */}
        <div>
          <label className="input-label block mb-2">Trip name</label>
          <input
            className="input-field w-full rounded-md border px-3 py-2"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="e.g., Summer in Europe"
          />
        </div>

        {/* Destination (with dropdown suggestions) */}
        <div ref={dropdownRef} className="relative">
          <label className="input-label block mb-2">Destination</label>
          <div className="relative">
            <div className="absolute left-3 top-3 pointer-events-none text-gray-400">
              <MapPin className="h-4 w-4" />
            </div>

            <input
              className="input-field w-full rounded-md border px-10 py-2"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onFocus={() => {
                setShowDropdown(true);
                refreshSuggestions(destination);
              }}
              placeholder="Start typing a city..."
              aria-autocomplete="list"
              aria-expanded={showDropdown}
            />

            {showDropdown && (
              <div className="absolute z-30 mt-1 w-full rounded-md bg-white shadow-lg">
                <div className="max-h-56 overflow-auto p-2">
                  {isLoadingSuggestions ? (
                    <div className="p-2 text-sm text-gray-500">Loading suggestions...</div>
                  ) : citySuggestions.length === 0 ? (
                    <div className="p-2 text-sm text-gray-500">No suggestions</div>
                  ) : (
                    <div className="space-y-2">
                      {citySuggestions.map((city) => (
                        <div key={city.id}>
                          <SuggestionCard city={city} onSelect={handleSelectCity} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="input-label block mb-2">Start date</label>
            <div className="relative">
              <div className="absolute left-3 top-3 pointer-events-none text-gray-400">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                className="input-field w-full rounded-md border px-10 py-2"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="input-label block mb-2">End date</label>
            <div className="relative">
              <div className="absolute left-3 top-3 pointer-events-none text-gray-400">
                <Calendar className="h-4 w-4" />
              </div>
              <input
                type="date"
                className="input-field w-full rounded-md border px-10 py-2"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="input-label block mb-2">Budget (estimated)</label>
          <div className="relative max-w-xs">
            <div className="absolute left-3 top-3 pointer-events-none text-gray-400">
              <DollarSign className="h-4 w-4" />
            </div>
            <input
              type="number"
              min={0}
              className="input-field w-full rounded-md border px-10 py-2"
              value={budget === "" ? "" : String(budget)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") setBudget("");
                else setBudget(Number(v));
              }}
              placeholder="Total budget (USD)"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            <Check className="mr-2 h-4 w-4" /> Create Trip
          </button>

          <button
            type="button"
            onClick={() => {
              setTripName("");
              setDestination("");
              setSelectedCity(null);
              setStartDate(formatISO(new Date(), { representation: "date" }));
              setEndDate(formatISO(new Date(), { representation: "date" }));
              setBudget("");
            }}
            className="inline-flex items-center rounded-md border px-3 py-2 text-sm"
          >
            <X className="mr-2 h-4 w-4" /> Reset
          </button>
        </div>
      </form>

      {/* Suggestions grid (explicit requirement) */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Suggestions</h2>
          <button
            type="button"
            onClick={() => refreshSuggestions("")}
            className="text-sm text-indigo-600 hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {citySuggestions.map((city) => (
            <SuggestionCard key={city.id} city={city} onSelect={handleSelectCity} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CreateTrip;