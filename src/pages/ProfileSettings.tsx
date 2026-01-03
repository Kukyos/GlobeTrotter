import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Camera, Key, Bell, Trash2, Loader2, Save, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import { User, Trip } from "../types";
import { getTrips, updateProfile, signOut } from "../services/supabaseService";
import { supabase } from "../lib/supabase";

/**
 * ProfileSettings.tsx
 *
 * - Profile header with avatar + camera edit button
 * - Editable form initialized from user prop
 * - Preplanned Trips (upcoming) and Previous Trips (completed)
 * - Account settings card with Change Password, Notifications, Delete Account
 */

/* ---------------- Helpers ---------------- */
const defaultAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=60";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
};

/* ---------------- Input Field Component ---------------- */
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
      className="input-field w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

/* ---------------- Trip Card Component ---------------- */
const TripCard: React.FC<{ trip: any; showViewButton?: boolean }> = ({ trip, showViewButton = false }) => {
  const coverPhoto = trip.cover_photo || trip.coverPhoto;
  const startDate = trip.start_date || trip.startDate;
  const endDate = trip.end_date || trip.endDate;
  const totalBudget = trip.total_budget || trip.totalBudget;
  
  return (
    <div className="card border border-white/10 rounded-xl p-4 flex flex-col hover:border-white/20 transition-all">
      <div className="w-full h-36 rounded-lg overflow-hidden bg-white/5 mb-3">
        {coverPhoto ? (
          <img src={coverPhoto} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
            <MapPin className="w-8 h-8 text-white/20" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-white">{trip.name}</h3>
      <p className="text-sm text-white/50 mt-1">
        {formatDate(startDate)} - {formatDate(endDate)}
      </p>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div className="text-sm text-white/50">${totalBudget ?? "—"}</div>
        {showViewButton && (
          <Link to={`/itinerary/${trip.id}`} className="btn-secondary text-sm px-3 py-1">
            View
          </Link>
        )}
      </div>
    </div>
  );
};

/* ---------------- Main ProfileSettings Component ---------------- */
interface ProfileSettingsProps {
  user: User;
  setUser: (user: User | null) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  
  // Parse name into first/last
  const nameParts = (user.name || '').split(' ');
  const defaultFirstName = user.firstName || nameParts[0] || '';
  const defaultLastName = user.lastName || nameParts.slice(1).join(' ') || '';
  
  // Form state
  const [firstName, setFirstName] = useState<string>(defaultFirstName);
  const [lastName, setLastName] = useState<string>(defaultLastName);
  const [email, setEmail] = useState<string>(user.email || "");
  const [phone, setPhone] = useState<string>(user.phone || "");
  const [city, setCity] = useState<string>(user.city || "");
  const [country, setCountry] = useState<string>(user.country || "");
  const [bio, setBio] = useState<string>(user.bio || "");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user.photoUrl || user.avatar);
  
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [trips, setTrips] = useState<any[]>([]);
  const [isLoadingTrips, setIsLoadingTrips] = useState<boolean>(true);

  // Load user's trips
  useEffect(() => {
    let mounted = true;
    setIsLoadingTrips(true);
    
    getTrips().then(({ trips: userTrips, error }) => {
      if (!mounted) return;
      if (!error && userTrips) {
        setTrips(userTrips);
      }
      setIsLoadingTrips(false);
    });
    
    return () => { mounted = false; };
  }, [user.id]);

  // Re-sync form when user prop changes
  useEffect(() => {
    const nameParts = (user.name || '').split(' ');
    setFirstName(user.firstName || nameParts[0] || '');
    setLastName(user.lastName || nameParts.slice(1).join(' ') || '');
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setCity(user.city || "");
    setCountry(user.country || "");
    setBio(user.bio || "");
    setPhotoUrl(user.photoUrl || user.avatar);
  }, [user]);

  const upcomingTrips = trips.filter((t) => t.status === "upcoming" || t.status === "ongoing" || t.status === "draft");
  const completedTrips = trips.filter((t) => t.status === "completed");

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!firstName.trim() || !email.trim()) {
      setSaveMessage("Please fill in required fields (name, email).");
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await updateProfile(user.id, {
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        avatar_url: photoUrl,
      });

      if (error) {
        setSaveMessage(`Error: ${error}`);
      } else {
        // Update parent state
        setUser({
          ...user,
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          photoUrl,
          phone: phone.trim(),
          city: city.trim(),
          country: country.trim(),
          bio: bio.trim(),
        });
        setSaveMessage("Profile updated successfully!");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (err: any) {
      setSaveMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Delete your account? This action cannot be undone.")) return;
    
    try {
      // Sign out (actual deletion would need server-side)
      await signOut();
      setUser(null);
      navigate('/');
    } catch (err) {
      alert("Failed to delete account. Please try again.");
    }
  };

  const handlePhotoEdit = () => {
    const url = prompt("Enter photo URL:", photoUrl || "");
    if (url !== null) {
      setPhotoUrl(url || undefined);
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-xl">
            <img 
              src={photoUrl || defaultAvatar} 
              alt="Profile" 
              className="w-full h-full object-cover" 
              onError={(e) => { (e.target as HTMLImageElement).src = defaultAvatar; }}
            />
          </div>
          <button
            onClick={handlePhotoEdit}
            aria-label="Edit photo"
            className="absolute bottom-0 right-0 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-white/90 transition-colors shadow-lg"
            title="Edit photo"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-display font-bold text-white">
            {firstName} {lastName}
          </h1>
          <p className="text-white/50">{email}</p>
          <span className="inline-block mt-2 px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm border border-white/10">
            {user.role}
          </span>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form className="card p-6 space-y-6" onSubmit={handleSave}>
        <h2 className="text-lg font-semibold text-white">Personal Information</h2>

        {saveMessage && (
          <div className={`p-3 rounded-lg text-sm ${saveMessage.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="First Name *" name="firstName" value={firstName} onChange={setFirstName} />
          <InputField label="Last Name" name="lastName" value={lastName} onChange={setLastName} />
          <InputField label="Email *" name="email" type="email" value={email} onChange={setEmail} />
          <InputField label="Phone" name="phone" type="tel" value={phone} onChange={setPhone} />
          <InputField label="City" name="city" value={city} onChange={setCity} />
          <InputField label="Country" name="country" value={country} onChange={setCountry} />
        </div>

        <div>
          <label className="input-label block mb-2">Bio</label>
          <textarea
            className="input-field w-full resize-none"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write a short bio about yourself..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={isSaving}>
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => {
              const nameParts = (user.name || '').split(' ');
              setFirstName(user.firstName || nameParts[0] || '');
              setLastName(user.lastName || nameParts.slice(1).join(' ') || '');
              setEmail(user.email || "");
              setPhone(user.phone || "");
              setCity(user.city || "");
              setCountry(user.country || "");
              setBio(user.bio || "");
              setPhotoUrl(user.photoUrl || user.avatar);
            }}
            className="btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Upcoming Trips Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Upcoming Trips</h2>
          <Link to="/create-trip" className="text-sm text-white/50 hover:text-white transition-colors">
            + New Trip
          </Link>
        </div>
        {isLoadingTrips ? (
          <div className="flex items-center gap-2 text-white/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading trips...
          </div>
        ) : upcomingTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} showViewButton />
            ))}
          </div>
        ) : (
          <div className="text-white/50 text-center py-8 card">
            No upcoming trips. <Link to="/create-trip" className="text-white underline">Plan one now!</Link>
          </div>
        )}
      </section>

      {/* Previous Trips Section */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Previous Trips</h2>
        {isLoadingTrips ? (
          <div className="flex items-center gap-2 text-white/50">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading trips...
          </div>
        ) : completedTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} showViewButton />
            ))}
          </div>
        ) : (
          <div className="text-white/50 text-center py-8 card">
            No completed trips yet.
          </div>
        )}
      </section>

      {/* Account Settings */}
      <section className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Account Settings</h2>

        <div className="space-y-3">
          <button
            type="button"
            onClick={() => alert("Password change coming soon!")}
            className="btn-secondary w-full justify-start flex items-center gap-3"
          >
            <Key className="w-4 h-4" /> Change Password
          </button>

          <button
            type="button"
            onClick={() => alert("Notification preferences coming soon!")}
            className="btn-secondary w-full justify-start flex items-center gap-3"
          >
            <Bell className="w-4 h-4" /> Notification Preferences
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="btn-secondary w-full justify-start flex items-center gap-3 text-red-400 hover:text-red-300 hover:border-red-500/30"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfileSettings;
