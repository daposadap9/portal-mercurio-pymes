// components/FormularioPQRSDF.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const FormularioPQRSDF = ({ tipoSolicitud: tipoSolicitudProp }) => {
  const router = useRouter();
  // Extraemos el tipo de solicitud de la query si no se pasó por props
  const { tipoSolicitud: tipoSolicitudQuery } = router.query;
  const tipoInicial = tipoSolicitudProp || tipoSolicitudQuery || "";

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
  });

  // Si el valor de la prop o el query cambian, actualizamos el campo tipoSolicitud.
  useEffect(() => {
    setFormData(prev => ({ ...prev, tipoSolicitud: tipoSolicitudProp || tipoSolicitudQuery || "" }));
  }, [tipoSolicitudProp, tipoSolicitudQuery]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí implementar la lógica de envío
    console.log(formData);
    alert('¡Formulario enviado!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
      <h1 className="text-2xl font-bold text-center text-teal-600 mb-8">PQRSDF</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo readonly para el Tipo de solicitud */}
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
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Anexo */}
        <div>
          <label htmlFor="anexo" className="block text-md font-bold text-gray-700">
            Anexo
          </label>
          <input
            type="file"
            id="anexo"
            name="anexo"
            onChange={handleChange}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>

        {/* Observación */}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            placeholder="Escribe aquí tus comentarios o dudas..."
          ></textarea>
        </div>

        {/* Texto informativo de horario */}
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-md text-gray-700">
            La solicitud de PQRSDF funciona únicamente los días hábiles de lunes a viernes entre las 6 am y las 6 pm.
          </p>
        </div>

        {/* Checkbox de autorización para notificaciones */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="aceptaNotificaciones"
            name="aceptaNotificaciones"
            checked={formData.aceptaNotificaciones}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="aceptaNotificaciones" className="ml-2 block text-md font-bold text-gray-700">
            Al presentar esta PQRSDF por este medio, acepto y autorizo a XXXXXXXXX para que todas las notificaciones sean enviadas al correo electrónico registrado, esto con base en el artículo 56 de la ley 143 de 2011.
          </label>
        </div>

        {/* Checkbox de aceptación de política y términos */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="aceptaTerminos"
            name="aceptaTerminos"
            checked={formData.aceptaTerminos}
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded mt-1"
          />
          <label htmlFor="aceptaTerminos" className="ml-2 block text-md font-bold text-gray-700">
            Acepto la política de privacidad y los términos y condiciones.
          </label>
        </div>

        {/* Botón de continuar */}
        <div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-bold py-3 rounded-md transition-colors duration-300 hover:bg-teal-600"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPQRSDF;
