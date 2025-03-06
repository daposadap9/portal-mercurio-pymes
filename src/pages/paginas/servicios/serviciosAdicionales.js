import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

// Mutation que realiza todo el proceso de radicación
const INSERT_MERT_RECIBIDO = gql`
  mutation InsertMertRecibido($documentInfo: String!, $documentInfoGeneral: String!) {
    insertMertRecibido(documentInfo: $documentInfo, documentInfoGeneral: $documentInfoGeneral) {
      success
      message
      idDocumento
    }
  }
`;

const ServiciosAdicionales = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    entidad: "",
    email: "",
    telefono: "",
    observaciones: "",
    opcionSeleccionada: ""
  });
  
  const [newRadicado, setNewRadicado] = useState(null);
  const [insertMertRecibido, { loading, error }] = useMutation(INSERT_MERT_RECIBIDO);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionSelect = (opcion) => {
    setFormData(prev => ({
      ...prev,
      opcionSeleccionada: opcion
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones
    if (!formData.nombre || !formData.apellido || !formData.entidad || !formData.email || !formData.telefono || !formData.opcionSeleccionada) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    try {
      // Construimos un string con toda la información del formulario
      const documentInfo = `${formData.nombre} - ${formData.apellido} - ${formData.entidad} - ${formData.email} - ${formData.telefono} - ${formData.observaciones} - ${formData.opcionSeleccionada}`;
      const documentInfoGeneral = "Servicios Adicionales";
      
      // Llamamos a la mutation para radicar: esta mutation internamente obtiene el siguiente radicado y realiza todas las inserciones
      const { data } = await insertMertRecibido({ variables: { documentInfo, documentInfoGeneral } });
      const result = data.insertMertRecibido;
      
      if (result.success) {
        setNewRadicado(result.idDocumento);
        // Redirigimos a la página de éxito pasando los datos necesarios vía query parameters
        router.push({
          pathname: '/radicadoExitoso',
          query: {
            nombre: formData.nombre,
            observaciones: formData.observaciones,
            documentInfo: documentInfo,
            documentInfoGeneral: documentInfoGeneral,
            radicado: result.idDocumento
          }
        });
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error("Error al radicar:", err);
      alert("Error al radicar");
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-around gap-4">
        {/* Sección Izquierda: Párrafos */}
        <div className="w-full md:w-[35%]">
          <div className="text-center md:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
            <p className="mb-4 leading-relaxed text-black text-base font-normal">
            Proveemos los insumos necesarios para que encuentres todo lo que necesitas en la digitalización y custodia de tus documentos en el mismo lugar.
            </p>
          </div>
        </div>

        {/* Sección Derecha: Formulario */}
        <div className="w-full md:w-[35%]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
              ¡Adquiérelo ahora!
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Bloque de Datos Personales */}
              <div className="flex flex-col space-y-4">
                <input 
                  type="text" 
                  name="nombre"
                  placeholder="Nombre:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="apellido"
                  placeholder="Apellido:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="entidad"
                  placeholder="Entidad y/o empresa:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.entidad}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="E-mail:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="tel" 
                  name="telefono"
                  placeholder="Teléfono celular:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Bloque para Observaciones */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm text-black font-semibold">
                  Observaciones:
                </label>
                <textarea 
                  name="observaciones"
                  placeholder="Ingresa tus observaciones aquí..."
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  rows="4"
                  value={formData.observaciones}
                  onChange={handleChange}
                />
              </div>

              {/* Bloque para Inversión y Botones */}
              <div className="mt-6">
                <h3 className="text-lg font-bold text-teal-600 mb-2">Conoce el valor de tu inversión</h3>
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
                    .selected {
                      border: 2px solid #4CAF50;
                      transform: scale(1.05);
                    }
                  `}</style>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-blue-500 hover:bg-blue-600 ${formData.opcionSeleccionada === "Desde 0 hasta 5 cajas - $210.000" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 0 hasta 5 cajas - $210.000")}
                  >
                    Desde 0 hasta 5 cajas - $210.000
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-purple-500 hover:bg-purple-600 ${formData.opcionSeleccionada === "Desde 6 hasta 10 cajas - $384.000" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 6 hasta 10 cajas - $384.000")}
                  >
                    Desde 6 hasta 10 cajas - $384.000
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-amber-500 hover:bg-amber-600 ${formData.opcionSeleccionada === "Desde 11 hasta 20 cajas - $696.000" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 11 hasta 20 cajas - $696.000")}
                  >
                    Desde 11 hasta 20 cajas - $696.000
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 ${formData.opcionSeleccionada === "Desde 21 hasta 30 cajas - $936.000" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 21 hasta 30 cajas - $936.000")}
                  >
                    Desde 21 hasta 30 cajas - $936.000
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-red-500 hover:bg-red-600 ${formData.opcionSeleccionada === "Desde 31 hasta 40 cajas - $1.104.000" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 31 hasta 40 cajas - $1.104.000")}
                  >
                    Desde 31 hasta 40 cajas - $1.104.000
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-black hover:bg-yellow-600 ${formData.opcionSeleccionada === "Desde 31 hasta 50 cajas - $1.200.000" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 31 hasta 50 cajas - $1.200.000")}
                  >
                    Desde 31 hasta 50 cajas - $1.200.000
                  </button>
                </div>
                <div className="mt-4 text-center text-teal-600 font-semibold">
                  Opción seleccionada: {formData.opcionSeleccionada}
                </div>
                {/* Botón de Enviar */}
                <div className="md:w-1/2 flex items-end mt-4">
                  <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600">
                    {loading ? "Procesando..." : "Enviar"}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-600">Error: {error.message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiciosAdicionales;
