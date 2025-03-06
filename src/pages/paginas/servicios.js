import React, { useState, useEffect } from 'react';
import Card from '@/components/Card';
import { FaCheckCircle } from 'react-icons/fa'; // Icono de viñeta general
import { useRouter } from 'next/router';
import { useDropdown } from '@/context/DropdownContext';

export default function Servicios({disabledProvider }) {
  const router = useRouter();
  const { dropdownActive } = useDropdown();
  
  // Eliminar el estado local y usar directamente el contexto
  const isAnyDropdownActive = disabledProvider ? false : (dropdownActive.services || dropdownActive.tramites);

  // Datos para las tarjetas
  const cardData = {
    title: 'MERCURIO SGDEA',
    lines: [
      { text: 'Radicación y gestión de correspondencia electrónica (R-I-E-N)', icon: <FaCheckCircle /> },
      { text: 'Rutas Documentales (WorkFlow - BPM)', icon: <FaCheckCircle /> },
      { text: 'Tablas de retención documental', icon: <FaCheckCircle /> },
      { text: 'Expedientes Electrónicos', icon: <FaCheckCircle /> },
      { text: 'Robot de notificación y radicación de correos', icon: <FaCheckCircle /> },
      { text: 'Firmas digitales y digitalizadas', icon: <FaCheckCircle /> },
      { text: 'Puntos de integración (+25 Web services Publicados)', icon: <FaCheckCircle /> },
    ],
    maxLines: 7,
  };

  const cardData2 = {
    title: 'MERCURIO PYMES',
    lines: [
      { text: 'Radicación y recepción de documentos.', icon: <FaCheckCircle /> },
      { text: 'Flujo estándar de aprobación de facturas.', icon: <FaCheckCircle /> },
      { text: 'Flujo estándar de PQRS', icon: <FaCheckCircle /> },
      { text: 'Control de documentos.', icon: <FaCheckCircle /> },
    ],
    maxLines: 7,
  };

  const cardData3 = {
    title: 'CUSTODIA',
    lines: [
      { text: 'Custodiamos desde 1 caja de documentos', icon: <FaCheckCircle /> },
      { text: 'Nuestra custodia te proporciona tranquilidad al saber que tus documentos están en condiciones óptimas y con un manejo totalmente confidencial', icon: <FaCheckCircle /> },
      { text: 'Aprovecha la reducción de costos operativos y de personal, al delegar la gestión de tus archivos físicos en expertos', icon: <FaCheckCircle /> },
    ],
    maxLines: 7,
  };

  const cardData4 = {
    title: 'DIGITALIZACIÓN',
    lines: [
      { text: 'La digitalización documental no es un gasto, es una inversión en seguridad, accesibilidad y productividad', icon: <FaCheckCircle /> },
      { text: 'Cumple con las normativas legales y protege tu información con copias digitales seguras y respaldadas', icon: <FaCheckCircle /> },
      { text: 'Convierte tu archivo físico en digital y reduce costos operativos mientras mejoras la eficiencia de tu empresa', icon: <FaCheckCircle /> },
    ],
    maxLines: 7,
  };

  const cardData5 = {
    title: 'SERVICIOS ADICIONALES',
    lines: [
      { text: 'Transporte de máx 50 cajas x300', icon: <FaCheckCircle /> },
      { text: 'Cajas x300', icon: <FaCheckCircle /> },
      { text: 'Consultas digitales hasta 5 folios', icon: <FaCheckCircle /> },
      { text: '1TB de almacenamiento', icon: <FaCheckCircle /> },
      { text: '100 GB de almacenamiento', icon: <FaCheckCircle /> },
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
      <div className={`flex justify-center text-2xl md:text-4xl font-bold transition-all duration-500 ease-in-out ${isAnyDropdownActive ? "mt-24" : "mt-0"} text-teal-600 text-center titulo-shadow`}>
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
          additionalButtonText="Busca tus cajas en nuestro sistema de odin"
          additionalButtonHref="https://odin.servisoft.com.co/"
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
        <h1>Servicios Adicionales</h1>
      </div>
      
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4">
        <Card 
          title="SERVICIOS ADICIONALES"
          lines={[
            { text: 'Transporte de máx 50 cajas x300', icon: <FaCheckCircle /> },
            { text: 'Cajas x300', icon: <FaCheckCircle /> },
            { text: 'Consultas digitales hasta 5 folios', icon: <FaCheckCircle /> },
            { text: '1TB de almacenamiento', icon: <FaCheckCircle /> },
            { text: '100 GB de almacenamiento', icon: <FaCheckCircle /> }
          ]}
          maxLines={7}
          borderColorClass="hover:border-green-500"
          badgeText="¡Oferta recomendada!"
          titleColorClass="text-green-700"
          iconColorClass="text-green-500"
          showViewMore={true}
          onViewMore={() => router.push("/paginas/servicios/serviciosAdicionales")}
          viewMoreText="Descubre más"
        />
      </div>
    </>
  );
}
