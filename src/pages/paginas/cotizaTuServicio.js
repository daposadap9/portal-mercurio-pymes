// pages/paginas/cotizaTuServicio.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaLaptopCode, 
  FaBoxOpen, 
  FaRegImage, 
  FaRocket,
  FaMoneyBillWave,
  FaInfoCircle
} from 'react-icons/fa';
import { ThemeContext } from '@/context/ThemeContext';
import { TransactionContext } from '@/context/TransactionContext';
import { gql, useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';
import { useDebounce } from 'use-debounce';
import Cookies from 'js-cookie';

// Mutación para guardar la transacción en el backend
const SAVE_TRANSACTION = gql`
  mutation SaveTransaction($userId: String!, $input: TransactionInput!) {
    saveTransaction(userId: $userId, input: $input) {
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

const CotizaTuServicio = () => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { 
    selectedServices: globalServices, 
    total: globalTotal, 
    discount: globalDiscount, 
    updateTransaction 
  } = useContext(TransactionContext);

  // Estado local para la UI; se actualizará luego en el contexto global
  const [localServices, setLocalServices] = useState(globalServices);
  const [expandedCells, setExpandedCells] = useState({});

  const bgClass =
    theme === 'dark'
      ? 'bg-custom-gradient'
      : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';

  // Generación de userId persistente en cookie (para evitar crear múltiples registros)
  const [userId] = useState(() => {
    let uid = Cookies.get('userId');
    if (!uid) {
      uid = uuidv4();
      Cookies.set('userId', uid, { expires: 7 });
    }
    return uid;
  });

  const [saveTransaction] = useMutation(SAVE_TRANSACTION);

  // Debounce para evitar múltiples inserts mientras el usuario interactúa
  const [debouncedServices] = useDebounce(localServices, 500);

  // Función para alternar explicaciones
  const toggleExplanation = (service) => {
    setExplanations(prev => ({ ...prev, [service]: !prev[service] }));
  };

  // Opciones para cada servicio
  const options = [
    { label: '1 usuario', value: 3000000, startup: 750000 },
    { label: '5 usuarios', value: 9000000, startup: 3000000 },
    { label: '10 usuarios', value: 16200000, startup: 6750000 },
    { label: '20 usuarios', value: 24600000, startup: 8200000 },
    { label: '30 usuarios', value: 32400000, startup: 10800000 },
    { label: '50 usuarios', value: 42000000, startup: 14000000 },
  ];

  const options2 = [
    { label: '5 cajas', value: 210000 },
    { label: '10 cajas', value: 384000 },
    { label: '20 cajas', value: 696000 },
    { label: '30 cajas', value: 936000 },
    { label: '40 cajas', value: 1104000 },
    { label: '50 cajas', value: 1200000 },
  ];

  const options3 = [
    { label: '10667 imágenes', value: 1866666.67 },
    { label: '21333 imágenes', value: 3626666.67 },
    { label: '42667 imágenes', value: 7040000 },
    { label: '64000 imágenes', value: 10240000 },
    { label: '85333 imágenes', value: 13226666.67 },
    { label: '106667 imágenes', value: 16000000 },
  ];

  const serviceIcons = {
    software: <FaLaptopCode className="text-blue-600 mr-2 text-2xl icon-shadow" />,
    custodia: <FaBoxOpen className="text-green-600 mr-2 text-2xl icon-shadow" />,
    digitalizacion: <FaRegImage className="text-purple-600 mr-2 text-2xl icon-shadow" />,
  };

  // Función para actualizar la selección
  const handleServiceChange = (service, option, index) => {
    const key = `${service}-${index}`;
    let newSelection;
    if (localServices[service]?.label === option.label) {
      newSelection = { ...localServices, [service]: null };
      setExpandedCells(prev => ({ ...prev, [key]: false }));
    } else {
      const newExpanded = { ...expandedCells };
      Object.keys(newExpanded).forEach(k => {
        if (k.indexOf(service + '-') === 0) {
          newExpanded[k] = false;
        }
      });
      newExpanded[key] = true;
      newSelection = { ...localServices, [service]: option };
    }
    setLocalServices(newSelection);
  };

  const toggleCell = (service, option, index) => {
    const key = `${service}-${index}`;
    if (localServices[service]?.label === option.label) {
      setExpandedCells(prev => ({ ...prev, [key]: true }));
      return;
    }
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Cada vez que se estabiliza la selección (debounced), se recalculan total y descuento, se actualiza el contexto y se guarda en el backend.
  useEffect(() => {
    const softwareTotal = debouncedServices.software
      ? Number(debouncedServices.software.value) + Number(debouncedServices.software.startup)
      : 0;
    const custodiaTotal = debouncedServices.custodia ? Number(debouncedServices.custodia.value) : 0;
    const digitalizacionTotal = debouncedServices.digitalizacion ? Number(debouncedServices.digitalizacion.value) : 0;
    
    let count = 0;
    if (debouncedServices.software) count++;
    if (debouncedServices.custodia) count++;
    if (debouncedServices.digitalizacion) count++;
    
    let calculatedDiscount = 0;
    let calculatedTotal = 0;
    if (count === 1 && debouncedServices.software) {
      calculatedTotal = softwareTotal;
    } else {
      const subtotal = softwareTotal + custodiaTotal + digitalizacionTotal;
      if (count === 3) {
        calculatedDiscount = 0.1;
      } else if (count === 2) {
        calculatedDiscount = 0.07;
      }
      calculatedTotal = subtotal - subtotal * calculatedDiscount;
    }
    // Actualizamos el contexto global
    updateTransaction(debouncedServices, calculatedTotal, calculatedDiscount);

    // Guardamos o actualizamos la transacción en el backend
    if (userId) {
      saveTransaction({
        variables: {
          userId,
          input: {
            software: debouncedServices.software,
            custodia: debouncedServices.custodia,
            digitalizacion: debouncedServices.digitalizacion,
            total: calculatedTotal,
            discount: calculatedDiscount,
            state: "transaccion en formulario de pago"
          }
        }
      }).catch(err => console.error("Error al guardar la transacción:", err));
    }
  }, [debouncedServices, userId, saveTransaction, updateTransaction]);

  const subtotal =
    (localServices.software ? Number(localServices.software.value) : 0) +
    (localServices.custodia ? Number(localServices.custodia.value) : 0) +
    (localServices.digitalizacion ? Number(localServices.digitalizacion.value) : 0) +
    (localServices.software ? Number(localServices.software.startup) : 0);

  // Al pulsar "Pagar", se redirige a PaymentFormPSE sin pasar el total en el query
  const handlePayment = () => {
    if (
      globalTotal === 0 ||
      (!localServices.software &&
       !localServices.custodia &&
       !localServices.digitalizacion)
    ) {
      alert('Por favor, seleccione al menos un servicio para pagar.');
      return;
    }
    router.push({
      pathname: '/PaymentFormPSE',
      query: { previousPage: '/paginas/cotizaTuServicio' }
    });
  };

  // Función para renderizar cada celda (opción) de servicio
  const renderCell = (service, option, index) => {
    const cellKey = `${service}-${index}`;
    const isExpanded = expandedCells[cellKey];
    const isSelected = localServices[service]?.label === option.label;
    const expanded = isSelected || isExpanded;

    return (
      <div
        className={`group p-4 border rounded-lg cursor-pointer relative transition-colors duration-300 shadow-xl ${
          isSelected
            ? 'bg-teal-500 border-teal-500 text-white shadow-md'
            : `${bgClass} bg-white lg:hover:bg-teal-500 lg:hover:text-white lg:hover:border-white lg:hover:border lg:hover:shadow-md`
        }`}
        onClick={() => toggleCell(service, option, index)}
      >
        {!isSelected && (
          <div className={`absolute inset-0 ${bgClass} transition-opacity duration-300 rounded-md`}></div>
        )}
        <div className={`absolute inset-0 ${isSelected ? 'bg-teal-500' : 'bg-teal-600 opacity-0 lg:group-hover:opacity-100'} transition-opacity duration-300 rounded-md`}></div>
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            {serviceIcons[service]}
            <span className={`font-bold text-base md:text-lg ${isSelected ? 'text-shadow' : 'lg:group-hover:text-shadow'}`}>
              {option.label}
            </span>
          </div>
          {isSelected ? (
            <FaChevronUp className="text-2xl text-white text-shadow" />
          ) : expanded ? (
            <FaChevronUp className="text-2xl text-teal-600 lg:group-hover:text-white lg:group-hover:text-shadow" />
          ) : (
            <FaChevronDown className="text-2xl text-teal-600 lg:group-hover:text-white lg:group-hover:text-shadow" />
          )}
        </div>
        {expanded && (
          <div className="mt-2 text-sm relative z-10">
            <div className="flex items-center">
              <FaMoneyBillWave className={`text-green-500 mr-2 text-2xl icon-shadow ${isSelected ? 'text-shadow' : 'lg:group-hover:text-shadow'}`} />
              <span className={`font-bold text-base md:text-xl ${isSelected ? 'text-shadow' : 'lg:group-hover:text-shadow'}`}>
                Precio:
              </span>
              <span className={`ml-2 text-2xl font-extrabold ${isSelected ? 'text-shadow' : 'lg:group-hover:text-shadow'}`}>
                ${Number(option.value).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
              </span>
            </div>
            {service === 'software' && option.startup && (
              <div className="flex items-center mt-1">
                <FaRocket className={`text-red-500 mr-2 text-2xl icon-shadow ${isSelected ? 'text-shadow' : 'lg:group-hover:text-shadow'}`} />
                <span className={`font-bold text-base md:text-xl ${isSelected ? 'text-shadow' : 'lg:group-hover:text-shadow'}`}>
                  Startup:
                </span>
                <span className={`ml-2 text-2xl font-extrabold ${isSelected ? 'text-shadow' : 'lg:group-hover:text-shadow'}`}>
                  ${Number(option.startup).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleServiceChange(service, option, index);
          }}
          className="mt-2 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition-colors duration-200 shadow-md border-white border relative z-10"
        >
          Seleccionar
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-4xl font-extrabold text-center mb-8">
        ¡Cotiza tu servicio!
      </h1>
      {/* Vista para dispositivos móviles */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Software</h2>
              <span className="text-sm text-center block mb-2">Cantidad de usuarios</span>
              <button
                onClick={() =>
                  router.push({
                    pathname: '/paginas/servicios/mercurioPYMES',
                    query: { previousPage: '/paginas/cotizaTuServicio' },
                  })
                }
                className="mb-4 bg-teal-600 text-white px-3 py-1 rounded-full hover:bg-teal-700 transition-colors duration-200 shadow-md border-white border flex items-center justify-center"
              >
                <FaInfoCircle className="mr-2" /> ¿Qué significa?
              </button>
            </div>
            {options.map((option, index) => renderCell('software', option, index))}
          </div>
          <div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Custodia</h2>
              <span className="text-sm text-center block mb-2">Cantidad de cajas</span>
              <button
                onClick={() =>
                  router.push({
                    pathname: '/paginas/servicios/mercurioCustodia',
                    query: { previousPage: '/paginas/cotizaTuServicio' },
                  })
                }
                className="mb-4 bg-teal-600 text-white px-3 py-1 rounded-full hover:bg-teal-700 transition-colors duration-200 shadow-md border-white border flex items-center justify-center"
              >
                <FaInfoCircle className="mr-2" /> ¿Qué significa?
              </button>
            </div>
            {options2.map((option, index) => renderCell('custodia', option, index))}
          </div>
          <div>
            <div className="flex flex-col justify-center items-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Digitalización</h2>
              <span className="text-sm text-center block mb-2">Cantidad de imágenes</span>
              <button
                onClick={() =>
                  router.push({
                    pathname: '/paginas/servicios/mercurioDigitalizacion',
                    query: { previousPage: '/paginas/cotizaTuServicio' },
                  })
                }
                className="mb-4 bg-teal-600 text-white px-3 py-1 rounded-full hover:bg-teal-700 transition-colors duration-200 shadow-md border-white border flex items-center justify-center"
              >
                <FaInfoCircle className="mr-2" /> ¿Qué significa?
              </button>
            </div>
            {options3.map((option, index) => renderCell('digitalizacion', option, index))}
          </div>
        </div>
        <div className="mt-8 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Resumen</h2>
          <ul className="text-sm md:text-base">
            {localServices.software && (
              <li className="mb-2">
                <strong>Software:</strong> {localServices.software.label} - ${Number(localServices.software.value).toLocaleString('es-ES')} + Startup - ${Number(localServices.software.startup).toLocaleString('es-ES')}
              </li>
            )}
            {localServices.custodia && (
              <li className="mb-2">
                <strong>Custodia:</strong> {localServices.custodia.label} - ${Number(localServices.custodia.value).toLocaleString('es-ES')}
              </li>
            )}
            {localServices.digitalizacion && (
              <li className="mb-2">
                <strong>Digitalización:</strong> {localServices.digitalizacion.label} - ${Number(localServices.digitalizacion.value).toLocaleString('es-ES')}
              </li>
            )}
          </ul>
          <div className="mt-4 text-sm md:text-base">
            <strong>Subtotal:</strong> ${Math.round(subtotal).toLocaleString('es-ES')}
          </div>
          {globalDiscount > 0 && (
            <div className="mt-2 text-green-600 text-sm md:text-base">
              <strong>Descuento:</strong> {(globalDiscount * 100).toFixed(0)}%
            </div>
          )}
          <div className="mt-4 text-2xl md:text-4xl font-bold">
            <strong>Total:</strong> ${Math.round(globalTotal).toLocaleString('es-ES')}
          </div>
          <button
            onClick={handlePayment}
            className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-200 shadow-md border-white border"
          >
            Pagar
          </button>
        </div>
      </div>
      {/* Vista para desktop */}
      <div className="hidden lg:block">
        <table className="min-w-full bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden">
          <thead className="bg-custom-footer">
            <tr>
              <th className="py-4 px-6 text-xl text-shadow">
                <div className="flex flex-col items-center">
                  <span>Software</span>
                  <span className="text-sm">Cantidad de usuarios</span>
                  <button
                    onClick={() =>
                      router.push({
                        pathname: '/paginas/servicios/mercurioPYMES',
                        query: { previousPage: '/paginas/cotizaTuServicio' },
                      })
                    }
                    className="mt-1 bg-teal-500 border border-white shadow-lg text-white text-xs px-2 py-1 rounded hover:bg-teal-600 transition-colors"
                  >
                    ¿Qué significa?
                  </button>
                </div>
              </th>
              <th className="py-4 px-6 text-xl text-shadow">
                <div className="flex flex-col items-center">
                  <span>Custodia</span>
                  <span className="text-sm">Cantidad de cajas</span>
                  <button
                    onClick={() =>
                      router.push({
                        pathname: '/paginas/servicios/mercurioCustodia',
                        query: { previousPage: '/paginas/cotizaTuServicio' },
                      })
                    }
                    className="mt-1 bg-teal-500 border border-white shadow-lg text-white text-xs px-2 py-1 rounded hover:bg-teal-600 transition-colors"
                  >
                    ¿Qué significa?
                  </button>
                </div>
              </th>
              <th className="py-4 px-6 text-xl text-shadow">
                <div className="flex flex-col items-center">
                  <span>Digitalización</span>
                  <span className="text-sm">Cantidad de imágenes</span>
                  <button
                    onClick={() =>
                      router.push({
                        pathname: '/paginas/servicios/mercurioDigitalizacion',
                        query: { previousPage: '/paginas/cotizaTuServicio' },
                      })
                    }
                    className="mt-1 bg-teal-500 border border-white shadow-lg text-white text-xs px-2 py-1 rounded hover:bg-teal-600 transition-colors"
                  >
                    ¿Qué significa?
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {options.map((_, index) => (
              <tr key={index} className="border-b">
                <td className="py-3 px-4">{renderCell('software', options[index], index)}</td>
                <td className="py-3 px-4">{renderCell('custodia', options2[index], index)}</td>
                <td className="py-3 px-4">{renderCell('digitalizacion', options3[index], index)}</td>
              </tr>
            ))}
            <tr className="bg-custom-footer">
              <td colSpan="3" className="py-6 text-center font-bold">
                {globalDiscount > 0 && (
                  <div className="mb-2 text-xl">
                    ¡Felicidades! Tienes un {(globalDiscount * 100).toFixed(0)}% de descuento.
                  </div>
                )}
                {globalDiscount > 0 ? (
                  <div className="flex justify-center items-center space-x-4">
                    <span className="text-3xl line-through">
                      ${Math.round(subtotal).toLocaleString('es-ES')}
                    </span>
                    <span className="text-5xl">
                      ${Math.round(globalTotal).toLocaleString('es-ES')}
                    </span>
                  </div>
                ) : (
                  <div className="text-5xl">
                    ${Math.round(globalTotal).toLocaleString('es-ES')}
                  </div>
                )}
                <button
                  onClick={handlePayment}
                  className="mt-4 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-200 shadow-md border-white border"
                >
                  Pagar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

CotizaTuServicio.previousPage = '/paginas/cotizaTuServicio';
export default CotizaTuServicio;
