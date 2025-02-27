import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FaCalendarAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

// Mutation que realiza todo el proceso de radicación
const INSERT_MERT_RECIBIDO = gql`
  mutation InsertMertRecibido($documentInfo: String!) {
    insertMertRecibido(documentInfo: $documentInfo) {
      success
      message
      idDocumento
    }
  }
`;

const MercurioSGDEA = () => {
  const router = useRouter();
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
  const [insertMertRecibido, { loading, error }] = useMutation(INSERT_MERT_RECIBIDO);

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
      // Construimos un string con toda la información del formulario
      const documentInfo = `${formData.nombre} - ${formData.apellido} - ${formData.entidad} - ${formData.email} - ${formData.telefono} - ${formData.fecha} - ${formData.observaciones}`;
      
      // Llamamos a la mutation para radicar: esta mutation internamente obtiene el siguiente radicado y realiza todas las inserciones
      const { data } = await insertMertRecibido({ variables: { documentInfo } });
      const result = data.insertMertRecibido;
      
      if (result.success) {
        setNewRadicado(result.idDocumento);
        // Redirigimos a la página de éxito pasando los datos necesarios vía query parameters
        router.push({
          pathname: '/radicadoExitoso',
          query: {
            nombre: formData.nombre,
            fecha: formData.fecha,
            observaciones: formData.observaciones,
            documentInfo: documentInfo,
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
        {/* Sección Izquierda: Información */}
        <div className="w-full md:w-[35%]">
          <div className="text-center md:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
            <p className="mb-4 leading-relaxed text-black text-base font-medium">
            Mercurio es una solución corporativa para la Gestión Electrónica de Documentos, que automatiza procesos estratégicos de la Gestión Inteligente Documental, con su BPM y ECM de base tecnológica, Permite el cumplimiento de las regulaciones establecidas en la ley 594 de 2000, impidiendo sanciones y asegurando prácticas idóneas de archivo.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-medium">
              Facilita la clasificación, la ordenación y un acceso eficiente a los documentos, garantizando una gestión documental estructurada y sin pérdida de información.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-medium">
              Estamos comprometidos con los más altos estándares de calidad en cuanto al resguardo de documentos físicos y digitales, evitando así cualquier alteración en la información.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-medium">
            Mercurio SGDEA permite además:

 

Índices dinámicos ilimitados (metadatos).
Trámites electrónicos virtuales para gestión con clientes (Formularios)
Controles de acceso y seguridad
Validación de anexos relacionados y requeridos
Control de inventario
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
              {/* Datos Personales */}
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
              
              {/* Selección de Día */}
              <div className="flex flex-col mt-4 space-y-2">
                <label className="text-sm text-gray-700 font-semibold">
                  Selecciona el día de preferencia
                </label>
                <div className="flex items-center space-x-2">
                  <FaCalendarAlt className="text-teal-600 text-2xl" />
                  <input 
                    type="date" 
                    name="fecha"
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    value={formData.fecha}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              {/* Observaciones */}
              <div className="flex flex-col mt-4 space-y-2">
                <label className="text-sm text-gray-700 font-semibold">
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
