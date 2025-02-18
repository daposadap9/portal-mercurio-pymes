import React, { useState } from 'react';

const MercurioArmaTuPlan = () => {
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

  // Opciones para la lista desplegable de servicios
  const serviciosOptions = [
    'Servicio A',
    'Servicio B',
    'Servicio C',
  ];

  // Opciones para la lista desplegable de medios de contacto
  const mediosContactoOptions = [
    'Whatsapp',
    'Correo electrónico',
    'Llamada',
  ];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar el formulario
    console.log(formData);
    alert('¡Formulario enviado!');
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-2xl rounded-xl">
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1" 
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1" 
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1" 
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1" 
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1" 
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
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1"
          ></textarea>
        </div>

        {/* Fila 7: Medio de contacto preferido (lista desplegable) */}
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-inset-sm p-1"
          >
            <option value="">Seleccione un medio</option>
            {mediosContactoOptions.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Fila 8: Checklist de política de privacidad y términos */}
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="aceptaPolitica" 
            name="aceptaPolitica" 
            checked={formData.aceptaPolitica} 
            onChange={handleChange}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="aceptaPolitica" className="ml-2 block text-md text-gray-700">
            Acepto la política de privacidad y los términos y condiciones
          </label>
        </div>

        {/* Fila 9: Botón de enviar */}
        <div>
          <button 
            type="submit"
            className="w-full bg-teal-500 text-white font-bold py-3 rounded-md transition-colors duration-300 hover:bg-teal-600"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default MercurioArmaTuPlan;
