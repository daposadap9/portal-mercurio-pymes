// components/Header.jsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaHome, 
  FaConciergeBell, 
  FaFileAlt, 
  FaEnvelope, 
  FaSignInAlt, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';
import React, { useState } from 'react';

const Header = ({ handleNavigation, loading }) => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileServicesModalOpen, setMobileServicesModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    if (loading) return; // Bloquea la acción si hay transición
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Para cerrar el modal de servicios en mobile
  const closeMobileServicesModal = () => {
    setMobileServicesModalOpen(false);
  };

  // Determina si el enlace corresponde a la ruta actual
  const isActive = (href) => router.pathname === href;

  // Clase base para los enlaces
  const baseLinkClass =
    "flex items-center font-bold p-2 transition-colors duration-300 ease-in-out transform hover:scale-105";
  const baseLinkClass2 =
    "flex items-center font-bold p-2 transition-colors duration-300 ease-in-out transform hover:scale-100";
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

  // Opciones para el dropdown de Servicios en Desktop
  const desktopServicesDropdownItems = [
    { label: "MERCURIO SGDEA", href: "/paginas/servicios/mercurioSGDEA" },
    { label: "MERCURIO PYMES", href: "/paginas/servicios/mercurioPYMES" },
    { label: "CUSTODIA", href: "/paginas/servicios/mercurioCustodia" },
    { label: "DIGITALIZACIÓN", href: "/paginas/servicios/mercurioDigitalizacion" },
    { label: "SERVICIOS ADICIONALES", href: "/paginas/servicios/serviciosAdicionales" }
  ];

  // Opciones para el menú de Servicios en Mobile (incluye "TODOS LOS PLANES")
  const mobileServicesDropdownItems = [
    { label: "TODOS LOS PLANES", href: "/paginas/servicios" },
    ...desktopServicesDropdownItems
  ];

  return (
    <header className="sticky top-0 w-full bg-slate-100 shadow-lg z-50">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Sección izquierda: Logo */}
        <div className="flex items-center">
          <img 
            src="/logo-servisoft-30years.png" 
            alt="Logo Servisoft" 
            className="w-56" 
          />
        </div>

        {/* Menú para pantallas grandes (desktop) */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link href="/" legacyBehavior>
            <a 
              onClick={handleLinkClick('/')}
              className={`${baseLinkClass} ${isActive('/') ? activeClass : inactiveClass}`}
            >
              <FaHome className="mr-2" /> INICIO
            </a>
          </Link>

          {/* Enlace SERVICIOS con dropdown al hacer hover */}
          <div className="relative group">
            <Link href="/paginas/servicios" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/servicios')}
                className={`${baseLinkClass} ${isActive('/paginas/servicios') ? activeClass : inactiveClass}`}
              >
                <FaConciergeBell className="mr-2" /> SERVICIOS
              </a>
            </Link>
            {/* Dropdown visible al hover */}
            <div className="absolute left-0 top-full mt-0 w-64 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-300 z-50 pointer-events-auto">
              <ul>
                {desktopServicesDropdownItems.map((item, index) => (
                  <li key={index}>
                    <Link href={item.href} legacyBehavior>
                      <a 
                        onClick={handleLinkClick(item.href)}
                        className="block px-4 py-2 text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                      >
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
              <FaFileAlt className="mr-2" /> TRAMITES
            </a>
          </Link>
          <Link href="/paginas/contactanos" legacyBehavior>
            <a 
              onClick={handleLinkClick('/paginas/contactanos')}
              className={`${baseLinkClass} ${isActive('/paginas/contactanos') ? activeClass : inactiveClass}`}
            >
              <FaEnvelope className="mr-2" /> CONTACTENOS
            </a>
          </Link>
        </div>

        {/* Botón de Iniciar Sesión (desktop) */}
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

        {/* Botón de menú móvil (visible en pantallas menores a lg) */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu} 
            className="text-teal-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
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
            {/* Enlace de Servicios en mobile abre el modal */}
            <button 
              onClick={() => {
                setMobileServicesModalOpen(true);
                // Opcional: si deseas cerrar el menú móvil al abrir el modal
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
                <FaFileAlt className="mr-2" /> TRAMITES
              </a>
            </Link>
            <Link href="/paginas/contactanos" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/contactanos', toggleMobileMenu)}
                className={`${baseLinkClass2} ${isActive('/paginas/contactanos') ? activeClass : inactiveClass}`}
              >
                <FaEnvelope className="mr-2" /> CONTACTENOS
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
                      className="block px-4 py-2 rounded-md text-teal-600 hover:bg-teal-600 hover:text-white transition-colors duration-300 text-center"
                    >
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
