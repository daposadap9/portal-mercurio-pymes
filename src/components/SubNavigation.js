import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function SubNavigation({ aliases = {}, previousPage }) {
  const router = useRouter();

  // Limpiamos la ruta actual (quitando la query)
  const currentPath = router.asPath.split('?')[0];
  const pathSegments = currentPath.split('/').filter(seg => seg !== '');
  if (pathSegments.length === 0) return null;

  // Mostramos solo los segmentos a partir del primero.
  const displaySegments = pathSegments.slice(1);
  if (displaySegments.length < 2 && !previousPage) return null;

  const basePath = '/' + pathSegments[0];
  let breadcrumbs = displaySegments.map((seg, i) => {
    const crumbPath = basePath + '/' + displaySegments.slice(0, i + 1).join('/');
    const displayName = aliases[seg] || (seg.charAt(0).toUpperCase() + seg.slice(1));
    return { path: crumbPath, display: displayName };
  });

  // Si se pasó previousPage, la limpiamos (quitamos query) y reemplazamos los breadcrumbs
  let cleanedPreviousPage = null;
  if (previousPage) {
    cleanedPreviousPage = previousPage.split('?')[0];
    const prevSegments = cleanedPreviousPage.split('/').filter(seg => seg !== '');
    const previousCrumb = {
      path: cleanedPreviousPage,
      display: aliases[prevSegments[prevSegments.length - 1]] ||
               (prevSegments[prevSegments.length - 1].charAt(0).toUpperCase() +
                prevSegments[prevSegments.length - 1].slice(1))
    };
    const currentCrumb =
      breadcrumbs.length > 0
        ? breadcrumbs[breadcrumbs.length - 1]
        : { path: currentPath, display: currentPath.split('/').pop() || '' };

    // Reemplazamos el array completo de breadcrumbs por solo dos elementos:
    // el de la página anterior (limpia) y el de la página actual.
    breadcrumbs = [previousCrumb, currentCrumb];
  }

  const parentBreadcrumb = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;

  // Función para navegar sin animación.
  const handleNavigation = (e, href) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.skipAnimation = true;
    }
    router.push(href);
  };

  return (
    <nav className="bg-gray-100 p-3 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center">
            <Link href={crumb.path} legacyBehavior>
              <a
                onClick={(e) => handleNavigation(e, crumb.path)}
                className="relative group font-bold text-lg text-teal-500 transition-all duration-500 hover:text-teal-600"
              >
                {crumb.display}
                <span className="absolute left-0 -bottom-0.5 w-0 h-0.5 bg-teal-500 group-hover:w-full transition-all duration-500"></span>
              </a>
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-500 font-bold text-xl">/</span>
            )}
          </span>
        ))}
      </div>
      <div className="mt-2 md:mt-0">
        {previousPage ? (
          <Link href={cleanedPreviousPage} legacyBehavior>
            <a
              onClick={(e) => handleNavigation(e, cleanedPreviousPage)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow hover:from-teal-600 hover:to-teal-500 transition-all duration-300"
            >
              <FaArrowLeft className="text-lg" />
              <span className="font-bold text-sm">Regresar a la página anterior</span>
            </a>
          </Link>
        ) : (
          parentBreadcrumb && (
            <Link href={parentBreadcrumb.path} legacyBehavior>
              <a
                onClick={(e) => handleNavigation(e, parentBreadcrumb.path)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full shadow hover:from-teal-600 hover:to-teal-500 transition-all duration-300"
              >
                <FaArrowLeft className="text-lg" />
                <span className="font-bold text-sm">
                  Regresar a {parentBreadcrumb.display}
                </span>
              </a>
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
