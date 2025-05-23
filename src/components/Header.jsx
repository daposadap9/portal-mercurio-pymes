import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
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
  FaInfoCircle,
  FaPalette,
  FaDollarSign,
  FaBoxOpen,
} from "react-icons/fa";
import { useDropdown } from "@/context/DropdownContext";
import { ThemeContext } from "@/context/ThemeContext";

const Header = ({ handleNavigation, loading }) => {
  const router = useRouter();
  const { setDropdownActive } = useDropdown();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobileServicesModalOpen, setMobileServicesModalOpen] =
    useState(false);
  const [isMobileTramitesModalOpen, setMobileTramitesModalOpen] =
    useState(false);

  // Estados para controlar los dropdowns en Desktop mediante hover
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const [showTramitesDropdown, setShowTramitesDropdown] = useState(false);

  const actualizarDropdown = (nuevoEstado) => {
    setDropdownActive((prev) => ({ ...prev, ...nuevoEstado }));
  };

  useEffect(() => {
    actualizarDropdown({ services: showServicesDropdown });
  }, [showServicesDropdown]);

  useEffect(() => {
    actualizarDropdown({ tramites: showTramitesDropdown });
  }, [showTramitesDropdown]);

  const toggleMobileMenu = () => {
    if (loading) return;
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileServicesModal = () => {
    setMobileServicesModalOpen(false);
  };

  const { theme, setTheme } = useContext(ThemeContext);

  // Alterna temas: light -> purple -> dark -> light...
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("purple");
    } else if (theme === "purple") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const logoSrc =
    theme === "dark" || theme === "purple"
      ? "/logo-servisoft-30years-dark.png"
      : "/logo-servisoft-30years-dark.png";

  const logoStyle =
    theme === "dark" || theme === "purple" ? { transform: "scale(2.7)" } : {transform: "scale(2.7)"};

  // Opciones para el dropdown de SERVICIOS en Desktop
  const desktopServicesDropdownItems = [
    {
      label: "MERCURIO SGDEA",
      href: "/paginas/servicios/mercurioSGDEA",
      icon: <FaSearch className="mr-2" />,
    },
    {
      label: "MERCURIO PYMES",
      href: "/paginas/servicios/mercurioPYMES",
      icon: <FaFileAlt className="mr-2" />,
    },
    {
      label: "CUSTODIA",
      href: "/paginas/servicios/mercurioCustodia",
      icon: <FaShieldAlt className="mr-2" />,
    },
    {
      label: "DIGITALIZACIÓN",
      href: "/paginas/servicios/mercurioDigitalizacion",
      icon: <FaGavel className="mr-2" />,
    },
    {
      label: "SERVICIOS ADICIONALES",
      href: "/paginas/servicios/serviciosAdicionales",
      icon: <FaBoxes className="mr-2" />,
    },
  ];

  // Opciones para el menú de SERVICIOS en Mobile
  const mobileServicesDropdownItems = [
    {
      label: "TODOS LOS PLANES",
      href: "/paginas/servicios",
      icon: <FaAngleRight className="mr-2" />,
    },
    ...desktopServicesDropdownItems.map((item) => ({
      ...item,
      icon: <FaAngleRight className="mr-2" />,
    })),
  ];

  // Opciones para el dropdown de TRÁMITES en Desktop
  const desktopTramitesDropdownItems = [
    {
      label: "PQRSDF",
      href: "/paginas/tramites/pqrsdf",
      icon: <FaCommentAlt className="mr-2" />,
    },
    {
      label: "SOLICITUDES MERCURIO CLIENTES",
      href: "/paginas/tramites/solicitudesMercurio",
      icon: <FaListAlt className="mr-2" />,
    },
    {
      label: "CONSULTA ESTADO DE SOLICITUD",
      href: "/paginas/tramites/estadoSolicitud",
      icon: <FaInfoCircle className="mr-2" />,
    },
    { 
      label: "IR A ODIN", 
      href: "https://odin.servisoft.com.co/", 
      icon: <FaBoxOpen className="mr-2" />, 
      target: "_blank", 
      rel: "noopener noreferrer" 
    },    
  ];

  // Opciones para el menú de TRÁMITES en Mobile
  const mobileTramitesDropdownItems = [
    {
      label: "TODOS LOS TRÁMITES",
      href: "/paginas/tramites",
      icon: <FaAngleRight className="mr-2" />,
    },
    ...desktopTramitesDropdownItems.map((item) => ({
      ...item,
      icon: <FaAngleRight className="mr-2" />,
    })),
  ];

  const isActive = (href) => router.pathname === href;

  const baseLinkClass =
    "flex items-center font-semibold p-1 transition-transform duration-300 ease-in-out";
  const baseLinkClass2 =
    "flex items-center font-semibold p-1 transition-colors duration-300 ease-in-out";
  const activeLinkClass = "bg-teal-600 text-white rounded";
  const inactiveLinkClass = "hover:bg-teal-100 hover:text-teal-600 rounded";

  // Manejador genérico para enlaces (SERVICIOS, CONTACTENOS, etc.)
  const handleLinkClick = (href, callback) => (e) => {
    e.preventDefault();
    if (loading) return;
    if (callback) callback();
    if (handleNavigation) {
      handleNavigation(href);
    } else {
      router.push(href);
    }
  };

  // Manejador para TRÁMITES con retraso para permitir la transición
  const handleTramitesClick = (href, callback) => (e) => {
    e.preventDefault();
    if (loading) return;
    if (callback) callback();
    setShowTramitesDropdown(false);
    if (handleNavigation) {
      handleNavigation(href);
    } else {
      setTimeout(() => {
        router.push(href);
      }, 1100);
    }
  };

  const filteredMobileServicesItems = mobileServicesDropdownItems.filter(
    (item) =>
      !(
        item.label === "TODOS LOS PLANES" &&
        router.pathname === "/paginas/servicios"
      )
  );

  const filteredMobileTramitesItems = mobileTramitesDropdownItems.filter(
    (item) =>
      !(
        item.label === "TODOS LOS TRÁMITES" &&
        router.pathname === "/paginas/tramites"
      )
  );

  return (
    // Se aplica la clase "header-custom" para que los colores (background y texto) sean personalizabless
    <header
      className="sticky top-0 w-full border-b border-teal-100 z-50 h-14 shadow-lg header-custom transition-colors duration-500"
    >
      <nav className="max-w-7xl mx-auto px-4 h-full flex justify-between items-center relative">
        {/* Logo */}
        <div
          className="flex items-center"
          style={{ minWidth: "180px", height: "100%" }}
        >
          <div className="w-48 h-full overflow-hidden relative">
            <Link href="/" legacyBehavior>
              <a onClick={handleLinkClick("/")}>
                <Image
                  src={logoSrc}
                  alt="Logo Servisoft"
                  layout="fill"
                  objectFit="contain"
                  priority
                  style={logoStyle}
                />
              </a>
            </Link>
          </div>
        </div>

        {/* Menú Desktop */}
        <div className="hidden lg:flex space-x-4 items-center">
          <Link href="/" legacyBehavior>
            <a
              onClick={handleLinkClick("/")}
              className={`${baseLinkClass} ${
                isActive("/") ? activeLinkClass : inactiveLinkClass
              } text-sm`}
            >
              <FaHome className="mr-1 text-base" /> INICIO
            </a>
          </Link>

          {/* Dropdown de SERVICIOS */}
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowServicesDropdown(true)}
            onMouseLeave={() => setShowServicesDropdown(false)}
          >
            <Link href="/paginas/servicios" legacyBehavior>
              <a
                onClick={handleLinkClick("/paginas/servicios")}
                className={`${baseLinkClass} ${
                  isActive("/paginas/servicios")
                    ? activeLinkClass
                    : inactiveLinkClass
                } text-sm`}
              >
                <FaConciergeBell className="mr-1 text-base" /> SERVICIOS
              </a>
            </Link>
            {showServicesDropdown && (
              <div className="absolute left-0 top-full w-64 bg-white shadow rounded border border-teal-50 transition-opacity duration-300 ease-in-out opacity-100 z-50">
                <ul>
                  {desktopServicesDropdownItems.map((item, index) => (
                    <li key={index}>
                      <Link href={item.href} legacyBehavior>
                        <a
                          onClick={handleLinkClick(item.href)}
                          className="flex items-center justify-start text-left px-3 py-1 text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-sm"
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

          {/* Opción: ¡COTIZA TU SERVICIO! */}
          <Link href="/paginas/cotizaTuServicio" legacyBehavior>
            <a
              onClick={handleLinkClick("/paginas/cotizaTuServicio")}
              className={`${baseLinkClass} ${
                isActive("/paginas/cotizaTuServicio")
                  ? activeLinkClass
                  : inactiveLinkClass
              } text-sm`}
            >
              <FaDollarSign className="mr-1 text-base" /> ¡COTIZA TU SERVICIO!
            </a>
          </Link>


          {/* Dropdown de TRÁMITES */}
          <div
            className="relative inline-block"
            onMouseEnter={() => setShowTramitesDropdown(true)}
            onMouseLeave={() => setShowTramitesDropdown(false)}
          >
            <Link href="/paginas/tramites" legacyBehavior>
              <a
                onClick={handleTramitesClick("/paginas/tramites")}
                className={`${baseLinkClass} ${
                  isActive("/paginas/tramites")
                    ? activeLinkClass
                    : inactiveLinkClass
                } text-sm`}
              >
                <FaFileAlt className="mr-1 text-base" /> TRÁMITES
              </a>
            </Link>
            {showTramitesDropdown && (
              <div className="absolute left-0 top-full w-64 bg-white shadow rounded border border-teal-50 transition-opacity duration-300 ease-in-out opacity-100 z-50">
                <ul>
                {desktopTramitesDropdownItems.map((item, index) => (
  <li key={index}>
    {item.target ? (
      // enlace externo, abre en pestaña nueva
      <a
        href={item.href}
        target={item.target}
        rel={item.rel}
        className="flex items-center justify-start px-3 py-1 text-teal-600 hover:bg-teal-100 hover:text-teal-700 text-sm"
      >
        {item.icon}
        {item.label}
      </a>
    ) : (
      // enlace interno
      <Link href={item.href} legacyBehavior>
        <a
          onClick={handleLinkClick(item.href)}
          className="flex items-center justify-start px-3 py-1 text-teal-600 hover:bg-teal-100 hover:text-teal-700 text-sm"
        >
          {item.icon}
          {item.label}
        </a>
      </Link>
    )}
  </li>
))}
                </ul>
              </div>
            )}
          </div>

          <Link href="/paginas/contactanos" legacyBehavior>
            <a
              onClick={handleLinkClick("/paginas/contactanos")}
              className={`${baseLinkClass} ${
                isActive("/paginas/contactanos")
                  ? activeLinkClass
                  : inactiveLinkClass
              } text-sm`}
            >
              <FaEnvelope className="mr-1 text-base" /> CONTÁCTENOS
            </a>
          </Link>
        </div>

        {/* Botón Ingresar (Desktop) */}
        <div className="hidden lg:flex items-center">
          <Link href="/paginas/login" legacyBehavior>
            <a
              onClick={handleLinkClick("/paginas/login")}
              className={`${baseLinkClass} ${
                isActive("/paginas/login")
                  ? activeLinkClass
                  : "bg-teal-600 text-white hover:bg-teal-700"
              } rounded text-sm`}
            >
              <FaSignInAlt className="mr-1 text-base" /> INGRESAR
            </a>
          </Link>
        </div>

        {/* Selector de tema (Desktop) */}
        <div className="hidden lg:flex items-center">
          <FaPalette className="mr-1 text-base text-teal-600" />
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="p-1 rounded text-sm bg-white text-teal-600 border border-white"
          >
            <option value="light">Light</option>
            <option value="purple">Dark blue</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Menú móvil */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-teal-600 transition-transform duration-300 ease-in-out hover:scale-105"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow border-t border-teal-50 z-50">
          <div className="flex flex-col space-y-1 px-3 py-2">
            <Link href="/" legacyBehavior>
              <a
                onClick={handleLinkClick("/", () => setMobileMenuOpen(false))}
                className={`${baseLinkClass2} ${
                  isActive("/") ? activeLinkClass : inactiveLinkClass
                } text-sm text-teal-600`}
              >
                <FaHome className="mr-1 text-base" /> INICIO
              </a>
            </Link>
            <button
              onClick={() => {
                setMobileServicesModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`${baseLinkClass2} text-left ${
                isActive("/paginas/servicios")
                  ? activeLinkClass
                  : inactiveLinkClass
              } text-sm text-teal-600`}
            >
              <FaConciergeBell className="mr-1 text-base" /> SERVICIOS
            </button>
            <Link href="/paginas/cotizaTuServicio" legacyBehavior>
              <a
                onClick={handleLinkClick("/paginas/cotizaTuServicio", () =>
                  setMobileMenuOpen(false)
                )}
                className={`${baseLinkClass2} ${
                  isActive("/paginas/cotizaTuServicio")
                    ? activeLinkClass
                    : inactiveLinkClass
                } text-sm text-teal-600`}
              >
                <FaDollarSign className="mr-1 text-base" /> ¡COTIZA TU SERVICIO!
              </a>
            </Link>
            <button
              onClick={() => {
                setMobileTramitesModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className={`${baseLinkClass2} text-left ${
                isActive("/paginas/tramites")
                  ? activeLinkClass
                  : inactiveLinkClass
              } text-sm text-teal-600`}
            >
              <FaFileAlt className="mr-1 text-base" /> TRÁMITES
            </button>
            <Link href="/paginas/contactanos" legacyBehavior>
              <a
                onClick={handleLinkClick("/paginas/contactanos", () =>
                  setMobileMenuOpen(false)
                )}
                className={`${baseLinkClass2} ${
                  isActive("/paginas/contactanos")
                    ? activeLinkClass
                    : inactiveLinkClass
                } text-sm text-teal-600`}
              >
                <FaEnvelope className="mr-1 text-base text-teal-600" /> CONTÁCTENOS
              </a>
            </Link>
            <Link href="/paginas/login" legacyBehavior>
              <a
                onClick={handleLinkClick("/paginas/login", () =>
                  setMobileMenuOpen(false)
                )}
                className={`${baseLinkClass2} ${
                  isActive("/paginas/login")
                    ? activeLinkClass
                    : inactiveLinkClass
                } rounded text-sm text-teal-600`}
              >
                <FaSignInAlt className="mr-1 text-base" /> INGRESAR
              </a>
            </Link>
            <div className="mt-2 flex items-center">
              <FaPalette className="mr-1 text-base text-teal-600" />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="p-1 rounded text-sm bg-white text-teal-600 border border-teal-100 w-full"
              >
                <option value="light">Light</option>
                <option value="purple">Dark blue</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Servicios en Mobile */}
      {isMobileServicesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow w-11/12 max-w-md p-4 relative animate-fadeIn border border-teal-50">
            <button
              onClick={() => setMobileServicesModalOpen(false)}
              className="absolute top-2 right-2 text-teal-600 hover:text-teal-700 transition-colors duration-300"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-600 mb-3 text-center">
              SERVICIOS
            </h2>
            <ul className="space-y-1">
              {filteredMobileServicesItems.map((item, index) => (
                <li key={index}>
                  <Link href={item.href} legacyBehavior>
                    <a
                      onClick={handleLinkClick(item.href, () =>
                        setMobileServicesModalOpen(false)
                      )}
                      className="flex items-center justify-start text-left px-3 py-1 rounded text-teal-600 hover:bg-teal-100 hover:text-teal-700 transition-colors duration-300 text-sm"
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
          <div className="bg-white rounded shadow w-11/12 max-w-md p-4 relative animate-fadeIn border border-teal-50">
            <button
              onClick={() => setMobileTramitesModalOpen(false)}
              className="absolute top-2 right-2 text-teal-600 hover:text-teal-700 transition-colors duration-300"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold text-teal-600 mb-3 text-center">
              TRÁMITES
            </h2>
            <ul className="space-y-1">
            {filteredMobileTramitesItems.map((item, index) => (
  <li key={index}>
    {item.target ? (
      <a
        href={item.href}
        target={item.target}
        rel={item.rel}
        className="flex items-center justify-start px-3 py-1 text-teal-600 hover:bg-teal-100 hover:text-teal-700 text-sm"
      >
        {item.icon}
        {item.label}
      </a>
    ) : (
      <Link href={item.href} legacyBehavior>
        <a onClick={() => setMobileTramitesModalOpen(false)} className="flex items-center justify-start px-3 py-1 text-teal-600 hover:bg-teal-100 hover:text-teal-700 text-sm">
          {item.icon}
          {item.label}
        </a>
      </Link>
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
