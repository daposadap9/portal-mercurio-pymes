import React, { useState, useEffect } from 'react';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaLaptopCode, 
  FaBoxOpen, 
  FaRegImage, 
  FaRocket,
  FaMoneyBillWave
} from 'react-icons/fa';

const CotizaTuServicio = () => {
  const [selectedServices, setSelectedServices] = useState({
    software: null,
    custodia: null,
    digitalizacion: null,
  });
  const [expandedCells, setExpandedCells] = useState({});
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [explanations, setExplanations] = useState({
    software: false,
    custodia: false,
    digitalizacion: false,
  });
  const toggleExplanation = (service) => {
    setExplanations(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const options = [
    { label: '1 usuario', value: 3000000, startup: 750000 },
    { label: '5 usuarios', value: 9000000, startup: 3000000 },
    { label: '10 usuarios', value: 16200000, startup: 6750000 },
    { label: '20 usuarios', value: 24600000, startup: 8200000 },
    { label: '30 usuarios', value: 32400000, startup: 10800000 },
    { label: '50 usuarios', value: 42000000, startup: 14000000 },
  ];

  const options2 = [
    { label: '5 cajas', value: 210000, startup: 750000 },
    { label: '10 cajas', value: 384000, startup: 3000000 },
    { label: '20 cajas', value: 696000, startup: 6750000 },
    { label: '30 cajas', value: 936000, startup: 8200000 },
    { label: '40 cajas', value: 1104000, startup: 10800000 },
    { label: '50 cajas', value: 1200000, startup: 14000000 },
  ];

  const options3 = [
    { label: '10667 imágenes', value: 1866666.67, startup: 750000 },
    { label: '21333 imágenes', value: 3626666.67, startup: 3000000 },
    { label: '42667 imágenes', value: 7040000, startup: 6750000 },
    { label: '64000 imágenes', value: 10240000, startup: 8200000 },
    { label: '85333 imágenes', value: 13226666.67, startup: 10800000 },
    { label: '106667 imágenes', value: 16000000, startup: 14000000 },
  ];

  const serviceIcons = {
    software: <FaLaptopCode className="text-blue-600 mr-2 text-2xl" />,
    custodia: <FaBoxOpen className="text-green-600 mr-2 text-2xl" />,
    digitalizacion: <FaRegImage className="text-purple-600 mr-2 text-2xl" />,
  };

  const handleServiceChange = (service, option, index) => {
    const key = `${service}-${index}`;
    if (selectedServices[service]?.label === option.label) {
      setSelectedServices(prev => ({ ...prev, [service]: null }));
      setExpandedCells(prev => ({ ...prev, [key]: false }));
    } else {
      const newExpanded = { ...expandedCells };
      Object.keys(newExpanded).forEach(k => {
        // Reemplazamos startsWith por indexOf
        if (k.indexOf(service + '-') === 0) {
          newExpanded[k] = false;
        }
      });
      newExpanded[key] = true;
      setExpandedCells(newExpanded);
      setSelectedServices(prev => ({ ...prev, [service]: option }));
    }
  };

  const toggleCell = (service, option, index) => {
    const key = `${service}-${index}`;
    if (selectedServices[service]?.label === option.label) {
      setExpandedCells(prev => ({ ...prev, [key]: true }));
      return;
    }
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const priceSoftware = selectedServices.software ? Number(selectedServices.software.value) : 0;
    const priceCustodia = selectedServices.custodia ? Number(selectedServices.custodia.value) : 0;
    const priceDigitalizacion = selectedServices.digitalizacion ? Number(selectedServices.digitalizacion.value) : 0;
    const subtotal = priceSoftware + priceCustodia + priceDigitalizacion;
    const count = [selectedServices.software, selectedServices.custodia, selectedServices.digitalizacion].filter(s => s !== null).length;
    let disc = 0;
    if (count === 3) {
      disc = 0.1;
    } else if (count === 2) {
      disc = 0.07;
    }
    setDiscount(disc);
    setTotal(subtotal - subtotal * disc);
  }, [selectedServices]);

  const renderCell = (service, option, index) => {
    const cellKey = `${service}-${index}`;
    const isExpanded = expandedCells[cellKey];
    const isSelected = selectedServices[service]?.label === option.label;

    return (
      <div
        className={`group p-4 border rounded-lg cursor-pointer relative transition-colors duration-300 ${
          isSelected
            ? 'bg-teal-500 border-teal-500 text-white shadow-md'
            : 'bg-white hover:bg-teal-500 hover:text-white hover:shadow-md'
        }`}
        onClick={() => toggleCell(service, option, index)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {serviceIcons[service]}
            <span className={`font-bold text-lg ${isSelected ? 'text-shadow' : 'group-hover:text-shadow'}`}>
              {option.label}
            </span>
          </div>
          {isExpanded ? (
            <FaChevronUp 
              className={`text-2xl ${isSelected ? 'text-white text-shadow' : 'text-teal-600 group-hover:text-white group-hover:text-shadow'}`} 
            />
          ) : (
            <FaChevronDown 
              className={`text-2xl ${isSelected ? 'text-white text-shadow' : 'text-teal-600 group-hover:text-white group-hover:text-shadow'}`} 
            />
          )}
        </div>
        {isExpanded && (
          <div className="mt-2 text-sm">
            <div className="flex items-center">
              <FaMoneyBillWave className={`text-green-500 mr-2 text-2xl ${isSelected ? 'text-shadow' : 'group-hover:text-shadow'}`} />
              <span className={`font-bold text-xl ${isSelected ? 'text-shadow' : 'group-hover:text-shadow'}`}>
                Precio:
              </span>
              <span className={`ml-2 text-2xl font-extrabold ${isSelected ? 'text-shadow' : 'group-hover:text-shadow'}`}>
                ${Number(option.value).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex items-center mt-1">
              <FaRocket className={`text-red-500 mr-2 text-2xl ${isSelected ? 'text-shadow' : 'group-hover:text-shadow'}`} />
              <span className={`font-bold text-xl ${isSelected ? 'text-shadow' : 'group-hover:text-shadow'}`}>
                Startup:
              </span>
              <span className={`ml-2 text-2xl font-extrabold ${isSelected ? 'text-shadow' : 'group-hover:text-shadow'}`}>
                ${Number(option.startup).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleServiceChange(service, option, index);
          }}
          className="mt-2 bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition-colors duration-200 shadow-md"
        >
          Seleccionar
        </button>
      </div>
    );
  };

  const subtotal =
    (selectedServices.software ? Number(selectedServices.software.value) : 0) +
    (selectedServices.custodia ? Number(selectedServices.custodia.value) : 0) +
    (selectedServices.digitalizacion ? Number(selectedServices.digitalizacion.value) : 0);

  return (
    <div className="container mx-auto p-4">
      {/* Asegúrate de tener este estilo global en tu proyecto */}
      <style jsx global>{`
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
      <h1 className="text-4xl font-extrabold text-center mb-8 text-shadow">¡Cotiza tu servicio!</h1>
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Software</h2>
            {options.map((option, index) => renderCell('software', option, index))}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Custodia</h2>
            {options2.map((option, index) => renderCell('custodia', option, index))}
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Digitalización</h2>
            {options3.map((option, index) => renderCell('digitalizacion', option, index))}
          </div>
        </div>
        <div className="mt-8 p-4 border rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Resumen</h2>
          <ul>
            {selectedServices.software && (
              <li className="mb-2">
                <strong>Software:</strong> {selectedServices.software.label} - ${Number(selectedServices.software.value).toLocaleString('es-ES')}
              </li>
            )}
            {selectedServices.custodia && (
              <li className="mb-2">
                <strong>Custodia:</strong> {selectedServices.custodia.label} - ${Number(selectedServices.custodia.value).toLocaleString('es-ES')}
              </li>
            )}
            {selectedServices.digitalizacion && (
              <li className="mb-2">
                <strong>Digitalización:</strong> {selectedServices.digitalizacion.label} - ${Number(selectedServices.digitalizacion.value).toLocaleString('es-ES')}
              </li>
            )}
          </ul>
          <div className="mt-4">
            <strong>Subtotal:</strong> ${Math.round(subtotal).toLocaleString('es-ES')}
          </div>
          {discount > 0 && (
            <div className="mt-2 text-green-600">
              <strong>Descuento:</strong> {(discount * 100).toFixed(0)}%
            </div>
          )}
          <div className="mt-4 text-2xl font-bold">
            <strong>Total:</strong> ${Math.round(total).toLocaleString('es-ES')}
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <table className="min-w-full bg-white border border-gray-200 shadow-2xl rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-shadow">
            <tr>
              <th className="py-4 px-6 text-xl text-shadow">
                <div className="flex flex-col items-center">
                  <span>Software</span>
                  <span className="text-sm">Cantidad de usuarios</span>
                  <button 
                    onClick={() => toggleExplanation('software')}
                    className="mt-1 bg-teal-500 border border-white shadow-lg text-white text-xs px-2 py-1 rounded hover:bg-teal-600 transition-colors"
                  >
                    ¿Qué significa?
                  </button>
                  {explanations.software && (
                    <span className="text-xs text-gray-300 italic">
                      Representa el número de usuarios licenciados anualmente.
                    </span>
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-xl text-shadow">
                <div className="flex flex-col items-center">
                  <span>Custodia</span>
                  <span className="text-sm">Cantidad de cajas</span>
                  <button 
                    onClick={() => toggleExplanation('custodia')}
                    className="mt-1 bg-teal-500 border border-white shadow-lg text-white text-xs px-2 py-1 rounded hover:bg-teal-600 transition-colors"
                  >
                    ¿Qué significa?
                  </button>
                  {explanations.custodia && (
                    <span className="text-xs text-gray-300 italic">
                      Indica el número de cajas custodiadas anualmente.
                    </span>
                  )}
                </div>
              </th>
              <th className="py-4 px-6 text-xl text-shadow">
                <div className="flex flex-col items-center">
                  <span>Digitalización</span>
                  <span className="text-sm">Cantidad de imágenes</span>
                  <button 
                    onClick={() => toggleExplanation('digitalizacion')}
                    className="mt-1 bg-teal-500 border border-white shadow-lg text-white text-xs px-2 py-1 rounded hover:bg-teal-600 transition-colors"
                  >
                    ¿Qué significa?
                  </button>
                  {explanations.digitalizacion && (
                    <span className="text-xs text-gray-300 italic">
                      Representa el total de imágenes digitalizadas (valor total).
                    </span>
                  )}
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
                {discount > 0 && (
                  <div className="mb-2 text-green-600 text-xl">
                    ¡Felicidades! Tienes un {(discount * 100).toFixed(0)}% de descuento.
                  </div>
                )}
                {discount > 0 ? (
                  <div className="flex justify-center items-center space-x-4">
                    <span className="text-3xl line-through">
                      ${Math.round(subtotal).toLocaleString('es-ES')}
                    </span>
                    <span className="text-5xl">
                      ${Math.round(total).toLocaleString('es-ES')}
                    </span>
                  </div>
                ) : (
                  <div className="text-5xl">
                    ${Math.round(total).toLocaleString('es-ES')}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CotizaTuServicio;
