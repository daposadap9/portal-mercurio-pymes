// pages/mercurioSGDEA.js
import React from 'react';
import { FaCalendarAlt, FaRegCalendarAlt } from 'react-icons/fa';

const MercurioDigitalizacion = () => {
  return (
    <div className="min-h-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-around gap-4">
        {/* Sección Izquierda: Párrafos */}
        <div className="w-full md:w-[35%]">
          <div className="text-center md:text-left">
            <p className="mb-4 leading-relaxed text-gray-700 text-base font-normal">
              Con Servisoft S.A. dile adiós al papel desordenado y al riesgo de pérdida. Con nuestra digitalización documental, toda tu información estará organizada y protegida.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700 text-base font-normal">
              La seguridad, accesibilidad y eficiencia en un sólo servicio. Digitalizamos tu archivo físico para que trabajes sin límites.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700 text-base font-normal">
              Te apoyamos con el cumplimiento de normativas legales y protegemos tu información con copias digitales seguras y respaldadas.
            </p>
          </div>
        </div>

        {/* Sección Derecha: Formulario */}
        <div className="w-full md:w-[35%]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
              ¡Adquiérelo ahora!
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
                  placeholder="E-mail:" 
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
                <h3 className="text-lg font-bold text-teal-600 mb-2">Conoce el valor de tu inversión</h3>
                <div className="flex flex-col gap-4">
                  {/* Aquí definimos los botones animados */}
                  <style jsx>{`
                    @keyframes wave {
                      0% { transform: translateX(-5%); }
                      50% { transform: translateX(5%); }
                      100% { transform: translateX(-5%); }
                    }
                  `}</style>
                  <button 
                    className="w-full p-2 rounded-md text-white font-bold transition-all duration-300 hover:scale-105 bg-blue-500"
                    style={{ 
                      animation: 'wave 2s ease-in-out infinite',
                      animationDelay: '0s'
                    }}
                  >
                    Desde 0 hasta 5 cajas - $210.000
                  </button>
                  <button 
                    className="w-full p-2 rounded-md text-white font-bold transition-all duration-300 hover:scale-105 bg-purple-500"
                    style={{ 
                      animation: 'wave 2s ease-in-out infinite',
                      animationDelay: '0.2s'
                    }}
                  >
                    Desde 6 hasta 10 cajas - $384.000
                  </button>
                  <button 
                    className="w-full p-2 rounded-md text-white font-bold transition-all duration-300 hover:scale-105 bg-amber-500"
                    style={{ 
                      animation: 'wave 2s ease-in-out infinite',
                      animationDelay: '0.4s'
                    }}
                  >
                    Desde 11 hasta 20 cajas - $696.000
                  </button>
                  <button 
                    className="w-full p-2 rounded-md text-white font-bold transition-all duration-300 hover:scale-105 bg-yellow-500"
                    style={{ 
                      animation: 'wave 2s ease-in-out infinite',
                      animationDelay: '0s'
                    }}
                  >
                    Desde 21 hasta 30 cajas - $936.000
                  </button>
                  <button 
                    className="w-full p-2 rounded-md text-white font-bold transition-all duration-300 hover:scale-105 bg-red-500"
                    style={{ 
                      animation: 'wave 2s ease-in-out infinite',
                      animationDelay: '0.2s'
                    }}
                  >
                    Desde 31 hasta 40 cajas - $1.104.000
                  </button>
                  <button 
                    className="w-full p-2 rounded-md text-white font-bold transition-all duration-300 hover:scale-105 bg-black"
                    style={{ 
                      animation: 'wave 2s ease-in-out infinite',
                      animationDelay: '0.4s'
                    }}
                  >
                    Desde 31 hasta 50 cajas - $1.200.000
                  </button>
                </div>
                {/* Botón de Enviar */}
                <div className="md:w-1/2 flex items-end mt-4">
                  <button className="w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600">
                    Link de pago
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercurioDigitalizacion;
