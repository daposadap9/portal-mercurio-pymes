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

// ----------------------------
// Componente MercurioDigitalizacion
// ----------------------------
const MercurioDigitalizacion = ({ disabledProvider }) => {
  const router = useRouter();
  const { theme } = useContext(ThemeContext);
  const { updateTransaction } = useContext(TransactionContext);
  const { user } = useContext(UserContext);
  const { dropdownActive } = useDropdown();
  const isAnyDropdownActive = disabledProvider
    ? false
    : (dropdownActive.services || dropdownActive.tramites);

  // Formulario (derecha)
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
  const [options, setOptions]           = useState([]);
  const [selectedId, setSelectedId]     = useState("");
  const [selectedOpt, setSelectedOpt]   = useState(null);
  const [isMonthly, setIsMonthly]       = useState(false);

  // userId persistente
  const [userId] = useState(() => {
    let uid = Cookies.get("userId");
    if (!uid) {
      uid = uuidv4();
      Cookies.set("userId", uid, { expires: 7 });
    }
    return uid;
  });

  // Totales
  const annualTotal   = selectedOpt ? Number(selectedOpt.value) + Number(selectedOpt.startup || 0) : 0;
  const monthlyPrice  = Math.ceil(annualTotal / 12);
  const displayTotal  = isMonthly ? monthlyPrice : annualTotal;
  const calculatedDiscount = 0;

  // Traer servicios
  const { data, loading: loadingServices, error: errorServices } = useQuery(
    GET_SERVICES,
    {
      onError: err => {
        if (err.networkError?.statusCode === 504) {
          console.error("504 Gateway Timeout al cargar servicios");
        }
      }
    }
  );

  // Cuando lleguen, filtrar “digitalización”
  useEffect(() => {
    if (data?.services) {
      const svc = data.services.find(s => s.name.toLowerCase().includes("digital"));
      if (svc) setOptions(svc.options || []);
    }
  }, [data]);

  // Mantener contexto de transacción
  useEffect(() => {
    updateTransaction(selectedOpt, displayTotal, calculatedDiscount);
  }, [selectedOpt, displayTotal, calculatedDiscount, updateTransaction]);

  // Mutations
  const [insertMertRecibido, { loading: loadingRad, error: radError }] = useMutation(INSERT_MERT_RECIBIDO);
  const [savePayment,       { loading: loadingPay, error: payError }]  = useMutation(SAVE_TRANSACTION);

  // Handlers
  const handleSelect = e => {
    const id = e.target.value;
    setSelectedId(id);
    setFormData(f => ({ ...f, opcionSeleccionada: id }));
    setSelectedOpt(options.find(o => o.id === id) || null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    if (name === "opcionSeleccionada") {
      setSelectedId(value);
      setSelectedOpt(options.find(o => o.id === value) || null);
    }
  };

  const handlePayment = async () => {
    if (!selectedOpt) {
      alert("Por favor, seleccione un plan para cotizar.");
      return;
    }
    try {
      const stateLabel = isMonthly
        ? "suscripción mensual"
        : "transacción en formulario de pago";
      const { data } = await savePayment({
        variables: {
          userId,
          input: {
            digitalizacion: selectedOpt,
            software: null,
            custodia: null,
            total: displayTotal,
            discount: calculatedDiscount,
            state: stateLabel,
          }
        }
      });
      if (data.saveTransaction) {
        router.push({
          pathname: "/PaymentFormPSE",
          query: { previousPage: "/paginas/cotizaTuServicio" },
        });
      } else {
        alert("Error al guardar la transacción.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión. Por favor, intente de nuevo.");
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (
      !formData.nombre ||
      !formData.apellido ||
      !formData.entidad ||
      !formData.email ||
      !formData.telefono ||
      !formData.opcionSeleccionada
    ) {
      alert("Por favor, complete todos los campos y seleccione un plan.");
      return;
    }
    const planType = isMonthly ? "Mensual" : "Anual";
    const documentInfo = `
      ${formData.nombre} - ${formData.apellido} - ${formData.entidad} -
      ${formData.email} - ${formData.telefono} - ${formData.observaciones} -
      Plan: ${selectedOpt.label} (${planType}) - Valor: ${displayTotal.toLocaleString("es-ES")}
    `;
    const documentInfoGeneral = "Mercurio Digitalización";

    try {
      const { data } = await insertMertRecibido({
        variables: { documentInfo, documentInfoGeneral }
      });
      const result = data.insertMertRecibido;
      if (result.success) {
        router.push({
          pathname: "/radicadoExitoso",
          query: {
            nombre: formData.nombre,
            observaciones: formData.observaciones,
            documentInfo,
            documentInfoGeneral,
            radicado: result.idDocumento
          }
        });
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al radicar.");
    }
  };

  // ——— RENDERIZADO ———
  return (
    <div className="min-h-full flex flex-col items-center px-2 md:px-0">
      {loadingServices ? (
        <p>Cargando planes...</p>
      ) : errorServices ? (
        <p className="text-red-600">Error al cargar planes: {errorServices.message}</p>
      ) : (
        <>
          {/* Título */}
          <div className={`
            flex justify-center text-2xl md:text-4xl font-bold transition-all
            duration-500 ease-in-out text-teal-600 text-center titulo-shadow mb-10
            ${isAnyDropdownActive ? "mt-24" : ""}
          `}>
            <div className="w-full lg:w-[85%] text-xl w-full">
              <h1>
                Olvídate de los documentos físicos, digitalízalos con nosotros.
                Seguridad, orden y accesibilidad.
              </h1>
            </div>
          </div>

          <div className="flex flex-col justify-between p-4">
            <div className="w-full mx-auto flex flex-col lg:flex-row justify-evenly gap-4 flex-1">

              {/* Izquierda: Cotizador */}
              <div className="w-full lg:w-[40%]">
                <div className="lg:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30">
                  <p className="mb-4 text-xl font-bold text-black text-justify">
                    Digitalización de Documentos: Seguridad, Orden y Accesibilidad
                  </p>
                  <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                    Dile adiós al desorden y al riesgo de pérdida de documentos. 
                    Con nuestro servicio de digitalización, transformamos tu archivo físico 
                    en un sistema seguro, accesible y eficiente.
                  </p>
                  <ul className="list-disc list-inside mb-4 text-black text-base font-medium text-justify">
                    <li>Organización y protección en formato digital.</li>
                    <li>Acceso rápido y respaldo seguro desde cualquier lugar.</li>
                    <li>Optimiza espacio y reduce costos.</li>
                  </ul>
                  <p className="mb-4 leading-relaxed text-black text-base font-medium text-justify">
                    En la sección{" "}
                    <Link href="/paginas/cotizaTuServicio" legacyBehavior>
                      <a className="text-blue-600 underline">¡cotiza tu servicio!</a>
                    </Link>{" "}
                    podrás conocer los precios y planes.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-white rounded-xl shadow-lg border">
                  <h2 className="text-xl font-bold text-center text-teal-600 mb-2">
                    Cotizador de Digitalización
                  </h2>

                  {/* SELECT DEL COTIZADOR */}
                  <label className="block text-sm font-semibold mb-1">Selecciona tu plan:</label>
                  <select
                    className="w-full border rounded px-3 py-2 mb-3 text-teal-950"
                    value={selectedId}
                    onChange={handleSelect}
                  >
                    <option value="">-- Escoge un plan --</option>
                    {options.map(opt => {
  // 1) Extraer número de imágenes de opt.label
  const numImages = parseInt(
    opt.label.replace(/\D/g, ''),  // elimina todo lo que no sea dígito
    10
  ) || 1;                          // en caso de fallo, al menos 1 evita división por cero

  // 2) Precio anual
  const annualPrice = Number(opt.value);

  // 3) Calcular precio por imagen (redondeado al entero más cercano)
  const perImage = Math.round(annualPrice / numImages);

  return (
    <option key={opt.id} value={opt.id}>
      {`${opt.label} Desde $${opt.value.toLocaleString('es-ES')} C/U`}
    </option>
  );
})}


                  </select>

                  {selectedOpt && (
                    <>
                      <div className="mb-4 flex justify-center space-x-8">
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="radio"
                            name="billingPeriod"
                            checked={!isMonthly}
                            onChange={() => setIsMonthly(false)}
                            className="form-radio"
                          />
                          <span>Pago Anual</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm">
                          <input
                            type="radio"
                            name="billingPeriod"
                            checked={isMonthly}
                            onChange={() => setIsMonthly(true)}
                            className="form-radio"
                          />
                          <span>Mensual: ${monthlyPrice.toLocaleString("es-ES")}/mes</span>
                        </label>
                      </div>
                      <p className="mb-2 text-center">
                        <strong>Opciones:</strong> {selectedOpt.label}
                      </p>
                      <p className="mb-2 text-center">
                        <strong>Precio {isMonthly ? '(mensual)' : '(anual)'}:</strong> $
                        {displayTotal.toLocaleString("es-ES")}
                      </p>
                    </>
                  )}


                  <div className="mt-4 gap-2 flex justify-center">
                    {/*<button
                      type="button"
                      onClick={handlePayment}
                      className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors"
                    >
                      Conoce el detalle 
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

              {/* Derecha: Formulario “¡Adquiérelo ahora!” */}
              <div className="w-full lg:w-[40%]">
                <div className="bg-gray-50 p-6 rounded-lg shadow-lg h-full flex flex-col">
                  <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
                    ¡Adquiérelo ahora!
                  </h2>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
                    {/* Campos personales */}
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

                    {/* SELECT del formulario */}
                    <div className="flex flex-col mt-2">
                      <label className="text-sm text-gray-700 font-semibold mb-1">
                        Plan de Digitalización:
                      </label>
                      <select
                        name="opcionSeleccionada"
                        value={formData.opcionSeleccionada}
                        onChange={handleChange}
                        required
                        className="shadow-inset-sm p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                      >
                        <option value="">-- Escoge un plan --</option>
                        {options.map(opt => {
  // 1) Extraer número de imágenes de opt.label
  const numImages = parseInt(
    opt.label.replace(/\D/g, ''),  // elimina todo lo que no sea dígito
    10
  ) || 1;                          // en caso de fallo, al menos 1 evita división por cero

  // 2) Precio anual
  const annualPrice = Number(opt.value);

  // 3) Calcular precio por imagen (redondeado al entero más cercano)
  const perImage = Math.round(annualPrice / numImages);

  return (
    <option key={opt.id} value={opt.id}>
      {`${opt.label} Desde $${opt.value.toLocaleString('es-ES')} C/U`}
    </option>
  );
})}

                      </select>
                      {formData.opcionSeleccionada && (
                        <div className="flex justify-center gap-4 mt-2 text-xs">
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              checked={!isMonthly}
                              onChange={() => setIsMonthly(false)}
                            />
                            <span>Anual</span>
                          </label>
                          <label className="flex items-center space-x-1">
                            <input
                              type="radio"
                              checked={isMonthly}
                              onChange={() => setIsMonthly(true)}
                            />
                            <span>Mensual</span>
                          </label>
                        </div>
                      )}
                    </div>

                    {/* Errores */}
                    {radError && <p className="text-red-600">Error: {radError.message}</p>}
                    {payError && <p className="text-red-600">Error de pago: {payError.message}</p>}

                    {/* Botón Enviar */}
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
        </>
      )}
    </div>
  );
};

export default MercurioDigitalizacion;
