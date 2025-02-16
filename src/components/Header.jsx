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

  const toggleMobileMenu = () => {
    if (loading) return; // Bloquea la acción si se está en transición
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  // Función para determinar si el enlace es la ruta actual
  const isActive = (href) => router.pathname === href;

  // Clase base para los enlaces de desktop
  const baseLinkClass =
    "flex items-center font-bold p-2 transition-colors duration-300 ease-in-out transform hover:scale-105";

  const activeClass = "bg-teal-600 text-white rounded-md";
  const inactiveClass = "text-teal-600 hover:bg-teal-600 hover:text-white hover:rounded-md";

  // Función que intercepta el clic y bloquea la navegación si loading es true o si ya está en la misma página
  const handleLinkClick = (href, callback) => (e) => {
    e.preventDefault();

    // Si ya estamos en la misma ruta, no ejecutamos la transición
    if (isActive(href)) return;

    if (loading) return; // Si ya se está ejecutando una animación, no hace nada
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
        {/* Sección izquierda: Logo */}
        <div className="flex items-center">
          <img 
            src="/logo-servisoft-30years.png" 
            alt="Logo Servisoft" 
            className="w-56" 
          />
        </div>

        {/* Menú para pantallas grandes (lg) */}
        <div className="hidden lg:flex space-x-6">
          <Link href="/" legacyBehavior>
            <a 
              onClick={handleLinkClick('/')}
              className={`${baseLinkClass} ${isActive('/') ? activeClass : inactiveClass}`}
            >
              <FaHome className="mr-2" /> INICIO
            </a>
          </Link>
          {/* Modificado: Acceder a /paginas/index2 */}
          <Link href="/paginas/servicios" legacyBehavior>
            <a 
              onClick={handleLinkClick('/paginas/servicios')}
              className={`${baseLinkClass} ${isActive('/paginas/servicios') ? activeClass : inactiveClass}`}
            >
              <FaConciergeBell className="mr-2" /> SERVICIOS
            </a>
          </Link>
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

        {/* Botón de Iniciar Sesión para pantallas grandes (lg) */}
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

        {/* Botón de menú móvil (visible para pantallas menores a lg) */}
        <div className="lg:hidden flex items-center">
          <button 
            onClick={toggleMobileMenu} 
            className="text-teal-600 transition-colors duration-300 ease-in-out transform hover:scale-105"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil: visible solo en pantallas menores a lg */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-slate-100 shadow-md">
          <div className="flex flex-col space-y-2 px-4 py-3">
            <Link href="/" legacyBehavior>
              <a 
                onClick={handleLinkClick('/', toggleMobileMenu)}
                className={`${baseLinkClass} ${isActive('/') ? activeClass : inactiveClass}`}
              >
                <FaHome className="mr-2" /> INICIO
              </a>
            </Link>
            <Link href="/paginas/servicios" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/servicios', toggleMobileMenu)}
                className={`${baseLinkClass} ${isActive('/paginas/servicios') ? activeClass : inactiveClass}`}
              >
                <FaConciergeBell className="mr-2" /> SERVICIOS
              </a>
            </Link>
            <Link href="/paginas/tramites" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/tramites', toggleMobileMenu)}
                className={`${baseLinkClass} ${isActive('/paginas/tramites') ? activeClass : inactiveClass}`}
              >
                <FaFileAlt className="mr-2" /> TRAMITES
              </a>
            </Link>
            <Link href="/paginas/contactanos" legacyBehavior>
              <a 
                onClick={handleLinkClick('/paginas/contactanos', toggleMobileMenu)}
                className={`${baseLinkClass} ${isActive('/paginas/contactanos') ? activeClass : inactiveClass}`}
              >
                <FaEnvelope className="mr-2" /> CONTACTENOS
              </a>
            </Link>
            <Link href="/login" legacyBehavior>
              <a 
                onClick={handleLinkClick('/login', toggleMobileMenu)}
                className={`${baseLinkClass} ${isActive('/paginas/login') ? activeClass : "text-teal-600 hover:bg-teal-600 hover:text-white hover:rounded-md"}`}
              >
                <FaSignInAlt className="mr-2" /> INGRESAR
              </a>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
