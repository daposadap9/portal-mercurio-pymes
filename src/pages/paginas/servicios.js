import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { 
  FaBoxes, FaBoxOpen, FaChartLine, FaDatabase, FaFileAlt, 
  FaGavel, FaHandshake, FaHdd, FaLock, FaMoneyBillWave, 
  FaRobot, FaSearch, FaShieldAlt, FaTrashAlt, FaTruck, FaInstagram 
} from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useDropdown } from '@/context/DropdownContext';

export default function Servicios() {
  const router = useRouter();
  const { dropdownActive } = useDropdown();
  
  // Eliminar el estado local y usar directamente el contexto
  const isAnyDropdownActive = dropdownActive.services || dropdownActive.tramites;

  // Datos para las tarjetas
  const cardData = {
    title: 'MERCURIO SGDEA',
    lines: [
      { text: 'Reduzca hasta un 80% el tiempo en búsqueda de documentos con Mercurio', icon: <FaSearch /> },
      { text: 'Seguridad y acceso inmediato a tu información con Mercurio', icon: <FaLock /> },
      { text: 'Digitaliza, automatiza y gestiona sin complicaciones. Mercurio lo hace por ti', icon: <FaRobot /> },
    ],
    maxLines: 7,
  };

  const cardData2 = {
    title: 'MERCURIO PYMES',
    lines: [
      { text: 'Optimiza los procesos de tu empresa con documentos digitales de fácil acceso y búsqueda rápida, digitaliza hoy y trabaja con más eficiencia', icon: <FaFileAlt /> },
      { text: 'Ahorra costos y gana productividad con Mercurio, el futuro de la gestión documental', icon: <FaMoneyBillWave /> },
      { text: 'Dile adiós al papeleo y bienvenido a la eficiencia con Mercurio', icon: <FaTrashAlt /> },
    ],
    maxLines: 7,
  };

  const cardData3 = {
    title: 'CUSTODIA',
    lines: [
      { text: 'Custodiamos desde 1 caja de documentos', icon: <FaBoxOpen /> },
      { text: 'Nuestra custodia te proporciona tranquilidad al saber que tus documentos están en condiciones óptimas y con un manejo totalmente confidencial', icon: <FaShieldAlt /> },
      { text: 'Aprovecha la reducción de costos operativos y de personal, al delegar la gestión de tus archivos físicos en expertos', icon: <FaHandshake /> },
    ],
    maxLines: 7,
  };

  const cardData4 = {
    title: 'DIGITALIZACIÓN',
    lines: [
      { text: 'La digitalización documental no es un gasto, es una inversión en seguridad, accesibilidad y productividad', icon: <FaChartLine /> },
      { text: 'Cumple con las normativas legales y protege tu información con copias digitales seguras y respaldadas', icon: <FaGavel /> },
      { text: 'Convierte tu archivo físico en digital y reduce costos operativos mientras mejoras la eficiencia de tu empresa', icon: <FaFileAlt /> },
    ],
    maxLines: 7,
  };

  const cardData5 = {
    title: 'SERVICIOS ADICIONALES',
    lines: [
      { text: 'Transporte de máx 50 cajas x300', icon: <FaTruck /> },
      { text: 'Cajas x300', icon: <FaBoxes /> },
      { text: 'Consultas digitales hasta 5 folios', icon: <FaFileAlt /> },
      { text: '1TB de almacenamiento', icon: <FaHdd /> },
      { text: '100 GB de almacenamiento', icon: <FaDatabase /> },
    ],
    maxLines: 7,
  };

  const cardData6 = {
    title: 'PLAN LITE',
    lines: [
      { text: 'COP 2.000.000', color: 'text-blue-500', textSize: 'text-2xl' },
      { text: 'Mercurio lite premium', color: 'text-black' },
      { text: 'Mercurio lite premium', color: 'text-black' },
    ],
    maxLines: 7,
  };

  const cardData7 = {
    title: 'PLAN GOLD',
    lines: [
      { text: 'COP 2.000.000', color: 'text-yellow-600', textSize: 'text-2xl' },
      { text: 'Mercurio gold premium', color: 'text-black' },
      { text: 'Mercurio gold premium', color: 'text-black' },
    ],
    maxLines: 7,
  };

  const cardData8 = {
    title: '¡CREA TU PLAN!',
    lines: [
      { text: 'COP 2.000.000', color: 'text-orange-500', textSize: 'text-2xl' },
      { text: 'Mercurio premium', color: 'text-black' },
      { text: 'Mercurio premium', color: 'text-black' },
    ],
    maxLines: 7,
  };

  return (
    <>
      {/* Título principal: se aplica mt-24 si isDropdownActive es true */}
      <div className={`flex justify-center text-2xl md:text-4xl font-bold ${isAnyDropdownActive ? "mt-24" : ""} text-teal-600 text-center titulo-shadow`}>
        <h1>¡Cotiza tu servicio!</h1>
      </div>

      {/* Contenedor de servicios */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4 p-2">
        <Card 
          title={cardData.title} 
          lines={cardData.lines} 
          maxLines={cardData.maxLines}
          borderColorClass="hover:border-yellow-500"  
          titleColorClass="text-yellow-600"
          iconColorClass="text-yellow-600"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/mercurioSGDEA")}
          viewMoreText="Descubre más"                
        />
        <Card 
          title={cardData2.title} 
          lines={cardData2.lines} 
          maxLines={cardData2.maxLines}
          borderColorClass="hover:border-blue-500"
          titleColorClass="text-blue-600"
          iconColorClass="text-blue-600"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/mercurioPYMES")}
          viewMoreText="Descubre más"
        />
        <Card 
          title={cardData3.title} 
          lines={cardData3.lines} 
          maxLines={cardData3.maxLines} 
          borderColorClass="hover:border-orange-500"
          titleColorClass="text-orange-600"
          iconColorClass="text-orange-600"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/mercurioCustodia")}
          viewMoreText="Descubre más"
        />
        <Card 
          title={cardData4.title} 
          lines={cardData4.lines} 
          maxLines={cardData4.maxLines}
          borderColorClass="hover:border-red-500"
          badgeText="¡Oferta recomendada!"
          titleColorClass="text-red-600"
          iconColorClass="text-red-600"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/mercurioDigitalizacion")}
          viewMoreText="Descubre más"
        />
      </div>

      <div className="flex justify-center pt-10 text-2xl md:text-4xl font-bold text-teal-600 text-center titulo-shadow">
        <h1>¡Nuestros paquetes!</h1>
      </div>
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4">
        <Card 
          title={cardData6.title} 
          lines={cardData6.lines} 
          maxLines={cardData6.maxLines}
          borderColorClass="hover:border-blue-500"
          titleColorClass="text-blue-600"
          iconColorClass="text-blue-600"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/PaymentFormPSE")}
          viewMoreText="¡Adquiérelo ahora!"
        />
        <Card 
          title={cardData7.title}
          lines={cardData7.lines} 
          maxLines={cardData7.maxLines}
          borderColorClass="hover:border-yellow-500"  
          titleColorClass="text-yellow-600"
          iconColorClass="text-yellow-600"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/PaymentFormPSE")}
          viewMoreText="¡Adquiérelo ahora!"
          badgeText="¡Oferta recomendada!"
        />
        <Card 
          title={cardData8.title} 
          lines={cardData8.lines} 
          maxLines={cardData8.maxLines}
          borderColorClass="hover:border-orange-500"
          titleColorClass="text-orange-600"
          iconColorClass="text-orange-600"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/formularioArmaTuPlan")}
          viewMoreText="¡Adquiérelo ahora!"
        />
      </div>
      
      <div className="flex justify-center pt-10 text-2xl md:text-4xl font-bold text-teal-600 text-center titulo-shadow">
        <h1>Servicios Adicionales</h1>
      </div>
      
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4">
        <Card 
          title="SERVICIOS ADICIONALES"
          lines={[
            { text: 'Transporte de máx 50 cajas x300', icon: <FaTruck /> },
            { text: 'Cajas x300', icon: <FaBoxes /> },
            { text: 'Consultas digitales hasta 5 folios', icon: <FaFileAlt /> },
            { text: '1TB de almacenamiento', icon: <FaHdd /> },
            { text: '100 GB de almacenamiento', icon: <FaDatabase /> }
          ]}
          maxLines={7}
          borderColorClass="hover:border-green-500"
          badgeText="¡Oferta recomendada!"
          titleColorClass="text-green-700"
          iconColorClass="text-green-500"
          showViewMore={true}
          onViewMore={() => alert('¡Mostrando más detalles!')}
          viewMoreText="Descubre más"
        />
      </div>
    </>
  );
}
