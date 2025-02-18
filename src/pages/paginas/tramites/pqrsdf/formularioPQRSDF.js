import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const FormularioPQRSDF = ({ tipoSolicitud: tipoSolicitudProp }) => {
  const router = useRouter();
  // Extraemos el tipo de solicitud de la query si no se pasó por props
  const { tipoSolicitud: tipoSolicitudQuery } = router.query;
  const tipoInicial = tipoSolicitudProp || tipoSolicitudQuery || "";

  // Definición de opciones para medios de contacto
  const mediosContactoOptions = ['Whatsapp', 'Correo electrónico', 'Llamada'];

  const [formData, setFormData] = useState({
    tipoSolicitud: tipoInicial,
    nombres: '',
    apellidos: '',
    identificacion: '',
    email: '',
    telefono: '',
    entidad: '',
    anexo: null,
    observacion: '',
    aceptaNotificaciones: false,
    aceptaTerminos: false,
    medioContacto: '',
    aceptaPolitica: false,
  });

  const [showModal, setShowModal] = useState(false);

  // Actualizamos el campo tipoSolicitud si cambian la prop o la query.
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      tipoSolicitud: tipoSolicitudProp || tipoSolicitudQuery || "",
    }));
  }, [tipoSolicitudProp, tipoSolicitudQuery]);

  // Función para validar que todos los datos obligatorios estén llenos
  const isFormValid = () => {
    return (
      formData.nombres.trim() !== '' &&
      formData.apellidos.trim() !== '' &&
      formData.identificacion.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.telefono.trim() !== '' &&
      formData.entidad.trim() !== '' &&
      formData.aceptaNotificaciones === true &&
      formData.aceptaTerminos === true &&
      formData.medioContacto.trim() !== ''
    );
  };

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('¡Formulario enviado!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl relative">
      <h1 className="text-2xl font-bold text-center text-teal-600 mb-8">PQRSDF</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de solicitud (solo lectura) */}
        <div>
          <label htmlFor="tipoSolicitud" className="block text-md font-bold text-gray-700">
            Tipo de solicitud
          </label>
          <input
            type="text"
            id="tipoSolicitud"
            name="tipoSolicitud"
            value={formData.tipoSolicitud}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-inner p-2"
          />
        </div>

        {/* Nombres y Apellidos */}
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
            />
          </div>
        </div>

        {/* Nro. de identificación y Entidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="identificacion" className="block text-md font-bold text-gray-700">
              Nro. de identificación
            </label>
            <input
              type="text"
              id="identificacion"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              required
              placeholder="Ingrese su número de identificación"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
            />
          </div>
          <div>
            <label htmlFor="entidad" className="block text-md font-bold text-gray-700">
              Entidad
            </label>
            <input
              type="text"
              id="entidad"
              name="entidad"
              value={formData.entidad}
              onChange={handleChange}
              required
              placeholder="Ingrese el nombre de la entidad"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
            />
          </div>
        </div>

        {/* Email y Teléfono celular */}
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
            />
          </div>
        </div>

        {/* Anexo (input file) */}
        <div>
          <label htmlFor="anexo" className="block text-md font-bold text-gray-700">
            Anexo
          </label>
          <input
            type="file"
            id="anexo"
            name="anexo"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 shadow-inner"
          />
        </div>

        {/* Observación (textarea) */}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
          ></textarea>
        </div>

        {/* Medio de contacto preferido */}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inner p-2"
          >
            <option value="">Seleccione un medio</option>
            {mediosContactoOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Enlace para ver la política */}
        <div className="text-md">
          <p>
            Al enviar este formulario, acepto la{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowModal(true);
              }}
              className="text-blue-500 font-semibold hover:underline"
            >
              Política de Seguridad de la Información y Tratamiento de Datos
            </a>
          </p>
        </div>

        {/* Botón de enviar */}
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
          {/* Contenedor de la modal: 50vh en mobile y 70vh en desktop */}
          <div
            className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-4xl mx-auto my-4 overflow-auto h-[50vh] md:h-[70vh]"
          >
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
            {/* Contenedor para el iframe: se descuenta el espacio del header y controles */}
            <div className="w-full" style={{ height: 'calc(100% - 120px)' }}>
              <iframe
                src="/politicaDeTratamientosPersonales.pdf"
                className="w-full h-full"
                title="Política de Seguridad de la Información y Tratamiento de Datos"
                style={{ border: 'none' }}
              ></iframe>
            </div>
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="modalAceptaPolitica"
                className="h-4 w-4 text-teal-600"
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

export default FormularioPQRSDF;
