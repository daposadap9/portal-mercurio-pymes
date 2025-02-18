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
  FaAngleRight
} from 'react-icons/fa';

const Header = ({ handleNavigation, loading }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileServicesModalOpen, setMobileServicesModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    if (loading) return; // Bloquea la acción si hay transición
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileServicesModal = () => {
    setMobileServicesModalOpen(false);
  };

  // Determina si el enlace corresponde a la ruta actual
  const isActive = (href) => router.pathname === href;

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

  // Opciones para el dropdown de Servicios en Desktop (agregamos iconos)
  const desktopServicesDropdownItems = [
    { label: "MERCURIO SGDEA", href: "/paginas/servicios/mercurioSGDEA", icon: <FaSearch className="mr-2" /> },
    { label: "MERCURIO PYMES", href: "/paginas/servicios/mercurioPYMES", icon: <FaFileAlt className="mr-2" /> },
    { label: "CUSTODIA", href: "/paginas/servicios/mercurioCustodia", icon: <FaShieldAlt className="mr-2" /> },
    { label: "DIGITALIZACIÓN", href: "/paginas/servicios/mercurioDigitalizacion", icon: <FaGavel className="mr-2" /> },
    { label: "SERVICIOS ADICIONALES", href: "/paginas/servicios/serviciosAdicionales", icon: <FaBoxes className="mr-2" /> }
  ];

  // Opciones para el menú de Servicios en Mobile (incluye "TODOS LOS PLANES")
  const mobileServicesDropdownItems = [
    { label: "TODOS LOS PLANES", href: "/paginas/servicios", icon: <FaAngleRight className="mr-2" /> },
    ...desktopServicesDropdownItems.map(item => ({
      ...item,
      icon: <FaAngleRight className="mr-2" />
    }))
  ];

  return (
    <header className="sticky top-0 w-full bg-slate-100 shadow-lg z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/logo-servisoft-30years.png" 
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

          {/* Dropdown de SERVICIOS */}
          <div className="relative group">
            <Link href="/paginas/servicios" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/servicios')}
                className={`${baseLinkClass} ${isActive('/paginas/servicios') ? activeClass : inactiveClass}`}
              >
                <FaConciergeBell className="mr-2" /> SERVICIOS
              </a>
            </Link>
            {/* Menú desplegable pegado al header con efecto flotante */}
            <div className="absolute left-0 top-full w-72 bg-white/80 shadow-2xl rounded-lg backdrop-blur-sm transform scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 z-50">
              <ul>
                {desktopServicesDropdownItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} legacyBehavior>
                      <a 
                        onClick={handleLinkClick(item.href)}
                        className="flex items-center px-4 py-2 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
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

          <Link href="/paginas/tramites" legacyBehavior>
            <a 
              onClick={handleLinkClick('/paginas/tramites')}
              className={`${baseLinkClass} ${isActive('/paginas/tramites') ? activeClass : inactiveClass}`}
            >
              <FaFileAlt className="mr-2" /> TRÁMITES
            </a>
          </Link>
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
            <Link href="/paginas/tramites" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/tramites', toggleMobileMenu)}
                className={`${baseLinkClass2} ${isActive('/paginas/tramites') ? activeClass : inactiveClass}`}
              >
                <FaFileAlt className="mr-2" /> TRÁMITES
              </a>
            </Link>
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
              {mobileServicesDropdownItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} legacyBehavior>
                    <a 
                      onClick={handleLinkClick(item.href, closeMobileServicesModal)}
                      className="flex items-center px-4 py-2 rounded-md text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
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
    </header>
  );
};

export default Header;
