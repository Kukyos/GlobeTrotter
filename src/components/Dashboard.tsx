import React from 'react';
import { Link } from 'react-router-dom';
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
  const recentTrips = trips.slice(-3).reverse();

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
            onClick={() => console.log('Browse Atlas - Member C search overlay')}
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
              onClick={() => console.log(`Clicked ${dest.name} - Member C to handle`)}
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

      {/* Trending Places - User Reviews */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-4xl font-bold font-heading">Trending Now</h3>
          <p className="text-white/40 font-light">Top destinations our travelers are raving about</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Trending Place Tiles */}
          <div className="space-y-4">
            {/* Tile 1 - Large */}
            <div className="relative h-[300px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all">
              <img 
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop" 
                alt="Santorini"
                className="w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">🔥 Hot</span>
                  <span className="text-xs text-white/60">234 reviews</span>
                </div>
                <h4 className="text-3xl font-bold font-heading mb-2">Santorini</h4>
                <p className="text-sm text-white/60">Greece • Mediterranean Paradise</p>
              </div>
            </div>

            {/* Tiles 2 & 3 - Side by side */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-[200px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop" 
                  alt="Kyoto"
                  className="w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-white/60">189 reviews</span>
                  </div>
                  <h4 className="text-xl font-bold font-heading">Kyoto</h4>
                  <p className="text-xs text-white/60">Japan</p>
                </div>
              </div>

              <div className="relative h-[200px] rounded-3xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all">
                <img 
                  src="https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?q=80&w=800&auto=format&fit=crop" 
                  alt="Reykjavik"
                  className="w-full h-full object-cover brightness-[0.7] group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-white/60">156 reviews</span>
                  </div>
                  <h4 className="text-xl font-bold font-heading">Reykjavik</h4>
                  <p className="text-xs text-white/60">Iceland</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Comments Feed */}
          <div className="space-y-4">
            {/* Comment 1 */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all">
              <div className="flex items-start gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" 
                  alt="Sarah"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm">Sarah Mitchell</h4>
                      <p className="text-xs text-white/40">visited Santorini • 2 days ago</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-3">
                    Santorini exceeded all expectations! The sunset views from Oia are absolutely breathtaking. The local food was incredible and the people so warm.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors group">
                      <svg className="w-4 h-4 group-hover:fill-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">247</span>
                    </button>
                    <button className="text-xs text-white/50 hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment 2 */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all">
              <div className="flex items-start gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" 
                  alt="James"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm">James Chen</h4>
                      <p className="text-xs text-white/40">visited Kyoto • 5 days ago</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-3">
                    Kyoto's temples and traditional gardens are like stepping into another world. The cherry blossoms were in full bloom - pure magic.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors group">
                      <svg className="w-4 h-4 group-hover:fill-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">189</span>
                    </button>
                    <button className="text-xs text-white/50 hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment 3 */}
            <div className="glass border border-white/10 rounded-3xl p-6 space-y-4 hover:border-white/20 transition-all">
              <div className="flex items-start gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" 
                  alt="Emma"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm">Emma Rodriguez</h4>
                      <p className="text-xs text-white/40">visited Reykjavik • 1 week ago</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-3">
                    Iceland's natural beauty is unreal! Saw the Northern Lights, bathed in hot springs, and explored ice caves. Worth every penny!
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors group">
                      <svg className="w-4 h-4 group-hover:fill-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">156</span>
                    </button>
                    <button className="text-xs text-white/50 hover:text-white transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            </div>

            {/* View More Button */}
            <Link 
              to="/community"
              className="w-full py-4 rounded-2xl border border-white/20 hover:border-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 font-medium text-sm group"
            >
              View All Reviews in Community
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
