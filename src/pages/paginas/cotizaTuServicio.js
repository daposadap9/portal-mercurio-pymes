import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp,
  FaLaptopCode, FaBoxOpen, FaRegImage, FaRocket, FaMoneyBillWave, FaEdit, FaSave, FaTrash
} from 'react-icons/fa';
import { ThemeContext } from '@/context/ThemeContext';
import { TransactionContext } from '@/context/TransactionContext';
import { UserContext } from '@/context/UserContext';
import { useDropdown } from '@/context/DropdownContext';
import { v4 as uuidv4 } from 'uuid';
import { useDebounce } from 'use-debounce';
import Cookies from 'js-cookie';

// Mutaciones y consultas GraphQL
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

const GET_SERVICES = gql`
  query GetServices {
    services {
      id
      name
      icon
      options {
        id
        label
        value
        startup
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_SERVICE = gql`
  mutation CreateService($name: String!, $icon: String) {
    createService(name: $name, icon: $icon) {
      id
      name
      icon
      options {
        id
        label
        value
        startup
      }
    }
  }
`;

const CREATE_SERVICE_OPTION = gql`
  mutation CreateServiceOption($serviceId: String!, $label: String!, $value: Float!, $startup: Float) {
    createServiceOption(serviceId: $serviceId, label: $label, value: $value, startup: $startup) {
      id
      label
      value
      startup
      serviceId
    }
  }
`;

const UPDATE_SERVICE_OPTION = gql`
  mutation UpdateServiceOption($id: ID!, $label: String, $value: Float, $startup: Float) {
    updateServiceOption(id: $id, label: $label, value: $value, startup: $startup) {
      id
      label
      value
      startup
    }
  }
`;

const DELETE_SERVICE_OPTION = gql`
  mutation DeleteServiceOption($id: ID!) {
    deleteServiceOption(id: $id) {
      id
    }
  }
`;

const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $name: String!) {
    updateService(id: $id, name: $name) {
      id
      name
    }
  }
`;

