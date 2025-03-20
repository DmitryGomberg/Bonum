import React, { ReactNode } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/registration';
import { HomePage } from './pages/home';
import {NotificationsProvider} from "./context/notifications.tsx";
import {Notification} from "./components/notification";
import {AuthProvider, useAuth } from './context/auth.tsx';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
   const { isAuthenticated } = useAuth();
   return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
   return (
      <AuthProvider>
         <NotificationsProvider>
            <Router>
               <Notification />
               <Routes>
                  <Route path="/registration" element={<RegisterPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route
                     path="/home"
                     element={
                        <ProtectedRoute>
                           <HomePage />
                        </ProtectedRoute>
                     }
                  />
                  <Route path="/" element={<Navigate to="/login" />} />
               </Routes>
            </Router>
         </NotificationsProvider>
      </AuthProvider>
   );
};

export default App;