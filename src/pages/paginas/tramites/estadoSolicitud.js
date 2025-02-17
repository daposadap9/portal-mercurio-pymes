import React, { useState } from 'react';

const EstadoSolicitud = () => {
  const [idDocumento, setIdDocumento] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manejar la consulta a la API
  const consultarEstado = async () => {
    if (!idDocumento) {
      alert('Por favor, introduce un ID de documento válido.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/test-db?idDocumento=${idDocumento}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al realizar la consulta');
      }

      setResultado(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Consulta el Estado de tu Solicitud</h1>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          value={idDocumento}
          onChange={(e) => setIdDocumento(e.target.value)}
          placeholder="Ingresa el ID del documento"
          className="p-3 border rounded-lg w-full"
        />

        <button
          onClick={consultarEstado}
          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700"
        >
          Consultar
        </button>
      </div>

      {loading && <p>🔍 Consultando...</p>}

      {error && <p className="text-red-600">❌ {error}</p>}

      {resultado && resultado.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Resultados:</h2>
          <table className="w-full border-collapse border border-gray-300 bg-white">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-3">ID Documento</th>
                <th className="border p-3">Usuario</th>
                <th className="border p-3">Fecha Documento</th>
                <th className="border p-3">Tipo</th>
                <th className="border p-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border p-3">{item.IDDOCUMENTO}</td>
                  <td className="border p-3">{item.IDUSUARIO_RAD || 'N/A'}</td>
                  <td className="border p-3">{item.FECDOCUMENTO}</td>
                  <td className="border p-3">{item.Tipo}</td>
                  <td className="border p-3">{item.ESTDOCUMENTO}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        resultado && <p>ℹ️ No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default EstadoSolicitud;