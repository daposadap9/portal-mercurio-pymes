import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FaCalendarAlt } from 'react-icons/fa';

const SET_SIGUIENTE_RADICADO_NEW = gql`
  mutation SetSiguienteRadicadoNew {
    setSiguienteRadicadoNew
  }
`;

const MercurioSGDEA = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    entidad: "",
    email: "",
    telefono: "",
    fecha: "",
    observaciones: ""
  });
  
  const [newRadicado, setNewRadicado] = useState(null);

  const [setSiguienteRadicadoNew, { loading, error }] = useMutation(SET_SIGUIENTE_RADICADO_NEW);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await setSiguienteRadicadoNew();
      const radicado = data.setSiguienteRadicadoNew;

      setNewRadicado(radicado);

      // Construir mensaje para la alerta
      const mensajeAlerta = `
        📌 Nuevo Radicado: ${radicado}\n
        📝 Datos ingresados:
        - Nombre: ${formData.nombre}
        - Apellido: ${formData.apellido}
        - Entidad: ${formData.entidad}
        - E-mail: ${formData.email}
        - Teléfono: ${formData.telefono}
        - Fecha: ${formData.fecha}
        - Observaciones: ${formData.observaciones}
      `;

      alert(mensajeAlerta);
    } catch (err) {
      console.error("Error al generar radicado:", err);
      alert("Error al generar radicado");
    }
  };

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
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Bloque de Datos Personales */}
              <div className="flex flex-col space-y-4">
                <input 
                  type="text" 
                  name="nombre"
                  placeholder="Nombre:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="apellido"
                  placeholder="Apellido:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="text" 
                  name="entidad"
                  placeholder="Entidad y/o empresa:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.entidad}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="email" 
                  name="email"
                  placeholder="E-mail:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <input 
                  type="tel" 
                  name="telefono"
                  placeholder="Teléfono celular:" 
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
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
                    name="fecha"
                    className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Bloque para Observaciones */}
              <div className="flex flex-col mt-4 space-y-2">
                <label className="text-sm text-gray-700 font-semibold">
                  Observaciones:
                </label>
                <textarea
                  name="observaciones"
                  placeholder="Ingresa tus observaciones aquí..."
                  className="border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  rows="4"
                  value={formData.observaciones}
                  onChange={handleChange}
                />
              </div>

              {/* Botón de Envío */}
              <div className="mt-6 flex flex-col">
                <button 
                  type="submit"
                  className="w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600"
                  disabled={loading}
                >
                  {loading ? "Procesando..." : "Enviar"}
                </button>
              </div>
              {error && <p className="text-red-600">Error: {error.message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MercurioSGDEA;
