import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FlightProvider } from './context/FlightContext';
import { BookingProvider } from './context/BookingContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { FlightResults } from './pages/FlightResults';
import { Booking } from './pages/Booking';
import { Payment } from './pages/Payment';
import { Confirmation } from './pages/Confirmation';
import { MyBookings } from './pages/MyBookings';

// Admin Pages
import { AdminDashboard } from './pages/Admin/Dashboard';
import { AdminFlights } from './pages/Admin/Flights';

// Staff Pages
import { StaffDashboard } from './pages/Staff/Dashboard';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Public Route - redirects authenticated users
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/flights" element={<Layout><FlightResults /></Layout>} />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } 
      />

      {/* Protected Passenger Routes */}
      <Route 
        path="/booking" 
        element={
          <ProtectedRoute allowedRoles={['passenger', 'admin', 'staff']}>
            <Booking />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment" 
        element={
          <ProtectedRoute allowedRoles={['passenger', 'admin', 'staff']}>
            <Payment />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/confirmation" 
        element={
          <ProtectedRoute allowedRoles={['passenger', 'admin', 'staff']}>
            <Confirmation />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-bookings" 
        element={
          <ProtectedRoute allowedRoles={['passenger', 'admin', 'staff']}>
            <Layout><MyBookings /></Layout>
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/flights" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminFlights />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/airports" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/analytics" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Staff Routes */}
      <Route 
        path="/staff" 
        element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StaffDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <FlightProvider>
          <BookingProvider>
            <AppRoutes />
          </BookingProvider>
        </FlightProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