const CotizaTuServicio = ({ disabledProvider }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { selectedServices: globalServices, total: globalTotal, discount: globalDiscount, updateTransaction } = useContext(TransactionContext);
  const { user } = useContext(UserContext);
  const { dropdownActive } = useDropdown();
  const isAnyDropdownActive = disabledProvider ? false : (dropdownActive.services || dropdownActive.tramites);

  const [servicesData, setServicesData] = useState([]);
  const [localServices, setLocalServices] = useState({});
  const [editableOptions, setEditableOptions] = useState({});
  const [expandedCells, setExpandedCells] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingTitles, setEditingTitles] = useState({});
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);
  const [isMobileSlider, setIsMobileSlider] = useState(false);

  const [userId] = useState(() => {
    let uid = Cookies.get('userId');
    if (!uid) {
      uid = uuidv4();
      Cookies.set('userId', uid, { expires: 7 });
    }
    return uid;
  });

  const { data, refetch } = useQuery(GET_SERVICES);
  const [saveTransaction] = useMutation(SAVE_TRANSACTION);
  const [createService] = useMutation(CREATE_SERVICE);
  const [createServiceOption] = useMutation(CREATE_SERVICE_OPTION);
  const [updateServiceOption] = useMutation(UPDATE_SERVICE_OPTION);
  const [deleteServiceOption] = useMutation(DELETE_SERVICE_OPTION);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [debouncedServices] = useDebounce(localServices, 500);

  useEffect(() => {
    if (data && data.services) {
      setServicesData(data.services);
      const optionsMap = {};
      data.services.forEach(service => {
        optionsMap[service.id] = service.options;
      });
      setEditableOptions(optionsMap);
    }
  }, [data]);

  const handleAddService = () => {
    alert("Función para agregar servicio no implementada.");
  };

  const handleAddOption = (service) => {
    alert("Función para agregar opción no implementada para el servicio: " + service.name);
  };

  const handleServiceChange = (serviceId, option, index) => {
    const key = `${serviceId}-${index}`;
    let newSelection;
    if (localServices[serviceId]?.id === option.id) {
      newSelection = { ...localServices, [serviceId]: null };
      setExpandedCells(prev => ({ ...prev, [key]: false }));
    } else {
      const newExpanded = { ...expandedCells };
      Object.keys(newExpanded).forEach(k => {
        if (k.startsWith(serviceId + '-')) {
          newExpanded[k] = false;
        }
      });
      newExpanded[key] = true;
      newSelection = { ...localServices, [serviceId]: option };
    }
    setLocalServices(newSelection);
  };

  const toggleCell = (serviceId, option, index) => {
    const key = `${serviceId}-${index}`;
    if (localServices[serviceId]?.id === option.id) {
      setExpandedCells(prev => ({ ...prev, [key]: true }));
      return;
    }
    setExpandedCells(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    let softwareTotal = 0, custodiaTotal = 0, digitalizacionTotal = 0;
    servicesData.forEach(service => {
      const serviceName = service.name.toLowerCase();
      const selectedOption = localServices[service.id];
      if (selectedOption) {
        if (serviceName.includes('software')) {
          softwareTotal = Number(selectedOption.value) + Number(selectedOption.startup || 0);
        } else if (serviceName.includes('custodia')) {
          custodiaTotal = Number(selectedOption.value);
        } else if (serviceName.includes('digital')) {
          digitalizacionTotal = Number(selectedOption.value);
        }
      }
    });
    let count = Object.values(localServices).filter(opt => opt).length;
    let calculatedDiscount = 0;
    let calculatedTotal = 0;
    if (count === 1) {
      calculatedTotal = softwareTotal || custodiaTotal || digitalizacionTotal;
    } else {
      const subtotal = softwareTotal + custodiaTotal + digitalizacionTotal;
      if (count === 3) {
        calculatedDiscount = 0.1;
      } else if (count === 2) {
        calculatedDiscount = 0.07;
      }
      calculatedTotal = subtotal - subtotal * calculatedDiscount;
    }
    updateTransaction(localServices, calculatedTotal, calculatedDiscount);
    if (userId) {
      saveTransaction({
        variables: {
          userId,
          input: {
            software: servicesData.find(s => s.name.toLowerCase().includes('software'))
              ? localServices[servicesData.find(s => s.name.toLowerCase().includes('software')).id]
              : null,
            custodia: servicesData.find(s => s.name.toLowerCase().includes('custodia'))
              ? localServices[servicesData.find(s => s.name.toLowerCase().includes('custodia')).id]
              : null,
            digitalizacion: servicesData.find(s => s.name.toLowerCase().includes('digital'))
              ? localServices[servicesData.find(s => s.name.toLowerCase().includes('digital')).id]
              : null,
            total: calculatedTotal,
            discount: calculatedDiscount,
            state: "transaccion en formulario de pago"
          }
        }
      }).catch(err => console.error("Error al guardar la transacción:", err));
    }
  }, [debouncedServices, userId, saveTransaction, updateTransaction, servicesData, localServices]);

  const subtotal = servicesData.reduce((acc, service) => {
    const selected = localServices[service.id];
    if (selected) {
      if (service.name.toLowerCase().includes('software')) {
        return acc + Number(selected.value) + Number(selected.startup || 0);
      }
      return acc + Number(selected.value);
    }
    return acc;
  }, 0);

  const handlePayment = () => {
    if (globalTotal === 0 || !Object.values(localServices).some(opt => opt)) {
      alert('Por favor, seleccione al menos un servicio para pagar.');
      return;
    }
    router.push({
      pathname: '/PaymentFormPSE',
      query: { previousPage: '/paginas/cotizaTuServicio' }
    });
  };

  useEffect(() => {
    const handleResize = () => setIsMobileSlider(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const extendedServices =
    servicesData.length > 1
      ? [servicesData[servicesData.length - 1], ...servicesData, servicesData[0]]
      : servicesData;

  const getSliderStyle = (position, isMobile, disableTransition) => {
    const base = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transition: disableTransition ? 'none' : 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    };
    if (isMobile) {
      switch (position) {
        case -1:
          return {
            ...base,
            transform: 'translate(calc(-50% - 230px), -50%) scale(0.4)',
            opacity: 0.1,
            zIndex: 1,
            filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.9))'
          };
        case 0:
          return {
            ...base,
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
            zIndex: 3,
            filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))'
          };
        case 1:
          return {
            ...base,
            transform: 'translate(calc(-50% + 230px), -50%) scale(0.8)',
            opacity: 0.4,
            zIndex: 1,
            filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.8))'
          };
        case 2:
          return {
            ...base,
            transform: 'translate(calc(-50% + 460px), -50%) scale(0.65)',
            opacity: 0.2,
            zIndex: 0,
            filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))'
          };
        default:
          return { opacity: 0, pointerEvents: 'none' };
      }
    } else {
      switch (position) {
        case -1:
          return {
            ...base,
            transform: 'translate(calc(-50% - 28vw), calc(-50% + 5vh)) scale(0.4)',
            opacity: 0.1,
            zIndex: 1,
            filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.4))'
          };
        case 0:
          return {
            ...base,
            transform: 'translate(-50%, -50%) scale(1)',
            opacity: 1,
            zIndex: 3,
            filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))'
          };
        case 1:
          return {
            ...base,
            transform: 'translate(calc(-50% + 28vw), calc(-50% + 5vh)) scale(0.7)',
            opacity: 0.4,
            zIndex: 1,
            filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.8))'
          };
        case 2:
          return {
            ...base,
            transform: 'translate(calc(-50% + 56vw), calc(-50% + 8vh)) scale(0.5)',
            opacity: 0.2,
            zIndex: 0,
            filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))'
          };
        default:
          return { opacity: 0, pointerEvents: 'none' };
      }
    }
  };

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1100);
  }, [isTransitioning]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1100);
  }, [isTransitioning]);

  const handleNext = useCallback(() => {
    nextSlide();
  }, [nextSlide]);

  const handlePrev = useCallback(() => {
    prevSlide();
  }, [prevSlide]);

  useEffect(() => {
    if (currentSlide === extendedServices.length - 1) {
      setTimeout(() => {
        setDisableTransition(true);
        setCurrentSlide(1);
        setTimeout(() => setDisableTransition(false), 50);
      }, 1100);
    }
    if (currentSlide === 0) {
      setTimeout(() => {
        setDisableTransition(true);
        setCurrentSlide(extendedServices.length - 2);
        setTimeout(() => setDisableTransition(false), 50);
      }, 1100);
    }
  }, [currentSlide, extendedServices.length]);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragThreshold = 50;

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - startX.current;
    if (delta > dragThreshold) {
      handlePrev();
    } else if (delta < -dragThreshold) {
      handleNext();
    }
  };

  const getBehindUrl = () => {
    const activeService = extendedServices[currentSlide];
    if (!activeService) return '/paginas/cotizaTuServicio';
    const name = activeService.name.toLowerCase();
    if (name.includes('software')) return '/paginas/servicios/mercurioPYMES';
    if (name.includes('custodia')) return '/paginas/servicios/mercurioCustodia';
    if (name.includes('digital')) return '/paginas/servicios/mercurioDigitalizacion';
    return '/paginas/cotizaTuServicio';
  };

  const renderServiceCard = (service, idx) => (
    <div
      key={`${service.id}-${idx}`}
      className="card bg-white p-4 rounded-lg shadow-lg relative overflow-y-auto w-80 h-96"
    >
      <div className="card-header flex flex-col items-center">
        <div className="flex items-center">
          {service.name.toLowerCase().includes('software') && <FaLaptopCode className="text-blue-600 mr-2 text-2xl" />}
          {service.name.toLowerCase().includes('custodia') && <FaBoxOpen className="text-green-600 mr-2 text-2xl" />}
          {service.name.toLowerCase().includes('digital') && <FaRegImage className="text-purple-600 mr-2 text-2xl" />}
        </div>
        <div className="flex items-center justify-center">
          {editingTitles[service.id] ? (
            <>
              <input
                type="text"
                value={service.name}
                className="text-xl font-bold my-2 p-1 border rounded text-center"
                onChange={(e) => {
                  const newServices = servicesData.map(s =>
                    s.id === service.id ? { ...s, name: e.target.value } : s
                  );
                  setServicesData(newServices);
                }}
              />
              <button
                onClick={() => {
                  updateService({ variables: { id: service.id, name: service.name } })
                    .then(() => setEditingTitles(prev => ({ ...prev, [service.id]: false })))
                    .catch(err => console.error("Error al actualizar el servicio:", err));
                }}
                className="ml-2"
              >
                <FaSave className="text-green-600" />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold my-2 text-center">{service.name}</h2>
              <button
                onClick={() => setEditingTitles(prev => ({ ...prev, [service.id]: true }))}
                className="ml-2"
              >
                <FaEdit className="text-yellow-500" />
              </button>
            </>
          )}
        </div>
        <span className="text-sm">
          {service.name.toLowerCase().includes('software')
            ? 'Cantidad de usuarios'
            : service.name.toLowerCase().includes('custodia')
            ? 'Cantidad de cajas'
            : service.name.toLowerCase().includes('digital')
            ? 'Cantidad de imágenes'
            : 'Descripción no definida'}
        </span>
      </div>
      <div className="card-body mt-4">
        {editableOptions[service.id] &&
          editableOptions[service.id].map((option, idx2) => (
            <div key={`${service.id}-${idx2}`} className="mb-4 border p-3 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                {editMode ? (
                  <input
                    type="text"
                    value={option.label}
                    className="font-bold text-base p-1 border rounded"
                    onChange={(e) => {
                      const newOptions = { ...editableOptions };
                      newOptions[service.id][idx2] = { ...option, label: e.target.value };
                      setEditableOptions(newOptions);
                    }}
                  />
                ) : (
                  <span className="font-bold text-base">{option.label}</span>
                )}
                <button onClick={() => toggleCell(service.id, option, idx2)} className="text-xl">
                  {expandedCells[`${service.id}-${idx2}`] || localServices[service.id]?.id === option.id
                    ? <FaChevronUp />
                    : <FaChevronDown />}
                </button>
              </div>
              {(expandedCells[`${service.id}-${idx2}`] || localServices[service.id]?.id === option.id) && !editMode && (
                <div className="mt-2 text-sm">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-green-500 mr-2 text-2xl" />
                    <span className="font-bold text-base">Precio:</span>
                    <span className="ml-2 text-2xl font-extrabold">
                      ${Number(option.value).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {service.name.toLowerCase().includes('software') && option.startup && (
                    <div className="flex items-center mt-1">
                      <FaRocket className="text-teal-500 mr-2 text-2xl" />
                      <span className="font-bold text-base">Startup:</span>
                      <span className="ml-2 text-2xl font-extrabold">
                        ${Number(option.startup).toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {!editMode && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleServiceChange(service.id, option, idx2);
                  }}
                  className="mt-2 bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-700 transition-colors shadow-md border"
                >
                  Seleccionar
                </button>
              )}
              {editMode && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newLabel = prompt("Nuevo Label:", option.label);
                      if (newLabel === null) return;
                      const newValue = parseFloat(prompt("Nuevo Valor:", option.value));
                      let newStartup = option.startup;
                      if (service.name.toLowerCase().includes('software')) {
                        const startupInput = prompt("Nuevo Startup:", option.startup || 0);
                        newStartup = startupInput ? parseFloat(startupInput) : 0;
                      }
                      updateServiceOption({ variables: { id: option.id, label: newLabel, value: newValue, startup: newStartup }})
                        .then(() => refetch())
                        .catch(err => console.error("Error updating option:", err));
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors shadow-md border"
                  >
                    <FaSave className="mr-1" /> Guardar
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("¿Eliminar opción?")) {
                        deleteServiceOption({ variables: { id: option.id }})
                          .then(() => refetch())
                          .catch(err => console.error("Error deleting option:", err));
                      }
                    }}
                    className="bg-teal-500 text-white px-3 py-1 rounded hover:bg-teal-700 transition-colors shadow-md border"
                  >
                    <FaTrash className="mr-1" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        {editMode && (
          <button onClick={() => handleAddOption(service)} className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition-colors mt-2">
            Agregar Opción
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="relative min-h-screen bg-gray-100">
        {/* PARTE IZQUIERDA: contenido principal */}
        <div className="relative z-20 transition-all duration-700 w-1/3 ml-4 p-1">
          <div className={`flex justify-center text-2xl md:text-2xl font-bold text-teal-500 text-left mb-0 ${isAnyDropdownActive ? 'mt-10' : 'mt-0'}`}>
            <h3>
              Olvídate de los documentos físicos, digitalízalos con nosotros. La Gestión Documental Avanza y tu compañía también
            </h3>
          </div>
          {user && (
            <div className="flex flex-col items-start mb-4">
              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors mb-2"
              >
                {editMode ? 'Salir de edición' : 'Editar Cards'} <FaEdit className="inline ml-1" />
              </button>
              {editMode && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleAddService}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    Agregar Servicio
                  </button>
                </div>
              )}
            </div>
          )}
          {/* --- Slider de Cards manual (sin auto slide) --- */}
          {servicesData.length > 0 && (
            <div
              className="slider-wrapper"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            >
              <button onClick={handlePrev} className="nav-button prev-button">
                <FaChevronLeft size={18} />
              </button>
              <button onClick={handleNext} className="nav-button next-button">
                <FaChevronRight size={18} />
              </button>
              <div className="slider-container">
                {extendedServices.map((service, idx) => {
                  const relativePosition = idx - currentSlide;
                  if (relativePosition < -1 || relativePosition > 2) return null;
                  return (
                    <div
                      key={`${service.id}-extended-${idx}`}
                      className="slider-card"
                      style={getSliderStyle(relativePosition, isMobileSlider, disableTransition)}
                    >
                      {renderServiceCard(service, idx)}
                    </div>
                  );
                })}
              </div>
              <div className="indicator-container">
                {servicesData.map((_, index) => (
                  <div
                    key={index}
                    className={`indicator ${currentSlide - 1 === index ? 'active' : ''}`}
                    onClick={() => {
                      if (isTransitioning) return;
                      setIsTransitioning(true);
                      setCurrentSlide(index + 1);
                      setTimeout(() => {
                        setIsTransitioning(false);
                      }, 1100);
                    }}
                  />
                ))}
              </div>
              <style jsx>{`
                .slider-wrapper {
                  width: 100%;
                  max-width: 1300px;
                  margin: 0 auto;
                  position: relative;
                  height: ${isMobileSlider ? '40vh' : '50vh'};
                  overflow: hidden;
                }
                .slider-container {
                  position: relative;
                  width: 100%;
                  height: 100%;
                }
                .nav-button {
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  z-index: 30;
                  background: white;
                  border: none;
                  padding: 0.5rem;
                  border-radius: 9999px;
                  box-shadow: 0px 2px 13px rgba(0,0,0,0.9);
                  cursor: pointer;
                }
                .prev-button {
                  left: 1rem;
                }
                .next-button {
                  right: 1rem;
                }
                .indicator-container {
                  position: absolute;
                  bottom: 1rem;
                  left: 50%;
                  transform: translateX(-50%);
                  display: flex;
                  gap: 0.5rem;
                  z-index: 50;
                }
                .indicator {
                  width: 10px;
                  height: 10px;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.5);
                  cursor: pointer;
                  transition: background 0.3s ease, transform 0.3s ease;
                }
                .indicator.active {
                  background: #000;
                  transform: scale(1.2);
                }
              `}</style>
            </div>
          )}
          {/* --- Resumen: movido abajo de las Cards --- */}
          <div className="mt-8 p-4 border rounded-lg shadow-md">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Resumen</h2>
            <ul className="text-sm md:text-base">
              {servicesData.map((service, idx) => {
                const selected = localServices[service.id];
                return selected ? (
                  <li key={`${service.id}-${idx}`} className="mb-2">
                    <strong>{service.name}:</strong> {selected.label} - ${Number(selected.value).toLocaleString('es-ES')}
                    {service.name.toLowerCase().includes('software') && selected.startup && (
                      <span> + Startup - ${Number(selected.startup).toLocaleString('es-ES')}</span>
                    )}
                  </li>
                ) : null;
              })}
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
              className="mt-4 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors duration-200 shadow-md border"
            >
              Pagar
            </button>
          </div>
        </div>
        {/* PARTE DERECHA: iframe con detalles del servicio siempre visible */}
        <div className="absolute top-0 right-0 h-full w-2/3 z-30 transition-all duration-700">
          <iframe
            src={getBehindUrl()}
            title="Detalle del Servicio"
            className="w-full h-full"
            frameBorder="0"
            style={{
              border: 'none',
              overflow: 'auto',
              background: 'transparent',
              transform: 'scale(1)',
            }}
            scrolling="yes"
          />
        </div>
      </div>
    </>
  );
};

CotizaTuServicio.previousPage = '/paginas/cotizaTuServicio';
export default CotizaTuServicio;
