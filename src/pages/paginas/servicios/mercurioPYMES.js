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

const MercurioPYMES = ({disabledProvider}) => {
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
      const documentInfoGeneral = "Mercurio PYMES";
      
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
      >
        <div className="w-full lg:w-[85%]">
        <h1>Mercurio PYMES es una forma ágil, fácil y práctica para la gestión documental de pequeñas, medianas empresas.</h1>
        </div>
      </div>
    <div className="flex flex-col justify-between p-4">
      {/* Contenedor principal */}
      <div className="w-full mx-auto flex flex-col lg:flex-row justify-evenly lg:gap-0 gap-4 flex-1">
          <div className="w-full lg:w-[38%]">
            <div className="lg:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
              <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                Mercurio PYMES es una solución estratégicamente diseñada para que personas naturales, micro, pequeñas y medianas empresas gestionen su información de manera eficiente, segura y accesible. Nuestro servicio innovador optimiza la administración documental, reduciendo costos de infraestructura y operativos gracias a su modelo de Software como servicio, proporcionando un entorno intuitivo que facilita la organización y el acceso a documentos clave.
              </p>
              <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                A nivel general, con MERCURIO PYMES puedes:
              </p>
              <ul className="list-disc list-inside text-black text-base font-medium text-justify mb-4">
                <li>Crear y gestionar expedientes electrónicos con toda la documentación de tu empresa en un solo lugar.</li>
                <li>Clasificar documentos de manera sencilla, agilizando la búsqueda y consulta.</li>
                <li>Garantizar la conservación de la información sin riesgo de pérdida ni problemas de almacenamiento.</li>
              </ul>
              <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                Si estás interesado: en la sección <Link href="/paginas/cotizaTuServicio" legacyBehavior><a className="text-blue-600 underline">¡cotiza tu servicio!</a></Link> podrás conocer los precios y planes del servicio; debes tener en cuenta que el valor de la implementación y del servicio está determinado por el número de usuarios (licencias) que requiera la organización, una por cada persona que accederá a Mercurio.
              </p>
              <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                Optimiza tu flujo documental con una solución confiable y escalable que impulsa la productividad de tu negocio.
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
                    .selected {
                      border: 2px solid #4CAF50;
                      transform: scale(1.05);
                    }
                  `}</style>
                  {/* Botones de selección 
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-blue-500 hover:bg-blue-600 ${formData.opcionSeleccionada === "Desde 1 Usuario Corporativo - $3.000.000 + Startup $750.000 anual" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 1 Usuario Corporativo - $3.000.000 + Startup $750.000 anual")}
                  >
                    Desde 1 Usuario Corporativo - $3.000.000 + Startup $750.000 anual
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-purple-500 hover:bg-purple-600 ${formData.opcionSeleccionada === "Desde 5 Usuarios Corporativos - $9.000.000 + Startup $3.000.000 anual" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 5 Usuarios Corporativos - $9.000.000 + Startup $3.000.000 anual")}
                  >
                    Desde 5 Usuarios Corporativos - $9.000.000 + Startup $3.000.000 anual
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-amber-500 hover:bg-amber-600 ${formData.opcionSeleccionada === "Desde 10 Usuarios Corporativos - $16.200.000 + Startup $6.750.000 anual" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 10 Usuarios Corporativos - $16.200.000 + Startup $6.750.000 anual")}
                  >
                    Desde 10 Usuarios Corporativos - $16.200.000 + Startup $6.750.000 anual
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-yellow-500 hover:bg-yellow-600 ${formData.opcionSeleccionada === "Desde 20 Usuarios Corporativos - $24.600.000 + Startup $8.200.000 anual" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 20 Usuarios Corporativos - $24.600.000 + Startup $8.200.000 anual")}
                  >
                    Desde 20 Usuarios Corporativos - $24.600.000 + Startup $8.200.000 anual
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-red-500 hover:bg-red-600 ${formData.opcionSeleccionada === "Desde 30 Usuarios Corporativos - $32.400.000 + Startup $10.800.000 anual" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 30 Usuarios Corporativos - $32.400.000 + Startup $10.800.000 anual")}
                  >
                    Desde 30 Usuarios Corporativos - $32.400.000 + Startup $10.800.000 anual
                  </button>
                  <button 
                    type="button"
                    className={`btn-wave w-full p-2 rounded-md text-white font-bold transition-all duration-300 bg-black hover:bg-yellow-600 ${formData.opcionSeleccionada === "Desde 50 Usuarios Corporativos - $42.000.000 + Startup $14.000.000 anual" ? "selected" : ""}`}
                    onClick={() => handleOptionSelect("Desde 50 Usuarios Corporativos - $42.000.000 + Startup $14.000.000 anual")}
                  >
                    Desde 50 Usuarios Corporativos - $42.000.000 + Startup $14.000.000 anual
                  </button>
                </div>
                <div className="mt-4 text-center text-teal-600 font-semibold">
                  Opción seleccionada: {formData.opcionSeleccionada}
                </div>
                <div className="lg:w-1/2 flex mx-auto items-end mt-4">
                  <button type="submit" className="w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600" disabled={loading}>
                    {loading ? "Procesando..." : "Enviar"}
                  </button>
                  */}
                </div>
              </div>
              {error && <p className="text-red-600">Error: {error.message}</p>}
            </form>
          </div>
        </div>
      </div>
      {/* Mensaje final destacado */}
      <div className="mt-8 bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-lg shadow-lg text-white text-center">
        <p className="text-2xl font-bold">
        ¡Descubre cómo Mercurio PYMES puede transformar la gestión documental de tu empresa!
        </p>
      </div>
    </div>
    </>
  );
};

export default MercurioPYMES;
