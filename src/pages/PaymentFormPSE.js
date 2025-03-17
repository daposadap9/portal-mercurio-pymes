import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import Cookies from 'js-cookie';

const GET_TRANSACTION = gql`
  query getTransaction($userId: String!) {
    getTransaction(userId: $userId) {
      id
      userId
      software
      custodia
      digitalizacion
      total
      discount
      state
      createdAt
    }
  }
`;

const PaymentFormPSE = () => {
  const router = useRouter();
  const { previousPage } = router.query;
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    banco: '',
    nombre: '',
    documento: '',
    email: '',
    telefono: '',
  });

  // Leer la cookie "userId"
  useEffect(() => {
    const uid = Cookies.get('userId');
    if (uid) {
      setUserId(uid);
    } else {
      // Para pruebas, asigna un valor por defecto (esto no es ideal en producción)
      setUserId("default-user");
    }
  }, []);

  // Ejecutar la query solo cuando userId esté definido
  const { data, loading, error } = useQuery(GET_TRANSACTION, {
    variables: { userId },
    skip: !userId,
  });

  // Extraer el total; si no existe, se usa 0
  const total = data?.getTransaction?.total || 0;

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
    alert('¡Pago procesado con éxito!');
    router.push({
      pathname: '/paginas/servicios/PaymentSuccess',
      query: { previousPage: previousPage || '/paginas/cotizaTuServicio' }
    });
  };

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error al cargar la transacción: {error.message}</p>;

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-50 shadow-2xl rounded-xl">
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
            className="mt-1 block w-full rounded-md border-gray-300 text-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {/* Monto a pagar (valor obtenido desde el backend) */}
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
            className="mt-1 block w-full rounded-md border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {/* Botón de enviar */}
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

PaymentFormPSE.previousPage = '/paginas/cotizaTuServicio';
export default PaymentFormPSE;
