import React, { useEffect, useState } from "react";
import { Camera, Key, Bell, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { User } from "../types/user";
import type { Trip } from "../types/trip";

/**
 * ProfileSettings.tsx
 *
 * - Profile header with avatar + camera edit button
 * - Editable form (InputField helper) initialized from user prop
 * - Preplanned Trips (upcoming) and Previous Trips (completed)
 * - Account settings card with Change Password, Notifications, Delete Account
 *
 * Component signature:
 * interface ProfileSettingsProps {
 *   user: User;
 *   setUser: (user: User | null) => void;
 * }
 */

/* ---------------- Mock API (simulated) ---------------- */
const mockGetUserTrips = (userId: string): Promise<Trip[]> =>
  new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      const iso = (d: Date) => format(d, "yyyy-MM-dd");
      resolve([
        {
          id: "t1",
          userId,
          name: "Lisbon Weekend",
          destination: "Lisbon, Portugal",
          startDate: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)),
          endDate: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)),
          description: "Explore the Alfama and eat pastel de nata.",
          coverPhoto: "https://images.unsplash.com/photo-1505238680356-667803448bb6?w=800&q=60",
          totalBudget: 800,
          status: "ongoing",
          stops: [],
        },
        {
          id: "t2",
          userId,
          name: "Paris in Spring",
          destination: "Paris, France",
          startDate: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10)),
          endDate: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 16)),
          description: "Museums and cafes.",
          coverPhoto: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=60",
          totalBudget: 2200,
          status: "upcoming",
          stops: [],
        },
        {
          id: "t3",
          userId,
          name: "Kyoto Autumn",
          destination: "Kyoto, Japan",
          startDate: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 40)),
          endDate: iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 35)),
          description: "Temples and maple leaves.",
          coverPhoto: undefined,
          totalBudget: 3000,
          status: "completed",
          stops: [],
        },
      ]);
    }, 400);
  });

const mockUpdateUser = (user: User): Promise<{ ok: boolean; user: User }> =>
  new Promise((resolve) => setTimeout(() => resolve({ ok: true, user }), 600));

const mockDeleteUser = (userId: string): Promise<{ ok: boolean }> =>
  new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 600));

