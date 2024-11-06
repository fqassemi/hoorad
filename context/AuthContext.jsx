'use client';

import { createContext, useState, useContext, useMemo } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
   const [userInfo, setUserInfo] = useState({});

   const value = useMemo(() => ({ userInfo, setUserInfo }), [userInfo]);

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
