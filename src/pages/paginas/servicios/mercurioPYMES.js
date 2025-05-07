import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
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

const INSERT_MERT_RECIBIDO = gql`
  mutation InsertMertRecibido($documentInfo: String!, $documentInfoGeneral: String!) {
    insertMertRecibido(documentInfo: $documentInfo, documentInfoGeneral: $documentInfoGeneral) {
      success
      message
      idDocumento
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
  if (name.includes("digital"))  return <FaRegImage className="mr-2 inline-block" />;
  return null;
};

// ----------------------------
// Componente MercurioPYMES (Software)
// ----------------------------
const MercurioPYMES = ({ disabledProvider }) => {
  const router = useRouter();
  const { updateTransaction } = useContext(TransactionContext);
  const { user } = useContext(UserContext);
  const { dropdownActive } = useDropdown();
  const isAnyDropdownActive = disabledProvider
    ? false
    : (dropdownActive.services || dropdownActive.tramites);

  // Formulario “¡Adquiérelo ahora!”
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    entidad: "",
    email: "",
    telefono: "",
    observaciones: "",
    opcionSeleccionada: "",
  });

  // Cotizador (izquierda)
  const [softwareOptions, setSoftwareOptions] = useState([]);
  const [leftSelectedId, setLeftSelectedId] = useState("");
  const [leftOption, setLeftOption]         = useState(null);

  // Toggle Anual/Mensual
  const [isMonthly, setIsMonthly] = useState(false);

  // Mutations
  const [insertMertRecibido, { loading: loadingRad, error: radError }] = useMutation(INSERT_MERT_RECIBIDO);
  const [savePayment] = useMutation(SAVE_TRANSACTION);

  // Totales basados en leftOption
  const annualTotal    = leftOption ? (Number(leftOption.value) + Number(leftOption.startup || 0)) : 0;
  const monthlyPayment = leftOption ? (annualTotal / 12) : 0;
  const calculatedDiscount = 0;

  // userId persistente
  const [userId] = useState(() => {
    let uid = Cookies.get("userId");
    if (!uid) {
      uid = uuidv4();
      Cookies.set("userId", uid, { expires: 7 });
    }
    return uid;
  });

  // Traer servicios al montar
  const { data } = useQuery(GET_SERVICES);
  useEffect(() => {
    if (data?.services) {
      const svc = data.services.find(s => s.name.toLowerCase().includes("software"));
      if (svc) setSoftwareOptions(svc.options || []);
    }
  }, [data]);

  // Actualizar la transacción en el contexto (usa leftOption y monto correcto)
  useEffect(() => {
    const amount = isMonthly ? monthlyPayment : annualTotal;
    updateTransaction(leftOption, amount, calculatedDiscount);
  }, [leftOption, isMonthly, monthlyPayment, annualTotal]);

  // Manejador para el select izquierdo (Cotizador)
  const handleLeftSelect = (e) => {
    const id = e.target.value;
    setLeftSelectedId(id);
    setFormData(prev => ({ ...prev, opcionSeleccionada: id }));
    const opt = softwareOptions.find(o => o.id === id) || null;
    setLeftOption(opt);
  };

  // Manejador genérico de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Si fue el select de plan en el formulario, sincronizamos leftOption
    if (name === "opcionSeleccionada") {
      setLeftSelectedId(value);
      const opt = softwareOptions.find(o => o.id === value) || null;
      setLeftOption(opt);
    }
  };

  // Botón “Cotizar” de la tarjeta izquierda
  const handlePayment = async () => {
    if (!leftOption) {
      alert("Selecciona un plan primero.");
      return;
    }
    const amount = isMonthly ? monthlyPayment : annualTotal;
    const { data } = await savePayment({
      variables: {
        userId,
        input: {
          software: leftOption,
          custodia: null,
          digitalizacion: null,
          total: amount,
          discount: calculatedDiscount,
          state: "transaccion en formulario de pago",
        },
      },
    });
    if (data.saveTransaction) {
      router.push({
        pathname: "/PaymentFormPSE",
        query: { previousPage: "/paginas/cotizaTuServicio" },
      });
    } else {
      alert("Error al guardar la transacción.");
    }
  };

  // Submit del formulario “¡Adquiérelo ahora!”
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validaciones
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.entidad ||
      !formData.email ||
      !formData.telefono ||
      !formData.opcionSeleccionada
    ) {
      alert("Completa todos los campos y selecciona un plan.");
      return;
    }

    // Recalculamos montos basados en leftOption
    const startup    = leftOption.startup || 0;
    const totalValue = Number(leftOption.value) + Number(startup);
    const monthlyVal = totalValue / 12;
    const valor      = isMonthly ? monthlyVal : totalValue;

    // Preparamos datos para insertar
    const planType = isMonthly ? "Mensual" : "Anual";
    const documentInfo = `
      ${formData.nombre} - ${formData.apellido} - ${formData.entidad} -
      ${formData.email} - ${formData.telefono} - ${formData.observaciones} -
      Plan: ${leftOption.label} (${planType}) -
      Valor: ${valor.toLocaleString("es-ES")}
    `;
    const documentInfoGeneral = "Mercurio PYMES";

    try {
      const { data } = await insertMertRecibido({
        variables: { documentInfo, documentInfoGeneral },
      });
      if (data.insertMertRecibido.success) {
        router.push({
          pathname: "/radicadoExitoso",
          query: {
            nombre: formData.nombre,
            observaciones: formData.observaciones,
            documentInfo,
            documentInfoGeneral,
            radicado: data.insertMertRecibido.idDocumento,
          },
        });
      } else {
        alert("Error: " + data.insertMertRecibido.message);
      }
    } catch (err) {
      console.error("Error al radicar:", err);
      alert("Error al procesar la radicación.");
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center px-2 md:px-0">
      {/* Título Principal */}
      <div className={`flex justify-center text-2xl md:text-4xl font-bold transition-all duration-500 ease-in-out text-teal-600 text-center titulo-shadow mb-10 ${isAnyDropdownActive ? "mt-24" : ""}`}>
        <div className="w-full lg:w-[85%] w-full text-xl">
          <h1>
            Mercurio PYMES es una forma ágil, fácil y práctica para la gestión documental de pequeñas y medianas empresas.
          </h1>
        </div>
      </div>

      <div className="flex flex-col justify-between p-4">
        <div className="w-full mx-auto flex flex-col lg:flex-row justify-evenly gap-4 flex-1">

          {/* Columna Izquierda: Tarjeta de Cotizador */}
          <div className="w-full lg:w-[40%]">
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
                Si estás interesado, en la sección{" "}
                <Link href="/paginas/cotizaTuServicio" legacyBehavior>
                  <a className="text-blue-600 underline">¡cotiza tu servicio!</a>
                </Link>{" "}
                podrás conocer los precios y planes. El valor final depende del número de licencias (usuarios) requeridas.
              </p>
            </div>

            {/* Tarjeta de Cotizador */}
            <div className="mt-6 p-4 bg-white rounded-xl shadow-lg border">
              <h2 className="text-xl font-bold text-center text-teal-600 mb-2">Cotizador de Software</h2>
              <label className="block text-sm font-semibold mb-1">Selecciona tu plan:</label>
              <select
                className="w-full border rounded px-3 py-2 mb-3 text-teal-950"
                value={leftSelectedId}
                onChange={handleLeftSelect}
              >
                <option value="">-- Escoge un plan --</option>
                {softwareOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label} Desde ${Number(option.value).toLocaleString("es-ES")}
                  </option>
                ))}
              </select>
              {leftOption ? (
                <>
                  <p className="mb-2 text-center"><strong>Opción:</strong> {leftOption.label}</p>
                  <p className="mb-2 text-center"><strong>Precio:</strong> ${Number(leftOption.value).toLocaleString("es-ES")}</p>
                  <p className="mb-2 text-center"><strong>Startup:</strong> ${Number(leftOption.startup).toLocaleString("es-ES")} (único Pago)</p>
                  <p className="mb-2 text-center"><strong>Total, Inversión Anual:</strong> ${annualTotal.toLocaleString("es-ES")}</p>
                  <p className="mb-2 text-center"><strong>Pago mensual:</strong> ${monthlyPayment.toLocaleString("es-ES",{ minimumFractionDigits:2, maximumFractionDigits:2 })}</p>
                  <div className="flex justify-center gap-4 mb-4">
                    <label className="flex items-center space-x-1 text-xs">
                      <input type="radio" checked={!isMonthly} onChange={() => setIsMonthly(false)} />
                      <span>Anual</span>
                    </label>
                    <label className="flex items-center space-x-1 text-xs">
                      <input type="radio" checked={isMonthly} onChange={() => setIsMonthly(true)} />
                      <span>Mensual</span>
                    </label>
                  </div>
                </>
              ) : (
                <p className="mb-2 text-center">No se ha seleccionado un plan</p>
              )}
              <div className="mt-4 gap-2 flex justify-center">
                {/*<button
                  type="button"
                  onClick={handlePayment}
                  className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
                >
                  Conoce el detalle {isMonthly ? "Mensual" : "Anual"}
                </button>*/}
                <button
                  type="button"
                  onClick={() => router.push("/paginas/contactanos")}
                  className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
                >
                  Ampliar Información
                </button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Compra */}
          <div className="w-full lg:w-[40%]">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg h-full flex flex-col">
              <h2 className="text-xl font-bold text-teal-600 text-center mb-6">¡Adquiérelo ahora!</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
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

                <div className="flex flex-col mt-2 space-y-2">
                  <label className="text-sm text-gray-700 font-semibold">Observaciones:</label>
                  <textarea
                    name="observaciones"
                    placeholder="Ingresa tus observaciones aquí..."
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                    rows="4"
                    value={formData.observaciones}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col mt-2">
                  <label className="text-sm text-gray-700 font-semibold mb-1">Plan de Software:</label>
                  <select
                    name="opcionSeleccionada"
                    value={formData.opcionSeleccionada}
                    onChange={handleChange}
                    required
                    className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                  >
                    <option value="">-- Escoge un plan --</option>
                    {softwareOptions.map(o => (
                      <option key={o.id} value={o.id}>
                        {o.label} Desde ${Number(o.value).toLocaleString("es-ES")}
                      </option>
                    ))}
                  </select>
                  {formData.opcionSeleccionada && (
                    <div className="flex justify-center gap-4 mt-2 text-xs">
                      <label className="flex items-center space-x-1">
                        <input type="radio" checked={!isMonthly} onChange={() => setIsMonthly(false)} />
                        <span>Anual</span>
                      </label>
                      <label className="flex items-center space-x-1">
                        <input type="radio" checked={isMonthly} onChange={() => setIsMonthly(true)} />
                        <span>Mensual</span>
                      </label>
                    </div>
                  )}
                </div>

                {radError && <p className="text-red-600">Error: {radError.message}</p>}

                <div className="mt-1">
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
                  <div className="lg:w-1/2 flex mx-auto items-end mt-2">
                    <button
                      type="submit"
                      className="btn-wave w-full bg-teal-500 text-white font-bold py-2 rounded-md transition-colors duration-300 hover:bg-teal-600"
                      disabled={loadingRad}
                    >
                      {loadingRad ? "Procesando..." : "Enviar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Mensaje final */}
      <div className="mt-8 bg-gradient-to-r from-teal-500 to-blue-500 p-6 rounded-lg shadow-lg text-white text-center">
        <p className="text-2xl font-bold">
          ¡Descubre cómo Mercurio PYMES puede transformar la gestión documental de tu empresa!
        </p>
      </div>
    </div>
  );
};

export default MercurioPYMES;
