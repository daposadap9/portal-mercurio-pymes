// contexts/UserContext.js
import React, { createContext, useState } from 'react';

// Creamos el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  // Estado inicial del usuario, puede ser null o un objeto con datos por defecto
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
