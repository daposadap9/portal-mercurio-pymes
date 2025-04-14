import React, { useState } from 'react';

const EstadoSolicitud = () => {
  const [idDocumento, setIdDocumento] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Manejar la consulta a la API
  const consultarEstado = async () => {
    if (!idDocumento) {
      alert('Por favor, introduce un Radicado válido.');
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
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-teal-500">
        Consulta el Estado de tu Solicitud
      </h1>

      <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
        <input
          type="text"
          value={idDocumento}
          onChange={(e) => setIdDocumento(e.target.value)}
          placeholder="Ingresa el numero de radicado"
          className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
        />
        <button
          onClick={consultarEstado}
          className="bg-teal-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors hover:bg-teal-700"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          ❌ {error}
        </div>
      )}

      {resultado && resultado.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-teal-700">
            Resultados:
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200 bg-white shadow rounded-lg">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Radicado
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {resultado.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.IDDOCUMENTO}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.ESTDOCUMENTO}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        resultado && <p className="text-gray-600">ℹ️ No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default EstadoSolicitud;
