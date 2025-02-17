// components/SubNavigation.js
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function SubNavigation({ aliases = {} }) {
  const router = useRouter();

  // Eliminamos la query y separamos los segmentos de la ruta.
  const pathWithoutQuery = router.asPath.split('?')[0];
  const pathSegments = pathWithoutQuery.split('/').filter(seg => seg !== '');
  if (pathSegments.length === 0) return null;

  // Mostramos solo los segmentos a partir del primero.
  const displaySegments = pathSegments.slice(1);
  if (displaySegments.length < 2) return null;

  const basePath = '/' + pathSegments[0];
  const breadcrumbs = displaySegments.map((seg, i) => {
    const crumbPath = basePath + '/' + displaySegments.slice(0, i + 1).join('/');
    const displayName = aliases[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1));
    return { path: crumbPath, display: displayName };
  });

  const parentBreadcrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  // Función para navegar sin animación.
  const handleNavigation = (e, href) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.skipAnimation = true; // Marcamos para saltar la animación.
    }
    router.push(href);
  };

  return (
    <nav className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center">
            <Link href={crumb.path} legacyBehavior>
              <a
                onClick={(e) => handleNavigation(e, crumb.path)}
                className="relative group font-bold text-xl text-teal-500 transition-all duration-500 hover:text-teal-600"
              >
                {crumb.display}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-500"></span>
              </a>
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-4 text-gray-500 font-bold text-2xl">/</span>
            )}
          </span>
        ))}
      </div>
      {parentBreadcrumb && (
        <div className="mt-4 md:mt-0">
          <Link href={parentBreadcrumb.path} legacyBehavior>
            <a
              onClick={(e) => handleNavigation(e, parentBreadcrumb.path)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow-xl hover:from-teal-600 hover:to-teal-500 transition-all duration-300"
            >
              <FaArrowLeft className="text-xl" />
              <span className="font-bold">Regresar a {parentBreadcrumb.display}</span>
            </a>
          </Link>
        </div>
      )}
    </nav>
  );
}
