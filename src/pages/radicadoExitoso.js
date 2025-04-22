import React, { useEffect } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useRouter } from 'next/router';

const RadicadoExitoso = () => {
  const router = useRouter();

  // Al montar, mostramos la alerta
  useEffect(() => {
    alert(
      "Gracias por interesarte en nuestro Servicio de Custodia, por favor diligencia el siguiente formulario y a la mayor brevedad posible uno de nuestros asesores te enviará una ampliación de la información que estás buscando."
    );
  }, []);

  // Cuando el router esté listo, comprobamos que vengan los parámetros
  useEffect(() => {
    if (!router.isReady) return;

    const { radicado, nombre, fecha } = router.query;
    // Si falta alguno de los parámetros clave, redirigimos al inicio
    if (!radicado || !nombre || !fecha) {
      router.replace('/');
    }
  }, [router.isReady, router.query, router]);

  // Mientras router.no está listo o en proceso de redirección, mostramos "Cargando"
  if (!router.isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  // Extraemos los query params, poniendo valores por defecto
  const {
    nombre = '',
    fecha = '',
    observaciones = '',
    documentInfo = '',
    radicado = ''
  } = router.query;

  return (
    <main className="min-h-full flex flex-col items-center justify-center p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-lg w-full">
        <FaThumbsUp className="text-green-600 text-6xl mb-4 animate-bounce" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-teal-600 mb-4">Radicación Exitosa</h1>
        <div className="space-y-2">
          <p className="text-lg">
            <span className="font-semibold">Radicado:</span> {radicado}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Radicado por:</span> {nombre}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Fecha agendada:</span> {fecha}
          </p>
          {observaciones && (
            <p className="text-lg">
              <span className="font-semibold">Observaciones:</span> {observaciones}
            </p>
          )}
        </div>
        <div className="border-t mt-6 pt-4 text-left">
          <h2 className="text-xl font-bold mb-2">Información del Formulario</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
            {documentInfo}
          </pre>
        </div>
        <div className="mt-6">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
          >
            Volver
          </button>
        </div>
      </div>
    </main>
  );
};

export default RadicadoExitoso;
