import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Trip } from '@/types';
import { LoginScreen, RegisterScreen, CreateTrip, MyTrips, ItineraryBuilder, ItineraryView, Calendar, ProfileSettings, TermsOfService } from '@/pages';
import AdminPanel from '@/pages/AdminPanel';
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
  ease: "easeInOut" as const
};

// Animated Routes wrapper component
function AnimatedRoutes({ 
  currentUser, 
  trips, 
  setTrips, 
  setUser,
  handleLogin, 
  handleLogout 
}: { 
  currentUser: User | null;
  trips: Trip[];
  setTrips: React.Dispatch<React.SetStateAction<Trip[]>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

        {/* Terms of Service - Public route */}
        <Route 
          path="/terms" 
          element={
            <motion.div 
              className="max-w-7xl mx-auto px-6 py-24"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TermsOfService />
            </motion.div>
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

        <Route 
          path="/calendar" 
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
                <Calendar trips={trips} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route 
          path="/profile" 
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
                <ProfileSettings user={currentUser} setUser={setUser} />
              </motion.div>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route 
          path="/admin" 
          element={
            currentUser?.role === 'admin' ? (
              <motion.div 
                className="max-w-7xl mx-auto px-6 py-24"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AdminPanel user={currentUser} />
              </motion.div>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } 
        />

        <Route 
          path="/community" 
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
                <Community user={currentUser} />
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

const AUTH_TIMEOUT = 8000; // 8 seconds
const TRIPS_TIMEOUT = 10000; // 10 seconds

function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Trips state
  const [trips, setTrips] = useState<Trip[]>([]);

  // Check for existing session on mount with timeout
  useEffect(() => {
    let isMounted = true;
    let sessionCheckComplete = false;
    
    const checkSession = async () => {
      try {
        // Get user with timeout
        const user = await withTimeout(
          getCurrentUser(),
          AUTH_TIMEOUT,
          null
        );
        
        if (!isMounted) return;
        sessionCheckComplete = true;
        
        if (user) {
          setCurrentUser(user);
          // Fetch trips with timeout - don't block on this
          withTimeout(
            getTrips(),
            TRIPS_TIMEOUT,
            { trips: [], error: 'Timeout loading trips' }
          ).then(({ trips: userTrips }) => {
            if (isMounted) setTrips(userTrips as any);
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Session check failed:', err);
        if (isMounted) {
          sessionCheckComplete = true;
          setIsLoading(false);
        }
      }
    };

    // Fallback timeout - ensure we never load forever (only if check hasn't completed)
    const fallbackTimer = setTimeout(() => {
      if (isMounted && !sessionCheckComplete) {
        console.log('Fallback timeout triggered - session check incomplete');
        setIsLoading(false);
      }
    }, AUTH_TIMEOUT + 3000);

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const user = await withTimeout(getCurrentUser(), AUTH_TIMEOUT, null);
        if (user && isMounted) {
          setCurrentUser(user);
          const { trips: userTrips } = await withTimeout(
            getTrips(),
            TRIPS_TIMEOUT,
            { trips: [], error: null }
          );
          if (isMounted) setTrips(userTrips as any);
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setCurrentUser(null);
          setTrips([]);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
      subscription.unsubscribe();
    };
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

  // Show loading state
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

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={
              currentUser 
                ? <Navigate to="/dashboard" replace /> 
                : <LoginScreen onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              currentUser 
                ? <Navigate to="/dashboard" replace /> 
                : <RegisterScreen onLogin={handleLogin} />
            } 
          />
          <Route
            path="/profile"
            element={
              <ProfileSettings
                user={currentUser}
                setUser={setCurrentUser}  />
            }
          />
          <Route
            path="/admin"
            element={<AdminPanel user={currentUser} />}
          />


          
          {/* Protected routes - placeholder for now */}
          <Route 
            path="/dashboard" 
            element={
              currentUser ? (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-display font-bold mb-4">
                      Welcome, {currentUser.firstName}! 🌍
                    </h1>
                    <p className="text-white/50 mb-6">
                      Dashboard coming soon...
                    </p>
                    <button
                      onClick={handleLogout}
                      className="btn-secondary"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* Navigation - shows on all authenticated pages */}
        {currentUser && <Navigation user={currentUser} onLogout={handleLogout} />}
        
        <AnimatedRoutes 
          currentUser={currentUser}
          trips={trips}
          setTrips={setTrips}
          setUser={setCurrentUser}
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
