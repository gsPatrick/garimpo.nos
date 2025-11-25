'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // 1. COMEÇA DESLOGADO (null)
  const [user, setUser] = useState(null);

  // CORREÇÃO: Agora a função aceita tanto um objeto {name, email} quanto apenas o email string
  const login = (userData) => {
    if (typeof userData === 'string') {
      // Se veio só o email (string), preenche um nome padrão
      setUser({ name: "Street Member", email: userData });
    } else {
      // Se veio o objeto completo { name, email }, usa ele
      setUser(userData);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}