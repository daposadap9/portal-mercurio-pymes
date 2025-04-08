import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
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

const MercurioCustodia = ({disabledProvider}) => {
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
    if (!formData.nombre || !formData.apellido || !formData.entidad || !formData.email || !formData.telefono || !formData.opcionSeleccionada) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    try {
      // Construimos un string con toda la información del formulario
      const documentInfo = `${formData.nombre} - ${formData.apellido} - ${formData.entidad} - ${formData.email} - ${formData.telefono} - ${formData.observaciones} - ${formData.opcionSeleccionada}`;
      const documentInfoGeneral = "Mercurio Custodia";
      
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
    <>
    <div
        className={`
          flex justify-center text-2xl md:text-4xl font-bold
          transition-all duration-500 ease-in-out
          text-teal-600 text-center titulo-shadow mb-10
          ${isAnyDropdownActive ? "mt-24" : ""}
        `}
      ><div className="w-full lg:w-[85%] text-xl">
        <h1>¿Sabías que más del 15% de la superficie de las oficinas está reservado para armarios de papel? La Gestión Documental Avanza, nosotros conservamos tus documentos.</h1>
      </div>  
      </div>
    <div className="flex flex-col justify-between p-4">
      {/* Contenedor principal */}
      <div className="w-full mx-auto flex flex-col lg:flex-row justify-evenly lg:gap-0 gap-4 flex-1">
        {/* Sección Izquierda: Información */}
        <div className="w-full lg:w-[40%]">
          <div className="lg:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
            <p className="mb-4 text-lg font-bold text-black text-justify">
              Custodia de Documentos: Seguridad, Accesibilidad y Eficiencia
            </p>
            <p className="mb-4 text-md font-medium text-black text-justify">
              Olvídate del almacenamiento de documentos físicos y enfócate en el crecimiento de tu empresa. Nuestro servicio de custodia documental garantiza la seguridad, organización y disponibilidad de tu información sin los costos ni el espacio que implica almacenarla en tus oficinas.
            </p>
            <ul className="list-disc list-inside mb-4 text-md font-medium text-black text-justify">
              <li>Acceso rápido y seguro a tus documentos cuando los necesites.</li>
              <li>Optimización de recursos al reducir gastos operativos y liberar espacio.</li>
              <li>Gestión profesional que garantiza el cumplimiento normativo y la conservación de tu archivo.</li>
            </ul>
            <p className="mb-4 text-md font-medium text-black text-justify">
              Tercerizar la administración de documentos mejora la eficiencia de la empresa y permite redirigir esfuerzos hacia áreas estratégicas de tu negocio.
            </p>
            <p className="mb-4 text-md font-medium text-black text-justify">
              Si estas interesado: En la sección <Link href="/paginas/cotizaTuServicio" legacyBehavior><a className="text-blue-600 underline">¡cotiza tu servicio!</a></Link> Podrás conocer los precios y planes del servicio. Debes tener en cuenta que el valor final está ligado al número de cajas totales que desees almacenar.
            </p>
          </div>
        </div>

        {/* Sección Derecha: Formulario */}
        <div className="w-full lg:w-[40%]">
          <div className="bg-gray-50 p-6 rounded-lg shadow-lg h-full flex flex-col">
            <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
              ¡Adquiérelo ahora!
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
              {/* Datos Personales */}
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
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
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="E_mail:" 
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

              {/* Bloque para Observaciones */}
              <div className="flex flex-col mt-2 space-y-2">
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

              {/* Bloque para Inversión y Botones */}
              <div className="mt-1">
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
                </div>
                <div className="lg:w-1/2 flex mx-auto items-end mt-2">
                  <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600" disabled={loading}>
                    {loading ? "Procesando..." : "Enviar"}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-600">Error: {error.message}</p>}
            </form>
          </div>
        </div>
      </div>
        {/* Mensaje final destacado */}
        
    </div>
    </>
  );
};

export default MercurioCustodia;
