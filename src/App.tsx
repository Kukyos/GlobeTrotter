import AdminPanel from "./pages/AdminPanel";
import ProfileSettings from "./pages/ProfileSettings";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { LoginScreen, RegisterScreen } from '@/pages';

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

  // Persist user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('globetrotter_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('globetrotter_user');
    }
  }, [currentUser]);

  // Auth handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

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
      </div>
    </Router>
  );
}

export default App;
