import { createContext, useState, useContext, useEffect } from 'react';

const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
  // Inicializamos con un objeto con las propiedades necesarias
  const [dropdownActive, setDropdownActive] = useState({
    services: false,
    tramites: false,
  });

  return (
    <DropdownContext.Provider value={{ dropdownActive, setDropdownActive }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => useContext(DropdownContext);
