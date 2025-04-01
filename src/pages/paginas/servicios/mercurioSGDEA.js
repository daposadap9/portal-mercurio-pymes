import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { FaCalendarAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useDropdown } from '@/context/DropdownContext';

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

const MercurioSGDEA = ({disabledProvider}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    entidad: "",
    email: "",
    telefono: "",
    fecha: "",
    observaciones: "",
    opcionSeleccionada: ""
  });
    const { dropdownActive } = useDropdown();
    const isAnyDropdownActive = disabledProvider 
    ? false 
    : (dropdownActive.services || dropdownActive.tramites);
  
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
    if (!formData.nombre || !formData.apellido || !formData.entidad || !formData.email || !formData.telefono || !formData.fecha) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    try {
      // Construimos un string con toda la información del formulario
      const documentInfo = `${formData.nombre} - ${formData.apellido} - ${formData.entidad} - ${formData.email} - ${formData.telefono} - ${formData.fecha} - ${formData.observaciones}`;
      const documentInfoGeneral = "Mercurio SGDEA";
      
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
            fecha: formData.fecha,
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
    <>
    <div
        className={`
          flex justify-center text-2xl md:text-4xl font-bold
          transition-all duration-500 ease-in-out
          text-teal-600 text-center titulo-shadow mb-10
          ${isAnyDropdownActive ? "mt-24" : ""}
        `}
      ><div className="w-full lg:w-[85%]">
        <h1> Con Mercurio Optimiza la Gestión Documental de tú Negocio.</h1>
      </div>
      </div>
    <div className="flex flex-col justify-between p-4">
      {/* Contenedor principal que se expande en el viewport */}
      <div className="w-full mx-auto flex flex-col lg:flex-row justify-evenly lg:gap-0 gap-4 flex-1">
        {/* Sección Izquierda: Información */}
        <div className="w-full lg:w-[38%]">
          <div className="lg:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30 h-full">
            <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
              Mercurio es una plataforma empresarial de gestión documental electrónica que automatiza procesos clave de la gestión inteligente de documentos. Con su base tecnológica BPM (Business Process Management) y ECM (Enterprise Content Management), facilita el cumplimiento de la Ley, evita sanciones, asegura prácticas de archivo eficientes y legales y optimiza los procesos operativos y de gestión de la organización.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
              Gracias a Mercurio, podrás clasificar, organizar y acceder a tus documentos de manera rápida y eficiente, garantizando una gestión documental estructurada y sin riesgo de pérdida de información.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
              Estamos comprometidos con los más altos estándares de calidad para la protección y almacenamiento de documentos, tanto físicos como digitales, asegurando su integridad y disponibilidad.
            </p>
            <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
              Características destacadas de Mercurio SGDEA:
            </p>
            <ul className="list-disc list-inside text-black text-base font-medium text-justify">
              <li>Índices dinámicos ilimitados: Organiza tus documentos con metadatos personalizados.</li>
              <li>Trámites electrónicos virtuales: Gestiona formularios y trámites con clientes de forma ágil y segura.</li>
              <li>Controles de acceso y seguridad: Asegura la confidencialidad y protección de la información.</li>
              <li>Validación de anexos: Verifica que los documentos y anexos requeridos estén correctamente asociados.</li>
              <li>Control de inventario: Lleva un registro detallado y actualizado de todos tus documentos.</li>
            </ul>
          </div>
        </div>

        {/* Sección Derecha: Formulario */}
        <div className="w-full lg:w-[40%]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
              Agenda demostración con nuestro equipo comercial
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
              {/* Datos Personales */}
              <div className="flex flex-col space-y-4">
                <div className='flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0'>
                  <input 
                    type="text" 
                    name="nombre"
                    placeholder="Nombre:" 
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  <input 
                    type="text" 
                    name="apellido"
                    placeholder="Apellido:" 
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
                <input 
                  type="text" 
                  name="entidad"
                  placeholder="Entidad y/o empresa:" 
                  className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  value={formData.entidad}
                  onChange={handleChange}
                  required
                />
                <div className='flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0'>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="E-mail:" 
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input 
                    type="tel" 
                    name="telefono"
                    placeholder="Teléfono celular:" 
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
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
              <div className="mt-6 flex justify-center">
                <button 
                  type="submit"
                  className="w-2/3 bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600"
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

      {/* Mensaje final destacado */}
      <div className="mt-8 bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-lg shadow-lg text-white text-center">
        <p className="text-2xl font-bold">
          ¡Optimiza la gestión de tus documentos hoy mismo. Solicita una demostración y descubre cómo Mercurio puede transformar tu empresa!
        </p>
      </div>
    </div>
    </>
  );
};

export default MercurioSGDEA;
