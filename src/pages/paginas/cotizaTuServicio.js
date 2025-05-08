import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  FaTrash,
  FaEdit,
  FaSave,
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
      linkUrl
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
      linkUrl
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

const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
    }
  }
`;

const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $name: String, $linkUrl: String) {
    updateService(id: $id, name: $name, linkUrl: $linkUrl) {
      id
      name
      icon
      linkUrl
      options {
        id
        label
        value
        startup
      }
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
// Componente CotizaTuServicio
// ----------------------------
const CotizaTuServicio = ({ disabledProvider }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { total: globalTotal, discount: globalDiscount, updateTransaction } = useContext(TransactionContext);
  const { user } = useContext(UserContext);
  const { dropdownActive } = useDropdown();
  const isAnyDropdownActive = disabledProvider
    ? false
    : (dropdownActive.services || dropdownActive.tramites);

  // Estados
  const [servicesData, setServicesData] = useState([]);
  const [localServices, setLocalServices] = useState({});
  const [editableOptions, setEditableOptions] = useState({});
  const [editMode, setEditMode] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("editMode")) || false;
    }
    return false;
  });
  const [editingTitles, setEditingTitles] = useState({});
  const [editedTitles, setEditedTitles] = useState({});
  const [editedLinkUrls, setEditedLinkUrls] = useState({});
  const [activeService, setActiveService] = useState(null);

  // Persistir editMode
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("editMode", JSON.stringify(editMode));
    }
  }, [editMode]);

  // Activar modo edición si hay usuario
  useEffect(() => {
    if (user) setEditMode(true);
  }, [user]);

  // Generar userId persistente
  const [userId] = useState(() => {
    let uid = Cookies.get("userId");
    if (!uid) {
      uid = uuidv4();
      Cookies.set("userId", uid, { expires: 7 });
    }
    return uid;
  });

  // GraphQL hooks
  const { data, refetch } = useQuery(GET_SERVICES);
  const [saveTransaction] = useMutation(SAVE_TRANSACTION);
  const [createService] = useMutation(CREATE_SERVICE);
  const [createServiceOption] = useMutation(CREATE_SERVICE_OPTION);
  const [updateServiceOption] = useMutation(UPDATE_SERVICE_OPTION);
  const [deleteServiceOption] = useMutation(DELETE_SERVICE_OPTION);
  const [deleteService] = useMutation(DELETE_SERVICE);
  const [updateService] = useMutation(UPDATE_SERVICE);

  const [debouncedServices] = useDebounce(localServices, 500);

  // Cargar datos de servicios
  useEffect(() => {
    if (data && data.services) {
      setServicesData(data.services);
      const map = {};
      data.services.forEach(s => {
        map[s.id] = s.options;
      });
      setEditableOptions(map);
      if (!activeService && data.services.length) {
        setActiveService(data.services[0].id);
      }
    }
  }, [data, activeService]);

  // Agregar servicio
  const handleAddService = () => {
    if (!user) return alert("Debes estar logueado para agregar un servicio.");
    const name = prompt("Ingrese el nombre del nuevo servicio:");
    if (!name?.trim()) return alert("El nombre es obligatorio.");
    createService({ variables: { name, icon: "" } })
      .then(res => {
        const s = res.data.createService;
        setServicesData(prev => [...prev, s]);
        setEditableOptions(prev => ({ ...prev, [s.id]: s.options || [] }));
        if (!activeService) setActiveService(s.id);
      })
      .catch(console.error);
  };

  // Eliminar servicio
  const handleDeleteService = (id) => {
    if (!user) return;
    if (confirm("¿Eliminar servicio?")) {
      deleteService({ variables: { id } })
        .then(() => refetch())
        .catch(console.error);
    }
  };

  // Agregar opción
  const handleAddOption = (service) => {
    if (!user) return alert("Debes estar logueado para agregar una opción.");
    const label = prompt("Ingrese el label de la nueva opción:");
    if (!label?.trim()) return alert("El label es obligatorio.");
    const valueInput = prompt("Ingrese el valor de la nueva opción:");
    const value = parseFloat(valueInput);
    if (isNaN(value)) return alert("El valor debe ser numérico.");
    let startup = 0;
    if (service.name.toLowerCase().includes("software")) {
      const sInput = prompt("Ingrese el valor de startup (opcional):", "0");
      const su = parseFloat(sInput);
      if (!isNaN(su)) startup = su;
    }
    createServiceOption({
      variables: { serviceId: service.id, label, value, startup }
    })
      .then(res => {
        const o = res.data.createServiceOption;
        setEditableOptions(prev => ({
          ...prev,
          [service.id]: [...(prev[service.id] || []), o]
        }));
      })
      .catch(console.error);
  };

  // Eliminar opción
  const handleDeleteOption = (id) => {
    if (!user) return;
    if (confirm("¿Eliminar opción?")) {
      deleteServiceOption({ variables: { id } })
        .then(() => refetch())
        .catch(console.error);
    }
  };

  // Selección de opción
  const handleServiceSelect = (serviceId, optionId) => {
    if (!optionId) {
      setLocalServices(prev => { const u = { ...prev }; delete u[serviceId]; return u; });
      return;
    }
    const opt = editableOptions[serviceId]?.find(o => o.id === optionId);
    if (opt) setLocalServices(prev => ({ ...prev, [serviceId]: opt }));
  };

  // Cambio de título/linkUrl
  const handleServiceTitleChange = (id, name) => {
    if (!user) return;
    setEditedTitles(prev => ({ ...prev, [id]: name }));
  };
  const handleServiceLinkChange = (id, link) => {
    if (!user) return;
    setEditedLinkUrls(prev => ({ ...prev, [id]: link }));
  };

  // Guardar nombre y linkUrl (solo campos modificados)
  const handleServiceSave = (id) => {
    if (!user) return;
    const vars = { id };
    if (editedTitles[id] !== undefined)   vars.name    = editedTitles[id];
    if (editedLinkUrls[id] !== undefined) vars.linkUrl = editedLinkUrls[id];

    updateService({ variables: vars })
      .then(() => {
        setServicesData(prev =>
          prev.map(s => {
            if (s.id !== id) return s;
            return {
              ...s,
              ...(vars.name    !== undefined ? { name: vars.name }     : {}),
              ...(vars.linkUrl !== undefined ? { linkUrl: vars.linkUrl } : {}),
            };
          })
        );
        setEditingTitles(prev => ({ ...prev, [id]: false }));
        setEditedTitles(prev => { const u = { ...prev }; delete u[id]; return u; });
        setEditedLinkUrls(prev => { const u = { ...prev }; delete u[id]; return u; });
      })
      .catch(console.error);
  };

  // Editar opción
  const handleEditOption = (service, opt) => {
    if (!user) return alert("Debes estar logueado para editar opciones.");
    const newLabel = prompt("Nuevo Label:", opt.label);
    if (!newLabel?.trim()) return alert("El label es obligatorio.");
    const vInput = prompt("Nuevo Valor:", opt.value);
    const newValue = parseFloat(vInput);
    if (isNaN(newValue)) return alert("El valor debe ser numérico.");
    let newStartup = opt.startup;
    if (service.name.toLowerCase().includes("software")) {
      const sInput = prompt("Nuevo Startup:", opt.startup || 0);
      const su = parseFloat(sInput);
      if (!isNaN(su)) newStartup = su;
    }
    updateServiceOption({
      variables: { id: opt.id, label: newLabel, value: newValue, startup: newStartup }
    })
      .then(() => refetch())
      .catch(console.error);
  };

  // Cálculo de totales y guardado de transacción
  useEffect(() => {
    let sw = 0, cu = 0, di = 0;
    servicesData.forEach(s => {
      const sel = localServices[s.id];
      if (!sel) return;
      const nm = s.name.toLowerCase();
      if (nm.includes("software")) sw = sel.value + (sel.startup || 0);
      else if (nm.includes("custodia")) cu = sel.value;
      else if (nm.includes("digital")) di = sel.value;
    });
    const cnt = Object.values(localServices).filter(Boolean).length;
    let disc = 0, tot = 0;
    if (cnt === 1) tot = sw || cu || di;
    else {
      const sub = sw + cu + di;
      if (cnt >= 3) disc = 0.1;
      else if (cnt === 2) disc = 0.07;
      tot = sub - sub * disc;
    }
    updateTransaction(localServices, tot, disc);
    if (userId) {
      saveTransaction({
        variables: {
          userId, input: {
            software:   servicesData.find(s=>s.name.toLowerCase().includes("software"))   ? localServices[servicesData.find(s=>s.name.toLowerCase().includes("software")).id]   : null,
            custodia:  servicesData.find(s=>s.name.toLowerCase().includes("custodia"))  ? localServices[servicesData.find(s=>s.name.toLowerCase().includes("custodia")).id]  : null,
            digitalizacion: servicesData.find(s=>s.name.toLowerCase().includes("digital")) ? localServices[servicesData.find(s=>s.name.toLowerCase().includes("digital")).id] : null,
            total: tot, discount: disc, state: "transaccion en formulario de pago"
          }
        }
      }).catch(console.error);
    }
  }, [debouncedServices, userId, servicesData, localServices]);

  const subtotal = servicesData.reduce((acc,s) => {
    const sel = localServices[s.id];
    if (!sel) return acc;
    return acc + sel.value + (s.name.toLowerCase().includes("software") ? (sel.startup||0) : 0);
  }, 0);

  const handlePayment = () => {
    if (globalTotal === 0 || !Object.values(localServices).some(Boolean)) {
      return alert("Por favor, seleccione al menos un servicio para pagar.");
    }
    router.push({
      pathname: "/PaymentFormPSE",
      query: { previousPage: "/paginas/cotizaTuServicio" }
    });
  };

  return (
    <div className="min-h-full flex flex-col items-center px-2 md:px-0">
      {/* Contenedor principal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 md:p-8">
        {/* Tabs con eliminación */}
        <div className="flex flex-wrap justify-center border-b mb-2">
        {servicesData.map(svc => {
  // Detectamos si es el servicio “software”
  const isSoftware = svc.name.toLowerCase() === "software";
  // O, si realmente quieres basarte en svc.id:
  // const isSoftware = svc.id === "software" || svc.id === "Software";

  // Definimos el texto que vamos a mostrar
  const displayName = isSoftware ? "Mercurio PYMES" : svc.name;

  return (
    <div key={svc.id} className="relative m-1 inline-block">
      <button
        onClick={() => setActiveService(svc.id)}
        className={`px-4 py-2 focus:outline-none ${
          activeService === svc.id
            ? "border-b-2 border-teal-500 text-teal-500 font-bold"
            : "text-gray-700"
        }`}
      >
        {getIconForService(svc.name)}
        {displayName}
      </button>
      {user && (
        <FaTrash
          onClick={() => handleDeleteService(svc.id)}
          className="absolute -top-2 -right-2 text-red-500 cursor-pointer"
        />
      )}
    </div>
          );
          })}
          {user && (
            <button
              onClick={handleAddService}
              className="px-4 py-2 text-blue-500 hover:text-blue-600"
            >
              + Agregar
            </button>
          )}
        </div>

        {/* Descuentos */}
        <div className="text-center text-teal-500 mb-4">
          <p><strong>Descuentos:</strong></p>
          <p>Con 2 servicios: 7% de descuento.</p>
          <p>Con 3 o más servicios: 10% de descuento.</p>
        </div>

        {/* Servicio activo */}
        {servicesData.length > 0 && activeService && (() => {
          const svc = servicesData.find(s => s.id === activeService);
          if (!svc) return null;
          return (
            <div className="p-4 border rounded-xl shadow-sm mb-6">
              {/* Título editable */}
              <div className="flex items-center justify-center mb-2">
                <h3 className="text-lg font-bold">
                  {svc.name.toLowerCase() === "software"
                    ? "Mercurio PYMES"
                    : svc.name}
                </h3>
                {user && (
                  <button
                    onClick={() =>
                      setEditingTitles(prev => ({ ...prev, [svc.id]: true }))
                    }
                    className="ml-2"
                  >
                    <FaEdit className="text-yellow-500 text-xl" />
                  </button>
                )}
              </div>


              {editingTitles[svc.id] && user && (
                <div className="flex flex-col items-center space-y-2 mb-2">
                  <input
                    type="text"
                    className="text-lg font-bold p-1 border rounded text-center"
                    value={editedTitles[svc.id] ?? svc.name}
                    onChange={e => handleServiceTitleChange(svc.id, e.target.value)}
                  />
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-center"
                    placeholder="Enlace externo (linkUrl)"
                    value={editedLinkUrls[svc.id] ?? svc.linkUrl ?? ''}
                    onChange={e => handleServiceLinkChange(svc.id, e.target.value)}
                  />
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={() => handleServiceSave(svc.id)}
                  >
                    <FaSave />
                  </button>
                </div>
              )}

              {/* Botón a linkUrl */}
              {svc.linkUrl && (
                <div className="text-center mb-2">
                  <a
                    href={svc.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-500 text-blue-100 px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Mas detalles
                  </a>
                </div>
              )}

              {/* Select de opciones */}
              <select
  className="w-full border rounded px-3 py-2 mb-2 text-teal-900"
  value={localServices[svc.id]?.id || ""}
  onChange={e => handleServiceSelect(svc.id, e.target.value)}
>
  <option value="">-- Selecciona una opción --</option>
  {editableOptions[svc.id]?.map(o => {
    const name = svc.name.toLowerCase();
    let labelText;

    if (name.includes("software")) {
      // Software: agregar "Anual"
      labelText = `${o.label} Desde $${o.value.toLocaleString("es-ES")} Anual`;
    } else if (name.includes("custodia")) {
      // Custodia: agregar "Mensual"
      labelText = `${o.label} Desde $${o.value.toLocaleString("es-ES")} Mensual`;
    } else if (name.includes("digital")) {
      // Digitalización: calcular precio por imagen
      const numImages = parseInt(o.label.replace(/\D/g, ''), 10) || 1;
      const annualPrice = Number(o.value);
      const perImage = Math.round(annualPrice / numImages);
      labelText = `${o.label} Desde $${perImage.toLocaleString("es-ES")} C/U`;
    } else {
      // Cualquier otro servicio (fallback)
      labelText = `${o.label} Desde $${o.value.toLocaleString("es-ES")}`;
    }

    return (
      <option key={o.id} value={o.id}>
        {labelText}
      </option>
    );
  })}
</select>


              {/* Detalles de la opción */}
              {localServices[svc.id] && !editMode && (
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-green-500 mr-2 text-xl" />
                    <span className="font-bold">Precio:</span>
                    <span className="ml-2 text-xl font-extrabold">
                      ${Number(localServices[svc.id].value).toLocaleString("es-ES")}
                    </span>
                  </div>
                  {svc.name.toLowerCase().includes("software") && localServices[svc.id].startup && (
                    <div className="flex items-center">
                      <FaRocket className="text-teal-500 mr-2 text-xl" />
                    </div>
                  )}
                </div>
              )}

              {/* Admin opciones */}
              {user && (
                <div className="mt-2 border-t pt-2">
                  {editableOptions[svc.id]?.map(o => (
                    <div key={o.id} className="flex items-center justify-between mb-1">
                      <span className="text-sm">
                        {o.label} - ${Number(o.value).toLocaleString("es-ES")}
                        {svc.name.toLowerCase().includes("software") && o.startup
                          ? ` (Startup: ${o.startup})`
                          : ""}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditOption(svc, o)}
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteOption(o.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddOption(svc)}
                    className="mt-2 bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 text-sm"
                  >
                    Agregar Opción
                  </button>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Resultado Cotización */}
      <div className="w-full max-w-2xl mt-4 text-center">
        <h3 className="text-lg font-bold mb-2">RESULTADO COTIZACIÓN</h3>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="mb-4">
            <h4 className="font-semibold text-sm md:text-base">Resumen</h4>
            <ul className="text-sm md:text-base">
  {servicesData.map(svc => {
    const sel = localServices[svc.id];
    if (!sel) return null;

    const name = svc.name.toLowerCase();
    // Detectamos si es software
    const isSoftware = name.includes("software");
    // Nombre a mostrar
    const displayName = isSoftware ? "Mercurio PYMES" : svc.name;

    // Construimos la descripción según tipo
    let description;
    if (name.includes("software")) {
      description = `${sel.label} Desde $${Number(sel.value).toLocaleString("es-ES")} Anual`;
    } else if (name.includes("custodia")) {
      description = `${sel.label} Desde $${Number(sel.value).toLocaleString("es-ES")} Mensual`;
    } else if (name.includes("digital")) {
      const numImages = parseInt(sel.label.replace(/\D/g, ''), 10) || 1;
      const annualPrice = Number(sel.value);
      const perImage = Math.round(annualPrice / numImages);
      description = `${sel.label} Desde $${perImage.toLocaleString("es-ES")} C/U`;
    } else {
      description = `${sel.label} Desde $${Number(sel.value).toLocaleString("es-ES")}`;
    }

    return (
      <li key={svc.id}>
        <strong>{displayName}:</strong> {description}
      </li>
    );
  })}
</ul>


          </div>
          {globalDiscount > 0 && (
            <p className="text-sm md:text-base text-green-600 mb-1">
              <strong>Descuento:</strong> {(globalDiscount * 100).toFixed(0)}%
            </p>
          )}
          <div className="mt-4 gap-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/paginas/contactanos")}
                  className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
                >
                  Contacta a uno de nuestros asesores
                </button>
              </div>
        </div>
      </div>
    </div>
  );
};

export default CotizaTuServicio;
