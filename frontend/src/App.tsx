import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import History from './pages/History';
import Profile from './pages/Profile';


// 1. Protected route component — blocks access if not logged in
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    // wait until localStorage check is done before deciding
    if (loading) return <div>Loading...</div>;

    // if no user, redirect to login
    if (!user) return <Navigate to="/login" replace />;

    // if user exists, render the actual page
    return <>{children}</>;
};

// 2. Main app routes
const AppRoutes = () => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    return (
        <Routes>
            {/* if already logged in, redirect / to /home */}
            <Route path="/" element={<Navigate to={user ? "/home" : "/login"} replace />} />

            {/* public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />

            {/* protected routes */}
            <Route path="/home" element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            } />
            <Route path="/history" element={
                <ProtectedRoute>
                    <History />
                </ProtectedRoute>
            } />
        </Routes>
    );
};

// 3. Root component — wraps everything in AuthProvider and Router
const App = () => {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
};

export default App;