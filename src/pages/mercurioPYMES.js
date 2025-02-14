// pages/mercurioSGDEA.js
import React from 'react';
import { FaCalendarAlt, FaRegCalendarAlt } from 'react-icons/fa';

const MercurioPYMES = () => {
  return (
    <div className="min-h-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-around gap-4">
        {/* Sección Izquierda: Párrafos */}
        <div className="w-full md:w-[35%]">
          <div className="text-center md:text-left">
            <p className="mb-4 leading-relaxed text-gray-700">
              Mercurio PYMES es un software de gestión electrónica de documentos diseñado para estructurar y almacenar la información de pequeñas y medianas empresas, disminuyendo costos y propiciando un ambiente intuitivo y amigable que garantice el éxito en la gestión documental.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700">
              Con Mercurio PYMES podrás crear expedientes, indexar todos los tipos de documentos que PRODUCE tu empresa y, sobre todo, conservarlos en un SÓLO LUGAR sin disminuir el riesgo de pérdida y eliminando el riesgo de quedarte sin espacio suficiente.
            </p>
          </div>
        </div>

        {/* Sección Derecha: Formulario */}
        <div className="w-full md:w-[35%]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
              ¡ADQUIERELO AHORA!
            </h2>
            <div className="flex flex-col gap-4">
              {/* Bloque de Datos Personales */}
              <div className="flex flex-col space-y-4">
                <input 
                  type="text" 
                  placeholder="Nombre:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input 
                  type="text" 
                  placeholder="Apellido:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input 
                  type="text" 
                  placeholder="Entidad y/o empresa:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input 
                  type="email" 
                  placeholder="E_MAIL:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input 
                  type="tel" 
                  placeholder="Teléfono celular:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              {/* Bloque para Ubicación y Botón */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-teal-600 mb-2">¿Estás ubicado en?</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Columna izquierda: Inputs */}
                  <div className="flex flex-col space-y-2 md:w-1/2">
                    <input 
                      type="text" 
                      placeholder="Bogotá" 
                      className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input 
                      type="text" 
                      placeholder="Medellín" 
                      className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {/* Columna derecha: Botón */}
                  <div className="md:w-1/2 flex items-end">
                    <button className="w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600">
                      Enviar
                    </button>
                  </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercurioPYMES;
