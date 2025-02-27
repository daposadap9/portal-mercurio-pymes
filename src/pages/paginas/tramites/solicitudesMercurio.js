import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Loading from '../../../components/loading';

const SolicitudesMercurio = ({ tipoSolicitud: tipoSolicitudProp }) => {
  const router = useRouter();
  const { tipoSolicitud: tipoSolicitudQuery } = router.query;
  const tipoInicial = tipoSolicitudProp || tipoSolicitudQuery || "";

  // Estado para la política: inicialmente los campos estarán bloqueados
  const [policyAccepted, setPolicyAccepted] = useState(false);
  
  // Estado para la modal que muestra la política
  const [showModal, setShowModal] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  
  // Estado para el checkbox de la modal de política
  const [modalPolicyAccepted, setModalPolicyAccepted] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    tipoSolicitud: tipoInicial,
    cliente: '',
    nombreRadicador: '',
    rolRadicador: 'Supervisor del Contrato - Cliente',
    email: '',
    telefono: '',
    clasificacion: '',
    versionProducto: '',
    asunto: '',
    descripcion: '',
    pasoRequerimiento: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tipoSolicitud: tipoSolicitudProp || tipoSolicitudQuery || "",
    }));
  }, [tipoSolicitudProp, tipoSolicitudQuery]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const isFormValid = () => {
    if (!policyAccepted) return false;
    return (
      formData.cliente.trim() !== '' &&
      formData.nombreRadicador.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.telefono.trim() !== '' &&
      formData.clasificacion.trim() !== '' &&
      formData.versionProducto.trim() !== '' &&
      formData.asunto.trim() !== '' &&
      formData.pasoRequerimiento.trim() !== ''
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('¡Formulario enviado!');
  };

  const openModal = (e) => {
    e.preventDefault();
    setPdfLoaded(false);
    setModalPolicyAccepted(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePolicyAccept = () => {
    setPolicyAccepted(true);
    setModalPolicyAccepted(false);
    setShowModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 shadow-2xl rounded-xl relative">
      {/* Información y enlace para la política */}
      <p className="mb-4 text-gray-700">
        Autoriza a SERVISOFT S.A. a utilizar los datos personales proporcionados de acuerdo con sus políticas de tratamiento de información. Consulta la política haciendo clic en el siguiente enlace.
      </p>
      <p className="mb-4 text-gray-700">
        Para iniciar, es necesario que leas y apruebes la política de tratamiento de datos personales.
      </p>
      <div className="mb-4">
        <button 
          type="button"
          onClick={openModal}
          className="text-blue-500 font-semibold hover:underline"
        >
          Política de tratamiento de datos personales
        </button>
      </div>

      {/* Formulario sin overflow para mostrarse completo */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cliente" className="block text-md font-bold text-gray-700">Cliente</label>
            <input 
              type="text"
              id="cliente"
              name="cliente"
              value={formData.cliente}
              onChange={handleChange}
              placeholder="Ingrese el cliente"
              disabled={!policyAccepted}
              className="mt-1 block w-full rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="nombreRadicador" className="block text-md font-bold text-gray-700">Nombre del radicador</label>
            <input 
              type="text"
              id="nombreRadicador"
              name="nombreRadicador"
              value={formData.nombreRadicador}
              onChange={handleChange}
              placeholder="Ingrese el nombre del radicador"
              disabled={!policyAccepted}
              className="mt-1 block w-full rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="rolRadicador" className="block text-md font-bold text-gray-700">Rol radicador</label>
            <select 
              id="rolRadicador"
              name="rolRadicador"
              value={formData.rolRadicador}
              onChange={handleChange}
              disabled={!policyAccepted}
              className="mt-1 block w-full text-gray-300 rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Supervisor del Contrato - Cliente">Supervisor del Contrato - Cliente</option>
            </select>
          </div>
          <div>
            <label htmlFor="email" className="block text-md font-bold text-gray-700">EMAIL</label>
            <input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ingrese el email"
              disabled={!policyAccepted}
              className="mt-1 block w-full rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-md font-bold text-gray-700">Teléfono</label>
            <input 
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ingrese el teléfono"
              disabled={!policyAccepted}
              className="mt-1 block w-full rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="clasificacion" className="block text-md font-bold text-gray-700">Clasificación</label>
            <select 
              id="clasificacion"
              name="clasificacion"
              value={formData.clasificacion}
              onChange={handleChange}
              disabled={!policyAccepted}
              className="mt-1 block w-full text-gray-300 rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccione una clasificación</option>
              <option value="Incidente">Incidente</option>
              <option value="Consultoria">Consultoria</option>
              <option value="Requerimiento Nuevo">Requerimiento Nuevo</option>
              <option value="Producto o Servicio">Producto o Servicio</option>
            </select>
          </div>
          <div>
            <label htmlFor="versionProducto" className="block text-md font-bold text-gray-700">Versión Producto</label>
            <select 
              id="versionProducto"
              name="versionProducto"
              value={formData.versionProducto}
              onChange={handleChange}
              disabled={!policyAccepted}
              className="mt-1 block w-full text-gray-300 rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Seleccione la versión</option>
              <option value="5.5">5.5</option>
              <option value="6.0">6.0</option>
              <option value="6.5">6.5</option>
              <option value="7.0">7.0</option>
              <option value="8.0">8.0</option>
            </select>
          </div>
          <div>
            <label htmlFor="asunto" className="block text-md font-bold text-gray-700">Asunto de la solicitud</label>
            <input 
              type="text"
              id="asunto"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Ingrese el asunto de la solicitud"
              disabled={!policyAccepted}
              className="mt-1 block w-full rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="descripcion" className="block text-md font-bold text-gray-700">Descripción (opcional)</label>
            <textarea 
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Ingrese una descripción (opcional)"
              disabled={!policyAccepted}
              className="mt-1 block w-full rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              rows="3"
            ></textarea>
          </div>
          <div>
            <label htmlFor="pasoRequerimiento" className="block text-md font-bold text-gray-700">Paso a paso del requerimiento</label>
            <textarea 
              id="pasoRequerimiento"
              name="pasoRequerimiento"
              value={formData.pasoRequerimiento}
              onChange={handleChange}
              placeholder="Describa el paso a paso del requerimiento"
              disabled={!policyAccepted}
              className="mt-1 block w-full rounded-md shadow-inset-sm border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
              rows="3"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full bg-teal-600 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-700 disabled:opacity-50"
            >
              Continuar
            </button>
          </div>
        </form>
      </div>

      {/* Modal para la política */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
          <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl mx-auto my-4 overflow-auto h-[60vh] md:h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-center flex-1">
                Política de Tratamiento de Datos Personales
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-800 font-bold text-3xl"
              >
                &times;
              </button>
            </div>
            <div className="w-full" style={{ height: 'calc(100% - 120px)' }}>
              {!pdfLoaded && (
                <div className="w-full h-full flex items-center justify-center">
                  <Loading />
                </div>
              )}
              <iframe
                onLoad={() => setPdfLoaded(true)}
                src="/politicaDeTratamientosPersonales.pdf"
                className={`w-full h-full ${!pdfLoaded ? 'hidden' : ''}`}
                title="Política de Tratamiento de Datos Personales"
                style={{ border: 'none' }}
              ></iframe>
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="modalAceptaTerminos"
                className="h-4 w-4 text-teal-600"
                checked={modalPolicyAccepted}
                onChange={(e) => setModalPolicyAccepted(e.target.checked)}
              />
              <label htmlFor="modalAceptaTerminos" className="ml-2 text-gray-700">
                Acepto la Política de Tratamiento de Datos Personales
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handlePolicyAccept}
                disabled={!modalPolicyAccepted}
                className="bg-teal-600 text-white px-4 py-2 rounded disabled:opacity-50 transition-colors duration-300 hover:bg-teal-700"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudesMercurio;
