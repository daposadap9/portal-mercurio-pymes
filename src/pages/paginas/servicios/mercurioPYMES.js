import React from 'react';

const MercurioPYMES = () => {
  return (
    <div className="min-h-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-around gap-4">
        {/* Sección Izquierda: Párrafos */}
        <div className="w-full md:w-[35%]">
          <div className="text-center md:text-left">
            <p className="mb-4 leading-relaxed text-gray-700 text-base font-normal">
              Mercurio pymes es un software de gestión electrónica de documentos diseñado para estructurar y almacenar la información de pequeñas y medianas empresas, disminuyendo costos y propiciando un ambiente intuitivo y amigable que garantice el éxito en la gestión documental.
            </p>
            <p className="mb-4 leading-relaxed text-gray-700 text-base font-normal">
              Con mercurio pymes podrás crear expedientes, indexar todos los tipos de documentos que produce tu empresa y, sobre todo, conservarlos en sólo lugar sin aumentar el riesgo de pérdida ni quedarte sin espacio suficiente.
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
              {/* Bloque para Observaciones */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-gray-700 font-semibold">
                  Observaciones:
                </label>
                <textarea
                  placeholder="Ingresa tus observaciones aquí..."
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="4"
                />
              </div>
              {/* Bloque para Ubicación y Botón */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-teal-600 mb-2">
                  Conoce el valor de tu inversión
                </h3>
                <div className="flex flex-col gap-4">
                  {/* Botones con efecto de ola interna */}
                  <style jsx>{`
                    .btn-wave {
                      position: relative;
                      overflow: hidden;
                    }
                    .btn-wave::before {
                      content: "";
                      position: absolute;
                      top: 0;
                      left: -100%;
                      width: 100%;
                      height: 100%;
                      background: rgba(255,255,255,0.2);
                      transform: skewX(-20deg);
                      transition: left 0.5s ease;
                    }
                    .btn-wave:hover::before {
                      left: 100%;
                    }
                  `}</style>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-blue-500 hover:bg-blue-600"
                  >
                    1 usuario - $250.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-purple-500 hover:bg-purple-600"
                  >
                    5 usuarios - $400.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-amber-500 hover:bg-amber-600"
                  >
                    10 usuarios - $700.000
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

export default MercurioPYMES;
