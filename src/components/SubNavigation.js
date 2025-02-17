// components/SubNavigation.js
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function SubNavigation({ aliases = {} }) {
  const router = useRouter();

  // Eliminamos la query (todo lo que sigue a "?" incluido el "?")
  const pathWithoutQuery = router.asPath.split('?')[0];
  // Separamos todos los segmentos de la ruta actual sin la query
  const pathSegments = pathWithoutQuery.split('/').filter(seg => seg !== '');
  if (pathSegments.length === 0) return null;

  // Suponemos que el primer segmento es la carpeta base (por ejemplo, "paginas")
  // Ocultamos ese primer segmento y obtenemos el resto.
  const displaySegments = pathSegments.slice(1);
  
  // Si solo queda un segmento (por ejemplo, "servicios" o "tramites"), no mostramos la navegación.
  if (displaySegments.length < 2) return null;

  // La ruta base sigue siendo la carpeta base original, por ejemplo, "/paginas"
  const basePath = '/' + pathSegments[0];

  // Construimos los breadcrumbs a partir de los segmentos restantes
  const breadcrumbs = displaySegments.map((seg, i) => {
    // Se acumulan los segmentos para construir la ruta completa
    const crumbPath = basePath + '/' + displaySegments.slice(0, i + 1).join('/');
    // Se utiliza el segmento limpio (sin query) para el título
    const displayName = aliases[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1));
    return { path: crumbPath, display: displayName };
  });

  // El breadcrumb padre será el penúltimo, para el botón "Regresar"
  const parentBreadcrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  return (
    <nav className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Breadcrumbs a la izquierda */}
      <div className="flex flex-wrap items-center">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center">
            <Link href={crumb.path} legacyBehavior>
              <a className="relative group font-bold text-xl text-teal-500 transition-all duration-500 hover:text-teal-600">
                {crumb.display}
                {/* Línea de animación debajo del texto */}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-500"></span>
              </a>
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-4 text-gray-500 font-bold text-2xl">/</span>
            )}
          </span>
        ))}
      </div>
      {/* Botón "Regresar" a la derecha */}
      {parentBreadcrumb && (
        <div className="mt-4 md:mt-0">
          <Link href={parentBreadcrumb.path} legacyBehavior>
            <a className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-xl hover:from-teal-600 hover:to-teal-500 transition-all duration-300">
              <FaArrowLeft className="text-xl" />
              <span className="font-bold">Regresar a {parentBreadcrumb.display}</span>
            </a>
          </Link>
        </div>
      )}
    </nav>
  );
}
