// components/Loading.js
import React from 'react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      {/* Spinner animado */}
      <div className="w-20 h-20 border-8 border-t-teal-500 border-gray-200 rounded-full animate-spin"></div>
      {/* Texto con efecto pulsante */}
      <span className="text-2xl font-extrabold text-teal-600 animate-pulse">
        Cargando...
      </span>
    </div>
  );
};

export default Loading;
