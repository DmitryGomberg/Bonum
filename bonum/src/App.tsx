import React, { createContext, useContext, useState, ReactNode } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/login'
import {RegisterPage} from "./pages/registration";
import {HomePage} from "./pages/home";

interface AuthContextType {
   isAuthenticated: boolean
   login: () => void
   logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false)

   const login = () => setIsAuthenticated(true)
   const logout = () => setIsAuthenticated(false)

   return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => {
   const context = useContext(AuthContext)
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider')
   }
   return context
}

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
   const { isAuthenticated } = useAuth()
   return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

const App: React.FC = () => {
   return (
      <AuthProvider>
         <Router>
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
      </AuthProvider>
   )
}

export default App