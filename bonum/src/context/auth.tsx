import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";

interface AuthContextType {
   isAuthenticated: boolean;
   accessToken: string | null;
   login: (token: string) => void;
   logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
      return token !== undefined;
   });
   const [accessToken, setAccessToken] = useState<string | null>(() => {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
      return token ? token.split('=')[1] : null;
   });

   useEffect(() => {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
      if (token) {
         console.log('Token is present:', token.split('=')[1]);
      } else {
         console.log('Token is not present');
      }
   }, []);

   const login = (token: string) => {
      setIsAuthenticated(true);
      setAccessToken(token);
      document.cookie = `accessToken=${token}; path=/;`;
   };

   const logout = () => {
      setIsAuthenticated(false);
      setAccessToken(null);
      document.cookie = 'accessToken=; Max-Age=0; path=/;';
      document.cookie = 'refreshToken=; Max-Age=0; path=/;';
   };

   return (
      <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};