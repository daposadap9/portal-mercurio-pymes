import Loading from '@/components/loading'; 
import React, { useState } from 'react';

const FormularioArmaTuPlan = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    entidad: '',
    servicio: '',
    email: '',
    telefono: '',
    anexo: null,
    observacion: '',
    medioContacto: '',
    aceptaPolitica: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);

  // Opciones para la lista desplegable de servicios
  const serviciosOptions = ['Servicio A', 'Servicio B', 'Servicio C'];

  // Opciones para la lista desplegable de medios de contacto
  const mediosContactoOptions = ['Whatsapp', 'Correo electrónico', 'Llamada'];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const isFormValid = () => {
    return (
      formData.nombres.trim() !== '' &&
      formData.apellidos.trim() !== '' &&
      formData.entidad.trim() !== '' &&
      formData.servicio.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.telefono.trim() !== '' &&
      formData.medioContacto.trim() !== '' &&
      formData.aceptaPolitica === true
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('¡Formulario enviado!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-50 shadow-2xl rounded-xl">
      <h1 className="text-2xl font-bold text-center text-teal-600 mb-8">Arma tu plan</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Fila 1: Nombres y Apellidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="nombres" className="block text-md font-bold text-gray-700">
              Nombres
            </label>
            <input
              type="text"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              placeholder="Ingrese sus nombres"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-2 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="apellidos" className="block text-md font-bold text-gray-700">
              Apellidos
            </label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              required
              placeholder="Ingrese sus apellidos"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-2 text-gray-900"
            />
          </div>
        </div>

        {/* Fila 2: Entidad y/o empresa */}
        <div>
          <label htmlFor="entidad" className="block text-md font-bold text-gray-700">
            Entidad y/o empresa
          </label>
          <input
            type="text"
            id="entidad"
            name="entidad"
            value={formData.entidad}
            onChange={handleChange}
            required
            placeholder="Ingrese el nombre de la entidad o empresa"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-2 text-gray-900"
          />
        </div>

        {/* Fila 3: Servicio (lista desplegable) */}
        <div>
          <label htmlFor="servicio" className="block text-md font-bold text-gray-700">
            Servicio
          </label>
          <select
            id="servicio"
            name="servicio"
            value={formData.servicio}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-inset-sm p-2"
          >
            <option value="">Seleccione un servicio</option>
            {serviciosOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Fila 4: Email y Teléfono celular */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-md font-bold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Ingrese su correo electrónico"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-2 text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="block text-md font-bold text-gray-700">
              Teléfono celular
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              placeholder="Ingrese su número de teléfono celular"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-2 text-gray-900"
            />
          </div>
        </div>

        {/* Fila 5: Anexo (input file) */}
        <div>
          <label htmlFor="anexo" className="block text-md font-bold text-gray-700">
            Anexo
          </label>
          <input
            type="file"
            id="anexo"
            name="anexo"
            onChange={handleChange}
            className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 shadow-inset-sm text-gray-700"
          />
        </div>

        {/* Fila 6: Observación (textarea) */}
        <div>
          <label htmlFor="observacion" className="block text-md font-bold text-gray-700">
            Observación
          </label>
          <textarea
            id="observacion"
            name="observacion"
            value={formData.observacion}
            onChange={handleChange}
            rows="4"
            placeholder="Escribe aquí tus comentarios o dudas..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-2 text-gray-900"
          ></textarea>
        </div>

        {/* Fila 7: Medio de contacto preferido */}
        <div>
          <label htmlFor="medioContacto" className="block text-md font-bold text-gray-700">
            Medio por el cual prefieres que te contactemos
          </label>
          <select
            id="medioContacto"
            name="medioContacto"
            value={formData.medioContacto}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 text-gray-700 shadow-inset-sm p-2"
          >
            <option value="">Seleccione un medio</option>
            {mediosContactoOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Fila 8: Botón para ver la política */}
        <div className="text-md">
          <p>
            Al enviar este formulario, acepto la{' '}
            <button
              type="button"
              onClick={() => {
                setPdfLoaded(false); // Reiniciamos el estado de carga
                setShowModal(true);
              }}
              className="text-blue-500 font-semibold hover:underline"
            >
              Política de Seguridad de la Información y Tratamiento de Datos
            </button>
          </p>
        </div>

        {/* Fila 9: Botón de enviar */}
        <div>
          <button
            type="submit"
            disabled={!isFormValid()}
            className="w-full bg-teal-500 text-white font-bold py-3 rounded-md transition-colors duration-300 hover:bg-teal-600 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>

      {/* Modal para visualizar la política */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Fondo semitransparente */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          {/* Contenedor de la modal */}
          <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl mx-auto my-4 overflow-auto h-[60vh] md:h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-center flex-1">
                Política de Seguridad de la Información y Tratamiento de Datos
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-600 hover:text-gray-800 font-bold text-3xl"
              >
                &times;
              </button>
            </div>
            <div className="w-full" style={{ height: 'calc(100% - 120px)' }}>
              {!pdfLoaded && <Loading />}
              <iframe
                onLoad={() => setPdfLoaded(true)}
                src="/politicaDeTratamientosPersonales.pdf"
                className={`w-full h-full ${!pdfLoaded ? 'hidden' : ''}`}
                title="Política de Seguridad de la Información y Tratamiento de Datos"
                style={{ border: 'none' }}
              ></iframe>
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="modalAceptaPolitica"
                className="h-4 w-4"
                checked={formData.aceptaPolitica}
                onChange={(e) =>
                  setFormData({ ...formData, aceptaPolitica: e.target.checked })
                }
              />
              <label htmlFor="modalAceptaPolitica" className="ml-2 text-gray-700">
                Acepto la Política de Seguridad de la Información y Tratamiento de Datos
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                disabled={!formData.aceptaPolitica}
                className="bg-teal-500 text-white px-4 py-2 rounded disabled:opacity-50"
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

export default FormularioArmaTuPlan;
