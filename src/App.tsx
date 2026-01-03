import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User, Trip } from '@/types';
import { LoginScreen, RegisterScreen } from '@/pages';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';

/**
 * App Component
 * 
 * Main application entry point with routing.
 * Handles authentication state and route protection.
 */
function App() {
  // Authentication state - persisted in localStorage
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('globetrotter_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Trips state - mock data for now, will be fetched from API
  const [trips, setTrips] = useState<Trip[]>([]);

  // Persist user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('globetrotter_user', JSON.stringify(currentUser));
      // TODO: Fetch user's trips from API
      // For now, using empty array
      setTrips([]);
    } else {
      localStorage.removeItem('globetrotter_user');
      setTrips([]);
    }
  }, [currentUser]);

  // Auth handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation - shows on all authenticated pages */}
        {currentUser && <Navigation user={currentUser} onLogout={handleLogout} />}
        
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
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              currentUser ? (
                <div className="max-w-7xl mx-auto px-6 py-24">
                  <Dashboard user={currentUser} trips={trips} />
                </div>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          
          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
