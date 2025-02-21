import React from 'react';

const MercurioCustodia = () => {
  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-around gap-4">
        {/* Sección Izquierda: Párrafos */}
        <div className="w-full md:w-[35%]">
          <div className="text-center md:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
            <p className="mb-4 text-md font-medium text-black">
              Nuestro servicio de custodia está diseñado para que olvides la preocupación por la gestión de documentos físicos; nosotros nos encargamos de todo mientras tú te concentras en hacer crecer tu negocio.
            </p>
            <p className="mb-4 text-md font-medium text-black">
              Tus documentos estarán siempre disponibles cuando los necesites, con acceso rápido y seguro, sin los costos de mantenerlos en tus oficinas.
            </p>
            <p className="mb-4 text-md font-medium text-black">
              Con la tercerización de archivos, no solo ahorras, sino que optimizas recursos valiosos que puedes redirigir hacia áreas estratégicas de tu empresa.
            </p>
            <p className="mb-4 text-md font-medium text-black">
              No dejes que el desorden documental afecte tu eficiencia: con nuestra custodia física, simplificamos todo el proceso de organización y acceso.
            </p>
          </div>
        </div>

        {/* Sección Derecha: Formulario */}
        <div className="w-full md:w-[35%]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
              Adquiérelo ahora!
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
                  placeholder="E_mail:" 
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

              {/* Bloque para Inversión y Botones */}
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
                      background: rgba(255, 255, 255, 0.2);
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
                    Desde 0 hasta 5 cajas - $210.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-purple-500 hover:bg-purple-600"
                  >
                    Desde 6 hasta 10 cajas - $384.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-amber-500 hover:bg-amber-600"
                  >
                    Desde 11 hasta 20 cajas - $696.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-yellow-500 hover:bg-yellow-600"
                  >
                    Desde 21 hasta 30 cajas - $936.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-red-500 hover:bg-red-600"
                  >
                    Desde 31 hasta 40 cajas - $1.104.000
                  </button>
                  <button 
                    className="btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-black hover:bg-gray-800"
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

export default MercurioCustodia;
