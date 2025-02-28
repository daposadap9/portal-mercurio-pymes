import React from 'react';

const MercurioPYMES = () => {
  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-around gap-4">
        {/* Sección Izquierda: Párrafos */}
        <div className="w-full md:w-[35%]">
          <div className="text-center md:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
            <p className="mb-4 leading-relaxed text-black text-base font-normal">
            Es un servicio innovador y estratégico que facilita y pone al acceso de todos la Gestión Documental. Diseñado para estructurar y almacenar la información de Grandes, medianas y pequeñas empresas, disminuyendo costos y propiciando un ambiente intuitivo y amigable que garantice el éxito en la gestión documental.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-normal">
            Con mercurio PYMES podrás crear expedientes, indexar todos los tipos de documentos que produce tu empresa y, sobre todo, conservarlos en sólo lugar sin aumentar el riesgo de pérdida ni quedarte sin espacio suficiente. Disminuye costos y propicia un ambiente intuitivo y amigable que garantiza el éxito en la gestión documental.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-normal">
            Además podrás:

 

Controlar tus documentos.
Consultar tus documentos.
Conservar documentos en expedientes electrónicos
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
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
                <input 
                  type="text" 
                  placeholder="Apellido:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
                <input 
                  type="text" 
                  placeholder="Entidad y/o empresa:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
                <input 
                  type="email" 
                  placeholder="E-mail:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
                <input 
                  type="tel" 
                  placeholder="Teléfono celular:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>
              {/* Bloque para Observaciones */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-black font-semibold">
                  Observaciones:
                </label>
                <textarea
                  placeholder="Ingresa tus observaciones aquí..."
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  rows="4"
                />
              </div>
              {/* Bloque para Ubicación y Botón */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-teal-600 mb-2">
                  Conoce el valor de tu inversión
                </h3>
                <div className="flex flex-col gap-4">
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
                    Desde 1 Usuario Corporativos - $250.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-purple-500 hover:bg-purple-600"
                  >
                    Desde 5 Usuarios Corporativos - $400.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-amber-500 hover:bg-amber-600"
                  >
                    Desde 10 Usuarios Corporativos - $700.000
                  </button>
                </div>
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
