import { createContext, useState, useContext } from 'react';

const DropdownContext = createContext();

export const DropdownProvider = ({ children }) => {
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

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  // Si el provider no está presente, devolvemos valores por defecto y una función vacía.
  if (context === undefined) {
    return {
      dropdownActive: { services: false, tramites: false },
      setDropdownActive: () => {},
    };
  }
  return context;
};
