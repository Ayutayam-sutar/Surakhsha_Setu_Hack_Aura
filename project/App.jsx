import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { TrainingProvider } from './contexts/TrainingContext';
import { SidebarProvider } from './contexts/SidebarContext';
import axios from 'axios'; 

// Import Components and Pages
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SafetyCheckPage } from './pages/SafetyCheckPage';
import { TrainingHubPage } from './pages/TrainingHubPage';
import { TrainingModulePage } from './pages/TrainingModulePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import 'leaflet/dist/leaflet.css';
import { Role } from './types';

// --- MODIFIED: This component is now aware of the loading state ---
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // Get the loading state
  const location = useLocation();

  // 1. While the AuthContext is loading, show a loading indicator
  if (loading) {
    return <div>Loading session...</div>;
  }

  // 2. After loading, if there's no user, redirect to the landing page
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // 3. If the user's role is not allowed, redirect to their default dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const defaultPath = user.role === 'ADMIN' ? '/admin' : '/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  // 4. If everything is fine, render the requested page
  return <Outlet />;
};

// ... (MainLayout and DashboardLayout are unchanged)
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow bg-neutral-light">
      <Outlet />
    </main>
  </div>
);

// Layout for the main application dashboard which includes the Sidebar
const DashboardLayout = () => (
    <div className="flex min-h-screen bg-neutral-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-grow">
            <Outlet />
        </main>
      </div>
    </div>
);


// --- IMPORTANT: We need to structure the providers and router correctly ---
// This new component will contain our routes, ensuring `useAuth` works correctly.
const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
            </Route>

            {/* Protected Routes */}
         
<Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.USER, Role.VOLUNTEER, 'ADMIN', 'USER', 'VOLUNTEER']} />}>
                <Route element={<DashboardLayout />}>
                  
<Route path="/dashboard" element={<DashboardRedirect />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/safety-check" element={<SafetyCheckPage />} />
                    <Route path="/training" element={<TrainingHubPage />} />
                    <Route path="/training/:moduleId" element={<TrainingModulePage />} />
                </Route>
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, 'ADMIN']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

// ADD THIS NEW COMPONENT
const DashboardRedirect = () => {
  const { user } = useAuth();

  // If the user is an ADMIN, redirect them to the /admin page.
  if (user && (user.role === 'ADMIN' || user.role === Role.ADMIN)) {
    return <Navigate to="/admin" replace />;
  }

  // Otherwise, show the normal user/volunteer dashboard.
  return <DashboardPage />;
};

// The main App component now focuses on providing context and rendering the router
const App = () => {
  return (
    <AuthProvider>
      <TrainingProvider>
        <SidebarProvider>
          <HashRouter>
            <AppRoutes /> {/* Render the routes component */}
          </HashRouter>
        </SidebarProvider>
      </TrainingProvider>
    </AuthProvider>
  );
};

export default App;