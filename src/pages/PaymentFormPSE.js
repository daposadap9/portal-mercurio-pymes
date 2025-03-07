// pages/paginas/PaymentFormPSE.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const PaymentFormPSE = () => {
  const router = useRouter();
  const { total } = router.query; // ya no extraemos previousPage desde el query aquí

  const [formData, setFormData] = useState({
    banco: '',
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
  });

  // Opciones de bancos para la lista desplegable
  const bancos = [
    'Bancolombia',
    'Banco de Bogotá',
    'Davivienda',
    'BBVA',
    'Colpatria',
    'Banco Popular',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de procesamiento de pago
    console.log(formData);
    alert('¡Pago procesado con éxito!');
    router.push('/paginas/servicios/PaymentSuccess'); // Redirigir a una página de éxito
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-50 shadow-2xl rounded-xl relative">
      {/* Nota: Se eliminó la instancia local de <SubNavigation /> */}
      <div className="flex justify-center mb-6">
        <img src="/pse.png" alt="Logo PSE" className="h-32" />
      </div>
      <h2 className="text-2xl font-bold text-teal-600 text-center mb-6">Pago por PSE</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selección de banco */}
        <div>
          <label htmlFor="banco" className="block text-md font-bold text-gray-700">
            Selecciona tu banco
          </label>
          <select 
            id="banco" 
            name="banco" 
            value={formData.banco} 
            onChange={handleChange} 
            required
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
          >
            <option value="">Elige un banco</option>
            {bancos.map((banco, idx) => (
              <option key={idx} value={banco}>{banco}</option>
            ))}
          </select>
        </div>
        {/* Nombre completo */}
        <div>
          <label htmlFor="nombre" className="block text-md font-bold text-gray-700">
            Nombre completo
          </label>
          <input 
            type="text" 
            id="nombre" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required
            placeholder="Tu nombre completo"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
          />
        </div>
        {/* Documento de identidad */}
        <div>
          <label htmlFor="documento" className="block text-md font-bold text-gray-700">
            Documento de identidad
          </label>
          <input 
            type="text" 
            id="documento" 
            name="documento" 
            value={formData.documento} 
            onChange={handleChange} 
            required
            placeholder="Número de documento"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
          />
        </div>
        {/* Email */}
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
            placeholder="correo@ejemplo.com"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
          />
        </div>
        {/* Teléfono celular */}
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
            placeholder="+57 300 0000000"
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
          />
        </div>
        {/* Monto a pagar */}
        <div>
          <label htmlFor="monto" className="block text-md font-bold text-gray-700">
            Monto a pagar
          </label>
          <input 
            type="text" 
            id="monto" 
            name="monto" 
            value={total} 
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
          />
        </div>
        {/* Botón de Enviar */}
        <div>
          <button 
            type="submit"
            className="w-full bg-teal-600 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-700"
          >
            Pagar con PSE
          </button>
        </div>
      </form>
    </div>
  );
};
PaymentFormPSE.previousPage = '/paginas/cotizaTuServicio'

export default PaymentFormPSE;