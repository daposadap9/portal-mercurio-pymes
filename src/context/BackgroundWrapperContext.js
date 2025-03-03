// components/BackgroundWrapper.js
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext'; // Ajusta la ruta

const BackgroundWrapper = ({ children }) => {
  const { theme } = useContext(ThemeContext);

  // Define la clase de fondo según el valor del tema
  const bgClass =
    theme === 'dark'
      ? 'bg-custom-gradient'
      : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';

  return <div className={`${bgClass} w-full h-full`}>{children}</div>;
};

export default BackgroundWrapper;
