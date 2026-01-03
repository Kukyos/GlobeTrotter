import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Trip } from '../types';
import { Calendar, ArrowRight, Plus } from 'lucide-react';

interface DashboardProps {
  user: User;
  trips: Trip[];
}

const FEATURED_DESTINATIONS = [
  { name: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', tag: 'Cultural' },
  { name: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=800&auto=format&fit=crop', tag: 'Coastal' },
  { name: 'Reykjavik', country: 'Iceland', img: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=800&auto=format&fit=crop', tag: 'Adventure' },
  { name: 'Amalfi', country: 'Italy', img: 'https://images.unsplash.com/photo-1533903345306-15d1c30952de?q=80&w=800&auto=format&fit=crop', tag: 'Romantic' },
  { name: 'Banff', country: 'Canada', img: 'https://images.unsplash.com/photo-1510312305653-8ed496efbe75?q=80&w=800&auto=format&fit=crop', tag: 'Nature' },
];

const Dashboard: React.FC<DashboardProps> = ({ user, trips }) => {
  const navigate = useNavigate();
  const recentTrips = trips.slice(-3).reverse();

  // Handle destination click - navigate to create trip with destination pre-selected
  const handleDestinationClick = (destName: string) => {
    navigate(`/create-trip?destination=${encodeURIComponent(destName)}`);
  };

  // Handle Browse Atlas click - open the search overlay
  const handleBrowseAtlas = () => {
    // Trigger the global search function exposed by Navigation
    if ((window as any).openGlobeTrotterSearch) {
      (window as any).openGlobeTrotterSearch();
    }
  };

  return (
    <div className="space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Hero Section */}
      <section className="relative h-[600px] rounded-[3rem] overflow-hidden group border border-white/10 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt="Travel Hero"
          className="w-full h-full object-cover brightness-[0.4] group-hover:scale-110 transition-transform duration-[3s] ease-out"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center bg-gradient-to-t from-black via-transparent to-transparent">
          <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-bold mb-6 animate-subtle-glow">Elevate Your Journey</span>
          <h2 className="text-6xl md:text-8xl font-bold font-heading mb-6 glow-text tracking-tighter">Beyond Borders</h2>
          <p className="text-xl text-white/60 max-w-2xl font-light mb-12">
            The world is a book and those who do not travel read only one page. Start your next chapter today.
          </p>
          <Link 
            to="/create-trip" 
            className="group relative bg-white text-black px-10 py-5 rounded-full font-bold transition-all hover:bg-black hover:text-white border border-white overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Begin Exploration
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold font-heading">Curated Escapes</h3>
            <p className="text-white/40 font-light">Destinations chosen for the discerning traveler</p>
          </div>
          <button 
            onClick={handleBrowseAtlas}
            className="text-sm font-bold border-b border-white/20 hover:border-white transition-all pb-1"
          >
            Browse Atlas
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {FEATURED_DESTINATIONS.map((dest, i) => (
            <div 
              key={i} 
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 hover:border-white/40 transition-all cursor-pointer hover-lift animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
              onClick={() => handleDestinationClick(dest.name)}
            >
              <img 
                src={dest.img} 
                alt={dest.name} 
                className="absolute inset-0 w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                <span className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{dest.tag}</span>
                <h4 className="text-xl font-bold font-heading">{dest.name}</h4>
                <p className="text-xs text-white/40">{dest.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Trips Section */}
      <section className="space-y-8">
        <h3 className="text-4xl font-bold font-heading">Your Collections</h3>
        {recentTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentTrips.map((trip, i) => (
              <Link 
                key={trip.id} 
                to={`/itinerary/${trip.id}`} 
                className="block group animate-scale-in"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 glass flex flex-col hover:border-white/40 transition-all relative hover-lift">
                  <div className="absolute top-6 right-6 z-20">
                    <span className="bg-white/10 backdrop-blur-md text-[10px] px-3 py-1 rounded-full border border-white/20 font-bold uppercase tracking-widest">
                      {trip.status}
                    </span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <img 
                      src={trip.coverPhoto || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=800&auto=format&fit=crop`} 
                      alt={trip.name}
                      className="w-full h-full object-cover brightness-[0.6] group-hover:scale-105 transition-transform duration-[2s]" 
                    />
                  </div>
                  <div className="p-8 space-y-2">
                    <h4 className="text-2xl font-bold font-heading tracking-tight group-hover:glow-text transition-all">
                      {trip.name}
                    </h4>
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Calendar className="w-4 h-4" />
                      {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-80 flex flex-col items-center justify-center border border-white/10 rounded-[3rem] glass border-dashed">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
              <Plus className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-white/30 text-lg">No itineraries in your archive.</p>
            <Link to="/create-trip" className="mt-4 text-white hover:glow-text font-bold text-sm tracking-widest uppercase border-b border-white pb-1">
              Plan Now
            </Link>
          </div>
        )}
      </section>

      {/* Signature Travel Quote */}
      <section className="py-24 border-t border-white/10 text-center space-y-8">
        <div className="max-w-3xl mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/10 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C14.9124 8 14.017 7.10457 14.017 6V5C14.017 3.89543 14.9124 3 16.017 3H21.017C22.1216 3 23.017 3.89543 23.017 5V15C23.017 18.3137 20.3307 21 17.017 21H14.017ZM1.017 21L1.017 18C1.017 16.8954 1.91243 16 3.017 16H6.017C6.56928 16 7.017 15.5523 7.017 15V9C7.017 8.44772 6.56928 8 6.017 8H3.017C1.91243 8 1.017 7.10457 1.017 6V5C1.017 3.89543 1.91243 3 3.017 3H8.017C9.12157 3 10.017 3.89543 10.017 5V15C10.017 18.3137 7.33066 21 4.017 21H1.017Z" />
          </svg>
          <p className="text-3xl md:text-5xl font-heading font-bold italic leading-tight text-white/90">
            "Travel makes one modest. You see what a tiny place you occupy in the world."
          </p>
          <p className="mt-8 text-white/30 font-bold uppercase tracking-[0.4em] text-xs">— Gustave Flaubert</p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
