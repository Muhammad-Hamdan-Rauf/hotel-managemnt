import React, { useState, useEffect, useMemo } from 'react';
import { 
  createBrowserRouter, 
  RouterProvider, 
  Route,
  createRoutesFromElements, 
  Navigate,
  Outlet 
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Login from './receptionistpages/Login';
import GuestManagement from './receptionistpages/GuestManagment';
import ReceptionistDashboard from './receptionistpages/ReceptionistDashboard';
import Signup from './receptionistpages/Signup';
import RootLayout from './receptionistpages/RootLayout'; // New component for layout
import RoomManagement from './receptionistpages/RoomManagement';
import CheckIn from './receptionistpages/CheckIn';
import CheckOut from './receptionistpages/CheckOut';
import BookingManagment from './receptionistpages/BookingManagment';
import ServiceRequestManagement from './receptionistpages/ServicesRequest';
// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, loading }) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated 
    ? children 
    : <Navigate to="/login" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const checkToken = () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);

          if (decodedToken.exp && decodedToken.exp < currentTime) {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
          } else {
            setIsAuthenticated(true);
            setUserInfo({
              userId: decodedToken.userId,
              name: decodedToken.name,
            });
          }
        } catch (error) {
          console.error('Invalid Token:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkToken();

    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  const router = useMemo(() => 
    createBrowserRouter([
      {
        path: '/',
        element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: <Login setAuth={setIsAuthenticated} />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/dashboard',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <ReceptionistDashboard />
              </ProtectedRoute>
            ),
          },
          {
            path: 'checkIN',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <CheckIn />
              </ProtectedRoute>
            ),
          },
          
          {
            path: 'checkout',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <CheckOut />
              </ProtectedRoute>
            ),
          },
          {
            path: 'guest-management',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <GuestManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: 'rooms-management',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <RoomManagement />
              </ProtectedRoute>
            ),
          },
          {
            path: 'booking-management',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <BookingManagment />
              </ProtectedRoute>
            ),
          },
          
          {
            path: 'ServiceRequest-management',
            element: (
              <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
                <ServiceRequestManagement />
              </ProtectedRoute>
            ),
          },
          // You can add more nested routes here
        ],
      },
    ]), [isAuthenticated, loading]);

  return <RouterProvider router={router} />;
};

export default App;