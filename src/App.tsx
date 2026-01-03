import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Trip } from '@/types';
import { LoginScreen, RegisterScreen, CreateTrip, MyTrips, ItineraryBuilder, ItineraryView } from '@/pages';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Community from '@/components/Community';
import TravelChatbot from '@/components/TravelChatbot';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, signOut, getTrips } from '@/services/supabaseService';

/**
 * App Component
 * 
 * Main application entry point with routing.
 * Handles authentication state and route protection.
 */

// Page transition animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut"
};

// Animated Routes wrapper component
function AnimatedRoutes({ 
  currentUser, 
  trips, 
  setTrips, 
  handleLogin, 
  handleLogout 
}: { 
  currentUser: User | null;
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  handleLogin: (user: User) => void;
  handleLogout: () => void;
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            currentUser 
              ? <Navigate to="/dashboard" replace /> 
              : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <LoginScreen onLogin={handleLogin} />
                </motion.div>
              )
          } 
        />
        <Route 
          path="/register" 
          element={
            currentUser 
              ? <Navigate to="/dashboard" replace /> 
              : (
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <RegisterScreen onLogin={handleLogin} />
                </motion.div>
              )
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            currentUser ? (
              <motion.div 
                className="max-w-7xl mx-auto px-6 py-24"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Dashboard user={currentUser} trips={trips} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/community" 
          element={
            currentUser ? (
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Community user={currentUser} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/create-trip" 
          element={
            currentUser ? (
              <motion.div 
                className="max-w-7xl mx-auto px-6 py-24"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <CreateTrip userId={currentUser.id} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/my-trips" 
          element={
            currentUser ? (
              <motion.div 
                className="max-w-7xl mx-auto px-6 py-24"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <MyTrips trips={trips} setTrips={setTrips} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/itinerary/:tripId" 
          element={
            currentUser ? (
              <motion.div 
                className="max-w-7xl mx-auto px-6 py-24"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ItineraryView tripId="" />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/itinerary/:tripId/builder" 
          element={
            currentUser ? (
              <motion.div 
                className="max-w-7xl mx-auto px-6 py-24"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <ItineraryBuilder tripId="" />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// Timeout helper for async operations
const withTimeout = <T,>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms))
  ]);
};

const AUTH_TIMEOUT = 5000; // 5 seconds
const TRIPS_TIMEOUT = 8000; // 8 seconds

function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Trips state
  const [trips, setTrips] = useState<Trip[]>([]);

  // Check for existing session on mount with timeout
  useEffect(() => {
    // Disabled Supabase auth - using local MySQL backend
    setIsLoading(false);
    setLoadingError(null);
    
    // Supabase auth commented out - will be restored when Supabase is configured
    // let isMounted = true;
    // const checkSession = async () => { ... };
    // const fallbackTimer = setTimeout(() => { ... }, AUTH_TIMEOUT + 2000);
    // checkSession();
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(...);
    // return () => { isMounted = false; clearTimeout(fallbackTimer); subscription.unsubscribe(); };
  }, []);


  // Auth handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    // Fetch trips after login
    getTrips().then(({ trips: userTrips }) => setTrips(userTrips as any));
  };

  const handleLogout = async () => {
    await signOut();
    setCurrentUser(null);
    setTrips([]);
  };

  // Show loading state with timeout fallback
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/50">Loading...</p>
          <p className="text-white/30 text-sm mt-2">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (loadingError) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">Connection Issue</h2>
          <p className="text-white/50 mb-6">{loadingError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation - shows on all authenticated pages */}
        {currentUser && <Navigation user={currentUser} onLogout={handleLogout} />}
        
        <AnimatedRoutes 
          currentUser={currentUser}
          trips={trips}
          setTrips={setTrips}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />

        {/* Chatbot - only shows when logged in */}
        {currentUser && <TravelChatbot />}
      </div>
    </Router>
  );
}

export default App;
