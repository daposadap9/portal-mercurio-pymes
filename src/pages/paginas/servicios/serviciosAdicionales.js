import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

// Mutation que realiza todo el proceso de radicación
const INSERT_MERT_RECIBIDO = gql`
  mutation InsertMertRecibido($documentInfo: String!, $documentInfoGeneral: String!) {
    insertMertRecibido(documentInfo: $documentInfo, documentInfoGeneral: $documentInfoGeneral) {
      success
      message
      idDocumento
    }
  }
`;

const ServiciosAdicionales = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    entidad: "",
    email: "",
    telefono: "",
    observaciones: "",
    opcionSeleccionada: "Servicios adicionales"  // se mantiene en el objeto pero no se muestra un <select>
  });

  const [insertMertRecibido, { loading, error }] = useMutation(INSERT_MERT_RECIBIDO);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      nombre, apellido, entidad,
      email, telefono, observaciones,
      opcionSeleccionada
    } = formData;

    // Validación
    if (!nombre || !apellido || !entidad || !email || !telefono || !opcionSeleccionada) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Formar el string que espera la mutation
    const documentInfo = [
      nombre,
      apellido,
      entidad,
      email,
      telefono,
      observaciones,
      opcionSeleccionada
    ].join(" - ");

    const documentInfoGeneral = "Servicios Adicionales";

    try {
      const { data } = await insertMertRecibido({
        variables: { documentInfo, documentInfoGeneral }
      });
      const result = data.insertMertRecibido;

      if (result.success) {
        router.push({
          pathname: '/radicadoExitoso',
          query: {
            nombre,
            observaciones,
            documentInfo,
            documentInfoGeneral,
            radicado: result.idDocumento
          }
        });
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      console.error("Error al radicar:", err);
      alert("Error al radicar");
    }
  };

  return (
    <div className="min-h-full flex flex-col md:flex-row justify-center p-4 gap-7">
      {/* Izquierda: texto informativo */}
      <div className="w-full lg:w-[35%] flex justify-center h-full">
        <div className="text-center lg:text-left bg-white bg-opacity-0 backdrop-blur-xl p-6 rounded-xl border border-white/30 w-11/12">
          <p className="mb-4 leading-relaxed text-black text-base font-normal">
            Proveemos los insumos necesarios para que encuentres todo lo que necesitas en la digitalización y custodia de tus documentos en el mismo lugar.
          </p>
        </div>
      </div>

      {/* Derecha: formulario */}
      <div className="w-full lg:w-[35%] flex justify-center">
        <div className="bg-gray-50 p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-xl font-bold text-teal-600 text-center mb-6">
            ¡Adquiérelo ahora!
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Datos personales */}
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              className="shadow-inset-sm p-2 rounded-md focus:ring-2 focus:ring-teal-500"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              className="shadow-inset-sm p-2 rounded-md focus:ring-2 focus:ring-teal-500"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="entidad"
              placeholder="Entidad / Empresa"
              className="shadow-inset-sm p-2 rounded-md focus:ring-2 focus:ring-teal-500"
              value={formData.entidad}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="shadow-inset-sm p-2 rounded-md focus:ring-2 focus:ring-teal-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="telefono"
              placeholder="Teléfono celular"
              className="shadow-inset-sm p-2 rounded-md focus:ring-2 focus:ring-teal-500"
              value={formData.telefono}
              onChange={handleChange}
              required
            />

            {/* Observaciones */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold">Observaciones:</label>
              <textarea
                name="observaciones"
                rows="4"
                placeholder="Ingresa tus observaciones..."
                className="shadow-inset-sm p-2 rounded-md focus:ring-2 focus:ring-teal-500"
                value={formData.observaciones}
                onChange={handleChange}
              />
            </div>

            {/* Campo oculto */}
            <input
              type="hidden"
              name="opcionSeleccionada"
              value={formData.opcionSeleccionada}
            />

            {/* Error */}
            {error && (
              <p className="text-red-600">Error al enviar: {error.message}</p>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 text-white py-2 rounded-md hover:bg-teal-600 transition"
            >
              {loading ? "Procesando..." : "Enviar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiciosAdicionales;
