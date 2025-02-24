import React from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useRouter } from 'next/router';

const RadicadoExitoso = () => {
  const router = useRouter();
  // Extraemos los datos pasados por query
  const { nombre, fecha, observaciones, documentInfo, radicado } = router.query;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <FaThumbsUp className="text-green-600 text-6xl mb-4" />
        <h1 className="text-3xl font-bold text-teal-600 mb-4">Radicación Exitosa</h1>
        <p className="text-lg mb-2">
          Radicado: <span className="font-semibold">{radicado}</span>
        </p>
        <p className="text-lg mb-2">
          Radicado por: <span className="font-semibold">{nombre}</span>
        </p>
        <p className="text-lg mb-2">
          Fecha agendada: <span className="font-semibold">{fecha}</span>
        </p>
        <p className="text-lg mb-4">
          Observaciones: <span className="font-semibold">{observaciones}</span>
        </p>
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-2">Información del Formulario</h2>
          <pre className="bg-gray-100 p-4 rounded text-left text-sm">
            {documentInfo}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default RadicadoExitoso;