/* ---------------- Helpers / small components ---------------- */
const defaultAvatar =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=60"; // fallback avatar

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
};

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, value, type = "text", onChange, placeholder }) => (
  <div>
    <label htmlFor={name} className="input-label block mb-2">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      className="input-field w-full rounded-md border px-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

/* Small TripCard mock used in trip history grids */
const TripCard: React.FC<{ trip: Trip; showViewButton?: boolean }> = ({ trip, showViewButton = false }) => {
  return (
    <div className="card border rounded-lg p-4 flex flex-col">
      <div className="w-full h-36 rounded-md overflow-hidden bg-white/5 mb-3">
        {trip.coverPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={trip.coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white/30">{trip.name}</div>
          </div>
        )}
      </div>

      <h3 className="font-semibold">{trip.name}</h3>
      <p className="text-sm text-white/50 mt-1">
        {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="text-sm text-white/50">${trip.totalBudget ?? "—"}</div>
        {showViewButton && (
          <a href={`/itinerary/${trip.id}`} className="btn-secondary text-sm">
            View
          </a>
        )}
      </div>
    </div>
  );
};

/* ---------------- Main ProfileSettings component ---------------- */
interface ProfileSettingsProps {
  user: User;
  setUser: (user: User | null) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, setUser }) => {
  // form state initialized from user prop
  const [firstName, setFirstName] = useState<string>(user.firstName || "");
  const [lastName, setLastName] = useState<string>(user.lastName || "");
  const [email, setEmail] = useState<string>(user.email || "");
  const [phone, setPhone] = useState<string>(user.phone || "");
  const [city, setCity] = useState<string>(user.city || "");
  const [country, setCountry] = useState<string>(user.country || "");
  const [bio, setBio] = useState<string>(user.bio || "");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user.photoUrl);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(true);

  useEffect(() => {
    // re-sync if user prop changes externally
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCity(user.city || "");
    setCountry(user.country || "");
    setBio(user.bio || "");
    setPhotoUrl(user.photoUrl);
  }, [user]);

  useEffect(() => {
    let mounted = true;
    setIsLoadingTrips(true);
    mockGetUserTrips(user.id).then((res) => {
      if (!mounted) return;
      setTrips(res);
      setIsLoadingTrips(false);
    });
    return () => {
      mounted = false;
    };
  }, [user.id]);

  const upcomingTrips = trips.filter((t) => t.status === "upcoming" || t.status === "ongoing");
  const completedTrips = trips.filter((t) => t.status === "completed");

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      alert("Please fill first name, last name and email.");
      return;
    }

    const updated: User = {
      ...user,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim(),
      country: country.trim(),
      bio: bio.trim(),
      photoUrl: photoUrl,
    };

    setIsSaving(true);
    try {
      const res = await mockUpdateUser(updated);
      if (res.ok) {
        setIsSaving(false);
        // optimistic update of parent
        setUser(res.user);
        alert("Profile updated (mock).");
      } else {
        setIsSaving(false);
        alert("Failed to update profile (mock).");
      }
    } catch (err) {
      setIsSaving(false);
      // eslint-disable-next-line no-console
      console.error(err);
      alert("Failed to update profile (mock).");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Delete your account? This action cannot be undone.")) return;
    try {
      const res = await mockDeleteUser(user.id);
      if (res.ok) {
        alert("Account deleted (mock). Logging out.");
        setUser(null);
      } else {
        alert("Failed to delete account (mock).");
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert("Failed to delete account (mock).");
    }
  };

  const handlePhotoEdit = () => {
    const url = prompt("Enter photo URL (mock):", photoUrl || "");
    if (url !== null) {
      setPhotoUrl(url || undefined);
    }
  };

  return (
    <div className="max-w-4xl p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-globe-500/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl || defaultAvatar} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={handlePhotoEdit}
            aria-label="Edit photo"
            className="absolute bottom-0 right-0 w-10 h-10 bg-globe-500 rounded-full inline-flex items-center justify-center"
            title="Edit photo"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

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

      {/* Edit Profile Form */}
      <form className="card space-y-6" onSubmit={handleSave}>
        <h2 className="text-lg font-semibold">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name" name="firstName" value={firstName} onChange={setFirstName} />
          <InputField label="Last Name" name="lastName" value={lastName} onChange={setLastName} />
          <InputField label="Email" name="email" type="email" value={email} onChange={setEmail} />
          <InputField label="Phone" name="phone" type="tel" value={phone} onChange={setPhone} />
          <InputField label="City" name="city" value={city} onChange={setCity} />
          <InputField label="Country" name="country" value={country} onChange={setCountry} />
        </div>

        <div>
          <label className="input-label block mb-2">Bio</label>
          <textarea
            className="input-field w-full rounded-md border px-3 py-2"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => {
              // reset local form to last saved user prop
              setFirstName(user.firstName || "");
              setLastName(user.lastName || "");
              setEmail(user.email || "");
              setPhone(user.phone || "");
              setCity(user.city || "");
              setCountry(user.country || "");
              setBio(user.bio || "");
              setPhotoUrl(user.photoUrl);
            }}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Preplanned Trips Section */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Preplanned Trips</h2>
        {isLoadingTrips ? (
          <div className="text-sm text-white/50">Loading trips...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} showViewButton />
            ))}
            {upcomingTrips.length === 0 && <div className="text-white/50">No upcoming trips.</div>}
          </div>
        )}
      </section>

      {/* Previous Trips Section */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Previous Trips</h2>
        {isLoadingTrips ? (
          <div className="text-sm text-white/50">Loading trips...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} showViewButton />
            ))}
            {completedTrips.length === 0 && <div className="text-white/50">No previous trips.</div>}
          </div>
        )}
      </section>

      {/* Account Settings */}
      <section className="mt-8 card">
        <h2 className="text-lg font-semibold mb-4">Account Settings</h2>

        <div className="space-y-4">
          <button
            type="button"
            onClick={() => alert("Change password (mock)")}
            className="btn-secondary w-full justify-start inline-flex items-center gap-3"
          >
            <Key /> Change Password
          </button>

          <button
            type="button"
            onClick={() => alert("Notification preferences (mock)")}
            className="btn-secondary w-full justify-start inline-flex items-center gap-3"
          >
            <Bell /> Notification Preferences
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="btn-secondary w-full justify-start inline-flex items-center gap-3 text-red-400 hover:text-red-300"
          >
            <Trash2 /> Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;