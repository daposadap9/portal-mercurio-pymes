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
import Link from 'next/link';

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
// Componente MercurioPYMES (Software)
// ----------------------------
const MercurioPYMES = ({ disabledProvider }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { selectedServices, total: globalTotal, discount: globalDiscount, updateTransaction } = useContext(TransactionContext);
  const { user } = useContext(UserContext);
  const { dropdownActive } = useDropdown();
  const isAnyDropdownActive = disabledProvider
    ? false
    : (dropdownActive.services || dropdownActive.tramites);

  // Estado del formulario (lado derecho)
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    entidad: "",
    email: "",
    telefono: "",
    observaciones: "",
    opcionSeleccionada: "",
  });

  // Estados para el cotizador de software
  const [servicesData, setServicesData] = useState([]);
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  // Se fuerza el subtotal a 0 (según lo solicitado)
  const subtotal = 0;
  const calculatedDiscount = 0;
  const calculatedTotal = subtotal;

  // Estados para el modo edición (persistidos en localStorage)
  const [editMode, setEditMode] = useState(() => {
    if (typeof window !== "undefined")
      return JSON.parse(localStorage.getItem("editMode")) || false;
    return false;
  });
  const [editingTitles, setEditingTitles] = useState({});
  const [editedTitles, setEditedTitles] = useState({});

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("editMode", JSON.stringify(editMode));
  }, [editMode]);

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

  const { data, refetch } = useQuery(GET_SERVICES);
  const [saveTransaction, { loading, error }] = useMutation(SAVE_TRANSACTION);
  const [createService] = useMutation(CREATE_SERVICE);
  const [createServiceOption] = useMutation(CREATE_SERVICE_OPTION);
  const [updateServiceOption] = useMutation(UPDATE_SERVICE_OPTION);
  const [deleteServiceOption] = useMutation(DELETE_SERVICE_OPTION);
  const [updateService] = useMutation(UPDATE_SERVICE);
  const [debouncedServices] = useDebounce(selectedOption, 500);

  // Al recibir los datos, se guardan y se filtra el servicio de software
  useEffect(() => {
    if (data && data.services) {
      setServicesData(data.services);
      const softwareService = data.services.find(s => s.name.toLowerCase().includes("software"));
      if (softwareService) {
        setSoftwareOptions(softwareService.options || []);
      }
    }
  }, [data]);

  // Manejador para cambios en los inputs del formulario (lado derecho)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para el select del cotizador (lado izquierdo)
  const handleServiceSelect = (e) => {
    const optionId = e.target.value;
    setFormData(prev => ({ ...prev, opcionSeleccionada: optionId }));
    if (optionId) {
      const op = softwareOptions.find(opt => opt.id === optionId);
      setSelectedOption(op);
    } else {
      setSelectedOption(null);
    }
  };

  // Función para editar la tarjeta del cotizador (solo si hay usuario)
  const handleEditOptionSummary = () => {
    if (!user) {
      alert("Debes estar logueado para editar el cotizador.");
      return;
    }
    const newLabel = prompt("Nuevo label para la opción seleccionada:", selectedOption ? selectedOption.label : "");
    if (newLabel !== null && newLabel.trim() !== "") {
      setSelectedOption({ ...selectedOption, label: newLabel });
    }
  };

  // Función para enviar el formulario (lado derecho)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.entidad ||
      !formData.email ||
      !formData.telefono ||
      !formData.opcionSeleccionada
    ) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }
    try {
      const selectedLabel = selectedOption ? selectedOption.label : "";
      const selectedValue = selectedOption ? selectedOption.value : "";
      const documentInfo = `${formData.nombre} - ${formData.apellido} - ${formData.entidad} - ${formData.email} - ${formData.telefono} - ${formData.observaciones} - ${selectedLabel} - ${selectedValue}`;
      const documentInfoGeneral = "Mercurio PYMES";
      const { data } = await saveTransaction({
        variables: {
          userId,
          input: {
            software: selectedOption,
            custodia: null,
            digitalizacion: null,
            total: Number(selectedOption ? selectedOption.value : 0),
            discount: 0,
            state: "transaccion en formulario de pago",
          },
        },
      });
      const result = data.saveTransaction;
      if (result) {
        router.push({
          pathname: '/radicadoExitoso',
          query: {
            nombre: formData.nombre,
            observaciones: formData.observaciones,
            documentInfo,
            documentInfoGeneral,
            radicado: result.id,
          },
        });
      } else {
        alert("Error al guardar la transacción.");
      }
    } catch (err) {
      console.error("Error al enviar el formulario:", err);
      alert("Error al procesar la transacción.");
    }
  };

  // Función para el botón "Cotizar" en la tarjeta (lado izquierdo)
  const handlePayment = () => {
    if (!selectedOption) {
      alert("Por favor, seleccione al menos una opción para cotizar.");
      return;
    }
    router.push({
      pathname: "/PaymentFormPSE",
      query: {
        previousPage: "/paginas/cotizaTuServicio",
        total: calculatedTotal, // Se envía 0
        discount: calculatedDiscount, // 0
        opcion: selectedOption.label,
      },
    });
  };

  return (
    <div className="min-h-full flex flex-col items-center px-2 md:px-0">
      {/* Título Principal */}
      <div className={`flex justify-center text-2xl md:text-4xl font-bold transition-all duration-500 ease-in-out text-teal-600 text-center titulo-shadow mb-10 ${isAnyDropdownActive ? "mt-24" : ""}`}>
        <div className="w-full lg:w-[85%] text-xl">
          <h1>
            Mercurio PYMES es una forma ágil, fácil y práctica para la gestión documental de pequeñas y medianas empresas.
          </h1>
        </div>
      </div>

      <div className="flex flex-col justify-between p-4">
        <div className="w-full mx-auto flex flex-col lg:flex-row justify-evenly gap-4 flex-1">
          {/* === Columna Izquierda: Información + Tarjeta Cotizador de Software === */}
          <div className="w-full lg:w-[40%]">
            {/* Bloque de Información */}
            <div className="lg:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
              <p className="mb-4 text-xl font-bold text-black text-justify">
                Software para Gestión Documental: Organización y Accesibilidad
              </p>
              <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                Mercurio PYMES te permite gestionar toda la documentación de tu empresa de manera digital, optimizando procesos y reduciendo costos. Nuestro servicio de Software como Servicio (SaaS) facilita el acceso seguro y organizado a la información.
              </p>
              <ul className="list-disc list-inside mb-4 text-black text-base font-medium text-justify">
                <li>Centraliza y organiza la información en un solo sistema.</li>
                <li>Acceso rápido y seguro desde cualquier lugar.</li>
                <li>Escalable según las necesidades de tu empresa.</li>
              </ul>
              <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                Si estás interesado: en la sección{" "}
                <Link href="/paginas/cotizaTuServicio" legacyBehavior>
                  <a className="text-blue-600 underline">¡cotiza tu servicio!</a>
                </Link>{" "}
                podrás conocer los precios y planes. El valor final depende del número de licencias (usuarios) requeridas.
              </p>
            </div>

            {/* Tarjeta de Cotizador de Software */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow-lg border">
              <h2 className="text-xl font-bold text-center text-teal-600 mb-2">Cotizador de Software</h2>
              <label className="block text-sm font-semibold mb-1">Selecciona tu plan:</label>
              <select
                className="w-full border rounded px-3 py-2 mb-3 text-teal-950" 
                value={formData.opcionSeleccionada}
                onChange={handleServiceSelect}
              >
                <option value="">-- Escoge un plan --</option>
                {softwareOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label} - ${Number(option.value).toLocaleString("es-ES")}{" "}
                    {option.startup !== undefined && `(Startup: $${Number(option.startup).toLocaleString("es-ES")})`}
                  </option>
                ))}
              </select>
              {selectedOption ? (
                <>
                  <p className="mb-2 text-center">
                    <strong>Opción:</strong> {selectedOption.label}
                  </p>
                  <p className="mb-2 text-center">
                    <strong>Precio:</strong> ${Number(selectedOption.value).toLocaleString("es-ES")}
                  </p>
                  {selectedOption.startup !== undefined && (
                    <p className="mb-2 text-center">
                      <strong>Startup:</strong> ${Number(selectedOption.startup).toLocaleString("es-ES")}
                    </p>
                  )}
                </>
              ) : (
                <p className="mb-2 text-center">No se ha seleccionado un plan</p>
              )}
              {user && (
                <button
                  className="w-full bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition-colors"
                  onClick={handleEditOptionSummary}
                >
                  Editar Cotizador
                </button>
              )}
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handlePayment}
                  className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
                >
                  Cotizar
                </button>
              </div>
            </div>
          </div>

          {/* === Columna Derecha: Formulario Original === */}
          <div className="w-full lg:w-[40%]">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg h-full flex flex-col">
              <h2 className="text-xl font-bold text-teal-600 text-center mb-6">¡Adquiérelo ahora!</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                {/* Datos Personales */}
                <div className="flex flex-col space-y-4">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
                    <input 
                      type="text" 
                      name="nombre"
                      placeholder="Nombre:" 
                      className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                    />
                    <input 
                      type="text" 
                      name="apellido"
                      placeholder="Apellido:" 
                      className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                      value={formData.apellido}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <input 
                    type="text" 
                    name="entidad"
                    placeholder="Entidad y/o empresa:" 
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                    value={formData.entidad}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="E-mail:" 
                      className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <input 
                      type="tel" 
                      name="telefono"
                      placeholder="Teléfono celular:" 
                      className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 w-full"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {/* Observaciones */}
                <div className="flex flex-col mt-4 space-y-2">
                  <label className="text-sm text-gray-700 font-semibold">
                    Observaciones:
                  </label>
                  <textarea 
                    name="observaciones"
                    placeholder="Ingresa tus observaciones aquí..."
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    rows="4"
                    value={formData.observaciones}
                    onChange={handleChange}
                  />
                </div>
                {/* Bloque para Inversión y Botones */}
                <div className="mt-6">
                  <div className="flex flex-col gap-4">
                    <style jsx>{`
                      .btn-wave {
                        position: relative;
                        overflow: hidden;
                      }
                      .btn-wave::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: rgba(255,255,255,0.2);
                        transform: skewX(-20deg);
                        transition: left 0.5s ease;
                      }
                      .btn-wave:hover::before {
                        left: 100%;
                      }
                    `}</style>
                  </div>
                  <div className="lg:w-1/2 flex mx-auto items-end mt-4">
                    <button 
                      type="submit" 
                      className="w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600"
                      disabled={loading}
                    >
                      {loading ? "Procesando..." : "Enviar"}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-600">Error: {error.message}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Mensaje final destacado */}
      <div className="mt-8 bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-lg shadow-lg text-white text-center">
        <p className="text-2xl font-bold">
          ¡Descubre cómo Mercurio PYMES puede transformar la gestión documental de tu empresa!
        </p>
      </div>
    </div>
  );
};

export default MercurioPYMES;
