import React from 'react';
import { FaCalendarAlt, FaRegCalendarAlt } from 'react-icons/fa';

const MercurioSGDEA = () => {
  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-around gap-4">
        {/* Sección Izquierda: Párrafos */}
        <div className="w-full md:w-[35%]">
            <div className="text-center md:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
              <p className="mb-4 leading-relaxed text-black text-base font-medium">
                El sgdea mercurio permite a la entidad el cumplimiento de las regulaciones establecidas en la ley 594 de 2000, impidiendo sanciones y asegurando prácticas idóneas de archivo.
              </p>
              <p className="mb-4 leading-relaxed text-black text-base font-medium">
                Facilita la clasificación, la ordenación y un acceso eficiente a los documentos, garantizando una gestión documental estructurada y sin pérdida de información.
              </p>
              <p className="mb-4 leading-relaxed text-black text-base font-medium">
                En compañía de nuestros partners en almacenamiento en la nube, estamos comprometidos con los más altos estándares de calidad en cuanto al resguardo de documentos físicos y digitales, evitando así cualquier tipo de alteración en la información de todos nuestros clientes.
              </p>
              <p className="mb-4 leading-relaxed text-black text-base font-medium">
                Del mismo modo, con el sgdea mercurio la entidad facilita la transcripción del archivo físico a formato digital, asegurando su preservación y la consulta a largo plazo mediante altos estándares de gestión electrónica documental.
              </p>
            </div>
          </div>




        {/* Sección Derecha: Formulario */}
        <div className="w-full md:w-[35%]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
              Agenda demostración con nuestro equipo comercial
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

              {/* Bloque para Selección de Día y Agenda */}
              <div className="flex flex-col mt-4 space-y-2">
                <label className="text-sm text-gray-700 font-semibold">
                  Selecciona el día de preferencia
                </label>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-teal-600 text-2xl" />
                  <input 
                    type="date" 
                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Bloque para Observaciones */}
              <div className="flex flex-col mt-4 space-y-2">
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
              <div className="mt-6 flex flex-col">
                <div className="flex flex-col gap-4">
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
  );
};

export default MercurioSGDEA;
