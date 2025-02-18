// components/Header.jsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { 
  FaHome, 
  FaConciergeBell, 
  FaFileAlt, 
  FaEnvelope, 
  FaSignInAlt, 
  FaBars, 
  FaTimes,
  FaSearch,
  FaShieldAlt,
  FaGavel,
  FaBoxes,
  FaAngleRight,
  FaFileInvoiceDollar,
  FaCommentAlt,
  FaListAlt,
  FaInfoCircle
} from 'react-icons/fa';

const Header = ({ handleNavigation, loading }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileServicesModalOpen, setMobileServicesModalOpen] = useState(false);
  const [isMobileTramitesModalOpen, setMobileTramitesModalOpen] = useState(false);

  // Estados para controlar el dropdown en Desktop mediante hover
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showTramitesDropdown, setShowTramitesDropdown] = useState(false);

  const toggleMobileMenu = () => {
    if (loading) return; // Bloquea la acción si hay transición
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileServicesModal = () => {
    setMobileServicesModalOpen(false);
  };

  // Opciones para el dropdown de SERVICIOS en Desktop
  const desktopServicesDropdownItems = [
    { label: "MERCURIO SGDEA", href: "/paginas/servicios/mercurioSGDEA", icon: <FaSearch className="mr-2" /> },
    { label: "MERCURIO PYMES", href: "/paginas/servicios/mercurioPYMES", icon: <FaFileAlt className="mr-2" /> },
    { label: "CUSTODIA", href: "/paginas/servicios/mercurioCustodia", icon: <FaShieldAlt className="mr-2" /> },
    { label: "DIGITALIZACIÓN", href: "/paginas/servicios/mercurioDigitalizacion", icon: <FaGavel className="mr-2" /> },
    { label: "SERVICIOS ADICIONALES", href: "/paginas/servicios/serviciosAdicionales", icon: <FaBoxes className="mr-2" /> }
  ];

  // Opciones para el menú de SERVICIOS en Mobile
  const mobileServicesDropdownItems = [
    { label: "TODOS LOS PLANES", href: "/paginas/servicios", icon: <FaAngleRight className="mr-2" /> },
    ...desktopServicesDropdownItems.map(item => ({
      ...item,
      icon: <FaAngleRight className="mr-2" />
    }))
  ];

  // Opciones para el dropdown de TRÁMITES en Desktop (sin "TODOS LOS TRÁMITES")
  const desktopTramitesDropdownItems = [
    { label: "PAGA TU FACTURA", action: () => alert("Pagar factura"), icon: <FaFileInvoiceDollar className="mr-2" /> },
    { label: "PQRSDF", href: "/paginas/tramites/pqrsdf", icon: <FaCommentAlt className="mr-2" /> },
    { label: "SOLICITUDES MERCURIO CLIENTES", action: () => alert("Ver solicitudes"), icon: <FaListAlt className="mr-2" /> },
    { label: "CONSULTA ESTADO DE SOLICITUD", href: "/paginas/tramites/estadoSolicitud", icon: <FaInfoCircle className="mr-2" /> }
  ];

  // Opciones para el menú de TRÁMITES en Mobile (incluye "TODOS LOS TRÁMITES")
  const mobileTramitesDropdownItems = [
    { label: "TODOS LOS TRÁMITES", href: "/paginas/tramites", icon: <FaAngleRight className="mr-2" /> },
    ...desktopTramitesDropdownItems.map(item => ({
      ...item,
      icon: <FaAngleRight className="mr-2" />
    }))
  ];

  // Filtrar los items en mobile según la ruta actual:
  // Si ya estás en '/paginas/servicios', no mostrar "TODOS LOS PLANES"
  const filteredMobileServicesItems = mobileServicesDropdownItems.filter(
    (item) => !(item.label === "TODOS LOS PLANES" && router.pathname === "/paginas/servicios")
  );

  // Si ya estás en '/paginas/tramites', no mostrar "TODOS LOS TRÁMITES"
  const filteredMobileTramitesItems = mobileTramitesDropdownItems.filter(
    (item) => !(item.label === "TODOS LOS TRÁMITES" && router.pathname === "/paginas/tramites")
  );

  // Determina si el enlace corresponde a la ruta actual (se compara de forma exacta)
  const isActive = (href) => {
    return router.pathname === href;
  };

  // Clases base para los enlaces
  const baseLinkClass =
    "flex items-center font-bold p-2 transition-transform duration-300 ease-in-out hover:scale-105";
  const baseLinkClass2 =
    "flex items-center font-bold p-2 transition-colors duration-300 ease-in-out";
  const activeClass = "bg-teal-600 text-white rounded-md";
  const inactiveClass = "text-teal-600 hover:bg-teal-600 hover:text-white hover:rounded-md";

  // Maneja el clic en el enlace (con callback opcional)
  const handleLinkClick = (href, callback) => (e) => {
    e.preventDefault();
    if (isActive(href)) return;
    if (loading) return;
    if (callback) callback();
    if (handleNavigation) {
      handleNavigation(href);
    } else {
      router.push(href);
    }
  };

  return (
    <header className="sticky top-0 w-full bg-slate-100 shadow-lg z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/logo-servisoft-30years.webp" 
            alt="Logo Servisoft" 
            className="w-56" 
          />
        </div>

        {/* Menú Desktop */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link href="/" legacyBehavior>
            <a 
              onClick={handleLinkClick('/')}
              className={`${baseLinkClass} ${isActive('/') ? activeClass : inactiveClass}`}
            >
              <FaHome className="mr-2" /> INICIO
            </a>
          </Link>

          {/* Dropdown de SERVICIOS (Desktop) */}
          <div 
            className="relative inline-block"
            onMouseEnter={() => setShowServicesDropdown(true)}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <Link href="/paginas/servicios" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/servicios')}
                className={`${baseLinkClass} ${isActive('/paginas/servicios') ? activeClass : inactiveClass}`}
              >
                <FaConciergeBell className="mr-2" /> SERVICIOS
              </a>
            </Link>
            {showServicesDropdown && (
              <div
                className="absolute left-0 top-full w-72 bg-white/80 shadow-2xl rounded-lg backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100 z-50"
              >
                <ul>
                  {desktopServicesDropdownItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href} legacyBehavior>
                        <a 
                          onClick={handleLinkClick(item.href)}
                          className="flex items-center justify-start text-left px-4 py-2 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                        >
                          {item.icon}
                          {item.label}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Dropdown de TRÁMITES (Desktop) */}
          <div 
            className="relative inline-block"
            onMouseEnter={() => setShowTramitesDropdown(true)}
            onMouseLeave={() => setShowTramitesDropdown(false)}
          >
            <Link href="/paginas/tramites" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/tramites')}
                className={`${baseLinkClass} ${isActive('/paginas/tramites') ? activeClass : inactiveClass}`}
              >
                <FaFileAlt className="mr-2" /> TRÁMITES
              </a>
            </Link>
            {showTramitesDropdown && (
              <div
                className="absolute left-0 top-full w-72 bg-white/80 shadow-2xl rounded-lg backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100 z-50"
              >
                <ul>
                  {desktopTramitesDropdownItems.map((item, index) => (
                    <li key={index}>
                      {item.href ? (
                        <Link href={item.href} legacyBehavior>
                          <a 
                            onClick={handleLinkClick(item.href)}
                            className="flex items-center justify-start text-left px-4 py-2 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                          >
                            {item.icon}
                            {item.label}
                          </a>
                        </Link>
                      ) : (
                        <button 
                          onClick={() => { item.action && item.action(); }}
                          className="flex items-center justify-start text-left w-full px-4 py-2 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Link href="/paginas/contactanos" legacyBehavior>
            <a 
              onClick={handleLinkClick('/paginas/contactanos')}
              className={`${baseLinkClass} ${isActive('/paginas/contactanos') ? activeClass : inactiveClass}`}
            >
              <FaEnvelope className="mr-2" /> CONTÁCTENOS
            </a>
          </Link>
        </div>

        {/* Botón Ingresar (Desktop) */}
        <div className="hidden lg:flex items-center">
          <Link href="/paginas/login" legacyBehavior>
            <a 
              onClick={handleLinkClick('/paginas/login')}
              className={`${baseLinkClass} ${isActive('/paginas/login') ? activeClass : "text-white bg-teal-500 hover:bg-teal-600"} rounded-md`}
            >
              <FaSignInAlt className="mr-2" /> INGRESAR
            </a>
          </Link>
        </div>

        {/* Menú móvil */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu} 
            className="text-teal-600 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-slate-100 shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-3">
            <Link href="/" legacyBehavior>
              <a 
                onClick={handleLinkClick('/', toggleMobileMenu)}
                className={`${baseLinkClass2} ${isActive('/') ? activeClass : inactiveClass}`}
              >
                <FaHome className="mr-2" /> INICIO
              </a>
            </Link>
            <button 
              onClick={() => {
                setMobileServicesModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`${baseLinkClass2} text-left ${isActive('/paginas/servicios') ? activeClass : inactiveClass}`}
            >
              <FaConciergeBell className="mr-2" /> SERVICIOS
            </button>
            <button 
              onClick={() => {
                setMobileTramitesModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`${baseLinkClass2} text-left ${isActive('/paginas/tramites') ? activeClass : inactiveClass}`}
            >
              <FaFileAlt className="mr-2" /> TRÁMITES
            </button>
            <Link href="/paginas/contactanos" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/contactanos', toggleMobileMenu)}
                className={`${baseLinkClass2} ${isActive('/paginas/contactanos') ? activeClass : inactiveClass}`}
              >
                <FaEnvelope className="mr-2" /> CONTÁCTENOS
              </a>
            </Link>
            <Link href="/paginas/login" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/login', toggleMobileMenu)}
                className={`${baseLinkClass2} ${isActive('/paginas/login') ? activeClass : "text-teal-600 hover:bg-teal-600 hover:text-white hover:rounded-md"}`}
              >
                <FaSignInAlt className="mr-2" /> INGRESAR
              </a>
            </Link>
          </div>
        </div>
      )}

      {/* Modal para Servicios en Mobile */}
      {isMobileServicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6 relative animate-fadeIn">
            <button 
              onClick={closeMobileServicesModal}
              className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors duration-300"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl font-bold text-teal-600 mb-4 text-center">SERVICIOS</h2>
            <ul className="space-y-3">
              {filteredMobileServicesItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} legacyBehavior>
                    <a 
                      onClick={handleLinkClick(item.href, () => setMobileServicesModalOpen(false))}
                      className="flex items-center justify-start text-left px-4 py-2 rounded-md text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                    >
                      {item.icon}
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Modal para Trámites en Mobile */}
      {isMobileTramitesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-md p-6 relative animate-fadeIn">
            <button 
              onClick={() => setMobileTramitesModalOpen(false)}
              className="absolute top-2 right-2 text-teal-600 hover:text-teal-800 transition-colors duration-300"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-2xl font-bold text-teal-600 mb-4 text-center">TRÁMITES</h2>
            <ul className="space-y-3">
              {filteredMobileTramitesItems.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <Link href={item.href} legacyBehavior>
                      <a 
                        onClick={handleLinkClick(item.href, () => setMobileTramitesModalOpen(false))}
                        className="flex items-center justify-start text-left px-4 py-2 rounded-md text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                      >
                        {item.icon}
                        {item.label}
                      </a>
                    </Link>
                  ) : (
                    <button 
                      onClick={() => { item.action && item.action(); setMobileTramitesModalOpen(false); }}
                      className="flex items-center justify-start text-left w-full px-4 py-2 rounded-md text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
