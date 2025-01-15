'use client';

import { createContext, useState, useContext, useMemo } from 'react';

// Cookies
import { getCookie } from 'cookies-next';

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const checkLoginToken = getCookie('courses_isLogin') || false;

   const [isLogin, setIsLogin] = useState(checkLoginToken);

   const value = useMemo(
      () => ({
         isLogin,
         setIsLogin,
      }),
      [isLogin]
   );

   const [user, setUser] = useState(null); // { phone: "09102301234", isAdmin: true }

  const login = (phone) => {
    const isAdmin = phone === '09123456789';
    setUser({ phone, isAdmin });
    document.cookie = `token=${phone}; path=/;`; // Save as a cookie for middleware
  };

  const logout = () => {
    setUser(null);
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  };

   return <AuthContext.Provider value={{value,user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
