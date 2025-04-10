import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaSave,
  FaTrash,
  FaMoneyBillWave,
  FaRocket,
  FaLaptopCode,
  FaBoxOpen,
  FaRegImage,
} from 'react-icons/fa';
import { ThemeContext } from '@/context/ThemeContext';
import { TransactionContext } from '@/context/TransactionContext';
import { UserContext } from '@/context/UserContext';
import { useDropdown } from '@/context/DropdownContext';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { useDebounce } from 'use-debounce';

// ----------------------------
// Mutaciones y consultas GraphQL
// ----------------------------
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

// ----------------------------
// Función para obtener el icono según el nombre del servicio
// ----------------------------
const getIconForService = (serviceName) => {
  const name = serviceName.toLowerCase();
  if (name.includes("software")) return <FaLaptopCode className="mr-2 inline-block" />;
  if (name.includes("custodia")) return <FaBoxOpen className="mr-2 inline-block" />;
  if (name.includes("digital")) return <FaRegImage className="mr-2 inline-block" />;
  return null;
};

// ----------------------------
// Componente CotizaTuServicio (se muestran los controles de edición solo si hay usuario)
// ----------------------------
const CotizaTuServicio = ({ disabledProvider }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { selectedServices, total: globalTotal, discount: globalDiscount, updateTransaction } = useContext(TransactionContext);
  const { user } = useContext(UserContext);
  const { dropdownActive } = useDropdown();
  const isAnyDropdownActive = disabledProvider ? false : (dropdownActive.services || dropdownActive.tramites);

  useEffect(() => {
    console.log("User:", user);
  }, [user]);

  const [servicesData, setServicesData] = useState([]);
  const [localServices, setLocalServices] = useState({});
  const [editableOptions, setEditableOptions] = useState({});
  // Modo edición persistido mediante localStorage
  const [editMode, setEditMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("editMode")) || false;
    }
    return false;
  });
  const [editingTitles, setEditingTitles] = useState({});
  const [editedTitles, setEditedTitles] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("editMode", JSON.stringify(editMode));
    }
  }, [editMode]);

  // Cuando el usuario existe se activa el modo edición
  useEffect(() => {
    if (user) {
      setEditMode(true);
    }
  }, [user]);

  const [activeService, setActiveService] = useState(null);

  // Generar userId persistente
  const [userId] = useState(() => {
    let uid = Cookies.get("userId");
    if (!uid) {
      uid = uuidv4();
      Cookies.set("userId", uid, { expires: 7 });
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
      data.services.forEach((service) => {
        optionsMap[service.id] = service.options;
      });
      setEditableOptions(optionsMap);
      if (!activeService && data.services.length) {
        setActiveService(data.services[0].id);
      }
    }
  }, [data, activeService]);

  // Función para agregar un servicio (requiere usuario)
  const handleAddService = () => {
    if (!user) {
      alert("Debes estar logueado para agregar un servicio.");
      return;
    }
    const name = prompt("Ingrese el nombre del nuevo servicio:");
    if (!name || name.trim() === "") {
      alert("El nombre del servicio es obligatorio.");
      return;
    }
    createService({ variables: { name, icon: "" } })
      .then((res) => {
        const newService = res.data.createService;
        setServicesData((prev) => [...prev, newService]);
        setEditableOptions((prev) => ({ ...prev, [newService.id]: newService.options || [] }));
        if (!activeService) setActiveService(newService.id);
      })
      .catch((err) => console.error("Error al agregar servicio:", err));
  };

  // Función para agregar una opción a un servicio (requiere usuario)
  const handleAddOption = (service) => {
    if (!user) {
      alert("Debes estar logueado para agregar una opción.");
      return;
    }
    const label = prompt("Ingrese el label de la nueva opción:");
    if (!label || label.trim() === "") {
      alert("El label es obligatorio.");
      return;
    }
    const valueInput = prompt("Ingrese el valor de la nueva opción:");
    const value = parseFloat(valueInput);
    if (isNaN(value)) {
      alert("El valor debe ser numérico.");
      return;
    }
    let startup = 0;
    if (service.name.toLowerCase().includes("software")) {
      const startupInput = prompt("Ingrese el valor de startup (opcional):", "0");
      startup = parseFloat(startupInput);
      if (isNaN(startup)) startup = 0;
    }
    createServiceOption({
      variables: { serviceId: service.id, label, value, startup },
    })
      .then((res) => {
        const newOption = res.data.createServiceOption;
        setEditableOptions((prev) => ({
          ...prev,
          [service.id]: [...(prev[service.id] || []), newOption],
        }));
      })
      .catch((err) => console.error("Error al agregar opción:", err));
  };

  // Cambio de opción en el <select>
  const handleServiceSelect = (serviceId, optionId) => {
    if (optionId === "") {
      setLocalServices((prev) => {
        const updated = { ...prev };
        delete updated[serviceId];
        return updated;
      });
      return;
    }
    const optionSelected = editableOptions[serviceId].find((opt) => opt.id === optionId);
    if (!optionSelected) return;
    setLocalServices((prev) => ({
      ...prev,
      [serviceId]: optionSelected,
    }));
  };

  // Edición del título del servicio (requiere usuario)
  const handleServiceTitleChange = (serviceId, newName) => {
    if (!user) return;
    setEditedTitles((prev) => ({ ...prev, [serviceId]: newName }));
  };

  const handleServiceTitleSave = (serviceId) => {
    if (!user) return;
    const newName = editedTitles[serviceId] || "";
    updateService({ variables: { id: serviceId, name: newName } })
      .then(() => {
        setServicesData((prev) =>
          prev.map((s) => (s.id === serviceId ? { ...s, name: newName } : s))
        );
        setEditingTitles((prev) => ({ ...prev, [serviceId]: false }));
        setEditedTitles((prev) => {
          const updated = { ...prev };
          delete updated[serviceId];
          return updated;
        });
      })
      .catch((err) => console.error("Error al actualizar el servicio:", err));
  };

  // Función para editar una opción (requiere usuario)
  const handleEditOption = (service, option) => {
    if (!user) {
      alert("Debes estar logueado para editar opciones.");
      return;
    }
    const newLabel = prompt("Nuevo Label:", option.label);
    if (newLabel === null || newLabel.trim() === "") {
      alert("El nuevo label es obligatorio.");
      return;
    }
    const valueInput = prompt("Nuevo Valor:", option.value);
    const newValue = parseFloat(valueInput);
    if (isNaN(newValue)) {
      alert("El nuevo valor debe ser numérico.");
      return;
    }
    let newStartup = option.startup;
    if (service.name.toLowerCase().includes("software")) {
      const startupInput = prompt("Nuevo Startup:", option.startup || 0);
      newStartup = parseFloat(startupInput);
      if (isNaN(newStartup)) newStartup = 0;
    }
    updateServiceOption({
      variables: { id: option.id, label: newLabel, value: newValue, startup: newStartup },
    })
      .then(() => refetch())
      .catch((err) => console.error("Error updating option:", err));
  };

  // Cálculo de totales y guardado de transacción
  useEffect(() => {
    let softwareTotal = 0, custodiaTotal = 0, digitalizacionTotal = 0;
    servicesData.forEach((service) => {
      const serviceName = service.name.toLowerCase();
      const selectedOption = localServices[service.id];
      if (selectedOption) {
        if (serviceName.includes("software")) {
          softwareTotal = Number(selectedOption.value) + Number(selectedOption.startup || 0);
        } else if (serviceName.includes("custodia")) {
          custodiaTotal = Number(selectedOption.value);
        } else if (serviceName.includes("digital")) {
          digitalizacionTotal = Number(selectedOption.value);
        }
      }
    });
    let count = Object.values(localServices).filter((opt) => opt).length;
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
            software: servicesData.find((s) =>
              s.name.toLowerCase().includes("software")
            )
              ? localServices[
                  servicesData.find((s) =>
                    s.name.toLowerCase().includes("software")
                  ).id
                ]
              : null,
            custodia: servicesData.find((s) =>
              s.name.toLowerCase().includes("custodia")
            )
              ? localServices[
                  servicesData.find((s) =>
                    s.name.toLowerCase().includes("custodia")
                  ).id
                ]
              : null,
            digitalizacion: servicesData.find((s) =>
              s.name.toLowerCase().includes("digital")
            )
              ? localServices[
                  servicesData.find((s) =>
                    s.name.toLowerCase().includes("digital")
                  ).id
                ]
              : null,
            total: calculatedTotal,
            discount: calculatedDiscount,
            state: "transaccion en formulario de pago",
          },
        },
      }).catch((err) => console.error("Error al guardar la transacción:", err));
    }
  }, [debouncedServices, userId, saveTransaction, updateTransaction, servicesData, localServices]);

  const subtotal = servicesData.reduce((acc, service) => {
    const selected = localServices[service.id];
    if (selected) {
      if (service.name.toLowerCase().includes("software")) {
        return acc + Number(selected.value) + Number(selected.startup || 0);
      }
      return acc + Number(selected.value);
    }
    return acc;
  }, 0);

  const handlePayment = () => {
    if (globalTotal === 0 || !Object.values(localServices).some((opt) => opt)) {
      alert("Por favor, seleccione al menos un servicio para pagar.");
      return;
    }
    router.push({
      pathname: "/PaymentFormPSE",
      query: { previousPage: "/paginas/cotizaTuServicio" },
    });
  };

  return (
    <div className="min-h-full flex flex-col items-center px-2 md:px-0">
      {/* Contenedor principal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 md:p-8">
        {/* Tabs de servicios centradas */}
        <div className="flex justify-center border-b mb-2">
          {servicesData.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`px-4 py-2 text-center focus:outline-none ${
                activeService === service.id
                  ? "border-b-2 border-green-500 text-green-500"
                  : "text-gray-700"
              }`}
            >
              {getIconForService(service.name)}
              {service.name}
            </button>
          ))}
          {user && (
            <button
              onClick={handleAddService}
              className="px-4 py-2 text-center text-blue-500 hover:text-blue-600"
            >
              + Agregar
            </button>
          )}
        </div>

        {/* Descripción de descuentos */}
        <div className="text-center text-gray-600 mb-4">
          <p><strong>Descuentos:</strong></p>
          <p>Con 1 servicio: sin descuento.</p>
          <p>Con 2 servicios: 7% de descuento.</p>
          <p>Con 3 o más servicios: 10% de descuento.</p>
        </div>

        {/* Contenido del servicio activo */}
        {servicesData.length > 0 &&
          activeService &&
          (() => {
            const service = servicesData.find((s) => s.id === activeService);
            if (!service) return null;
            return (
              <div className="p-4 border rounded-xl shadow-sm mb-6">
                {/* Título editable o normal (solo si hay usuario) */}
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-lg font-bold">{service.name}</h3>
                  {user && (
                    <button
                      onClick={() =>
                        setEditingTitles((prev) => ({ ...prev, [service.id]: true }))
                      }
                      className="ml-2"
                    >
                      <FaEdit className="text-yellow-500 text-xl" />
                    </button>
                  )}
                </div>
                {editingTitles[service.id] && user && (
                  <div className="flex items-center justify-center mb-2">
                    <input
                      type="text"
                      className="text-lg font-bold p-1 border rounded text-center"
                      value={
                        editedTitles[service.id] !== undefined
                          ? editedTitles[service.id]
                          : service.name
                      }
                      onChange={(e) => handleServiceTitleChange(service.id, e.target.value)}
                    />
                    <button
                      className="ml-2"
                      onClick={() => handleServiceTitleSave(service.id)}
                    >
                      <FaSave className="text-green-600 text-xl" />
                    </button>
                  </div>
                )}

                {/* Select de opciones */}
                <select
                  className="w-full border rounded px-3 py-2 mb-2"
                  value={localServices[service.id]?.id || ""}
                  onChange={(e) => handleServiceSelect(service.id, e.target.value)}
                >
                  <option value="">-- Selecciona una opción --</option>
                  {editableOptions[service.id]?.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* Mostrar detalles de la opción seleccionada */}
                {localServices[service.id] && !editMode && (
                  <div className="mt-4 bg-gray-50 p-3 rounded">
                    <div className="flex items-center mb-2">
                      <FaMoneyBillWave className="text-green-500 mr-2 text-xl" />
                      <span className="font-bold">Precio:</span>
                      <span className="ml-2 text-xl font-extrabold">
                        ${Number(localServices[service.id].value).toLocaleString("es-ES")}
                      </span>
                    </div>
                    {service.name.toLowerCase().includes("software") &&
                      localServices[service.id].startup && (
                        <div className="flex items-center">
                          <FaRocket className="text-teal-500 mr-2 text-xl" />
                          <span className="font-bold">Startup:</span>
                          <span className="ml-2 text-xl font-extrabold">
                            ${Number(localServices[service.id].startup).toLocaleString("es-ES")}
                          </span>
                        </div>
                      )}
                  </div>
                )}

                {/* Listado de todas las opciones con botones "Editar" y "Eliminar" (solo si hay usuario) */}
                {user && (
                  <div className="mt-2 border-t pt-2">
                    {editableOptions[service.id]?.map((option) => (
                      <div key={option.id} className="flex items-center justify-between mb-1">
                        <span className="text-sm">
                          {option.label} - ${Number(option.value).toLocaleString("es-ES")}
                          {service.name.toLowerCase().includes("software") && option.startup ? ` (Startup: ${option.startup})` : ""}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditOption(service, option)}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("¿Eliminar opción?")) {
                                deleteServiceOption({ variables: { id: option.id } })
                                  .then(() => refetch())
                                  .catch((err) => console.error("Error deleting option:", err));
                              }
                            }}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddOption(service)}
                      className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                    >
                      Agregar Opción
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

        {/* Botón principal para cotizar */}
        <div className="flex justify-center">
          <button
            onClick={handlePayment}
            className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors mt-2"
          >
            Cotizar
          </button>
        </div>
      </div>

      {/* Sección de Resultado de Cotización con resumen de servicios seleccionados */}
      <div className="w-full max-w-2xl mt-4 text-center">
        <h3 className="text-lg font-bold mb-2">RESULTADO COTIZACIÓN</h3>
        <div className="bg-white rounded-xl shadow p-4">
          {/* Resumen de los servicios seleccionados */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm md:text-base">Resumen</h4>
            <ul className="text-sm md:text-base">
              {servicesData.map((service) => {
                const selected = localServices[service.id];
                if (!selected) return null;
                return (
                  <li key={service.id}>
                    <strong>{service.name}:</strong> {selected.label} - $
                    {Number(selected.value).toLocaleString("es-ES")}
                    {service.name.toLowerCase().includes("software") && selected.startup
                      ? ` + Startup: $${Number(selected.startup).toLocaleString("es-ES")}`
                      : ""}
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-sm md:text-base mb-1">
            <strong>Subtotal:</strong> ${Math.round(subtotal).toLocaleString("es-ES")}
          </p>
          {globalDiscount > 0 && (
            <p className="text-sm md:text-base text-green-600 mb-1">
              <strong>Descuento:</strong> {(globalDiscount * 100).toFixed(0)}%
            </p>
          )}
          <p className="text-2xl md:text-3xl font-bold">
            Total: ${Math.round(globalTotal).toLocaleString("es-ES")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CotizaTuServicio;
