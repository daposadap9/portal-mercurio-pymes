// components/SubNavigation.js
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function SubNavigation({ aliases = {} }) {
  const router = useRouter();

  // Separamos todos los segmentos de la ruta actual
  const pathSegments = router.asPath.split('/').filter(seg => seg !== '');
  if (pathSegments.length === 0) return null;

  // Suponemos que el primer segmento es la carpeta base (por ejemplo, "paginas")
  // Ocultamos ese primer segmento y obtenemos el resto.
  const displaySegments = pathSegments.slice(1);
  
  // Si después de ocultar la carpeta base solo queda un segmento (por ejemplo, "servicios" o "tramites"),
  // no mostramos la navegación, pues se quiere mostrar solo cuando hay algo más.
  if (displaySegments.length < 2) return null;

  // La ruta base sigue siendo la carpeta base original, por ejemplo, "/paginas"
  const basePath = '/' + pathSegments[0];

  // Construimos los breadcrumbs a partir de los segmentos restantes
  const breadcrumbs = displaySegments.map((seg, i) => {
    // Se acumulan los segmentos para construir la ruta completa
    const crumbPath = basePath + '/' + displaySegments.slice(0, i + 1).join('/');
    const displayName = aliases[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1));
    return { path: crumbPath, display: displayName };
  });

  // El breadcrumb padre será el penúltimo, para el botón "Regresar"
  const parentBreadcrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  return (
    <nav className="bg-gray-100 p-4 rounded-md shadow-md flex flex-col md:flex-row md:items-center md:justify-between">
      {/* Breadcrumbs a la izquierda */}
      <div className="flex flex-wrap items-center text-gray-700 font-bold text-xl">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center">
            <Link href={crumb.path} legacyBehavior>
              <a className="hover:underline">{crumb.display}</a>
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2">&gt;</span>
            )}
          </span>
        ))}
      </div>
      {/* Botón "Regresar" a la derecha, que regresa al nivel padre */}
      {parentBreadcrumb && (
        <div className="mt-4 md:mt-0">
          <Link href={parentBreadcrumb.path} legacyBehavior>
            <a className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors">
              <FaArrowLeft />
              <span>Regresar a {parentBreadcrumb.display}</span>
            </a>
          </Link>
        </div>
      )}
    </nav>
  );
}
