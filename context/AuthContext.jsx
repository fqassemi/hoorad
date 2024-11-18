'use client';

import { createContext, useState, useContext, useMemo } from 'react';

// Cookies
import { getCookie } from 'cookies-next';

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const checkLoginToken = getCookie('courses_isLogin') || false;

   const [userInfo, setUserInfo] = useState({});
   const [isLogin, setIsLogin] = useState(checkLoginToken);

   const value = useMemo(
      () => ({
         userInfo,
         setUserInfo,
         isLogin,
         setIsLogin,
      }),
      [userInfo, isLogin]
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
