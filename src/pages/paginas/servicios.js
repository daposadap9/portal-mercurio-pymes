// pages/paginas/servicios/index.jsx
import React from 'react';
import { useRouter } from 'next/router';
import { FaCheckCircle } from 'react-icons/fa';
import Card from '@/components/Card';
import { useDropdown } from '@/context/DropdownContext';

export default function Servicios({ disabledProvider }) {
  const router = useRouter();
  const { dropdownActive } = useDropdown();
  
  const isAnyDropdownActive = disabledProvider 
    ? false 
    : (dropdownActive.services || dropdownActive.tramites);

  // Datos para las tarjetas
  const cardData1 = {
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
    onViewMore: () => router.push("/paginas/servicios/mercurioSGDEA"),
    borderColorClass: "hover:border-yellow-500",
    titleColorClass: "text-yellow-600",
    iconColorClass: "text-yellow-600",
    viewMoreText: "Descubre más"
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
    onViewMore: () => router.push("/paginas/servicios/mercurioPYMES"),
    borderColorClass: "hover:border-blue-500",
    titleColorClass: "text-blue-600",
    iconColorClass: "text-blue-600",
    viewMoreText: "Descubre más"
  };

  const cardData3 = {
    title: 'CUSTODIA',
    lines: [
      { text: 'Custodiamos desde 1 caja de documentos', icon: <FaCheckCircle /> },
      { text: 'Nuestra custodia te proporciona tranquilidad al saber que tus documentos están en condiciones óptimas y con un manejo totalmente confidencial', icon: <FaCheckCircle /> },
      { text: 'Aprovecha la reducción de costos operativos y de personal, al delegar la gestión de tus archivos físicos en expertos', icon: <FaCheckCircle /> },
    ],
    maxLines: 7,
    onViewMore: () => router.push("/paginas/servicios/mercurioCustodia"),
    additionalButtonText: "Busca tus cajas en nuestro sistema de ODIN",
    additionalButtonHref: "https://odin.servisoft.com.co/",
    borderColorClass: "hover:border-orange-500",
    titleColorClass: "text-orange-600",
    iconColorClass: "text-orange-600",
    viewMoreText: "Descubre más"
  };

  const cardData4 = {
    title: 'DIGITALIZACIÓN',
    lines: [
      { text: 'La digitalización documental no es un gasto, es una inversión en seguridad, accesibilidad y productividad', icon: <FaCheckCircle /> },
      { text: 'Cumple con las normativas legales y protege tu información con copias digitales seguras y respaldadas', icon: <FaCheckCircle /> },
      { text: 'Convierte tu archivo físico en digital y reduce costos operativos mientras mejoras la eficiencia de tu empresa', icon: <FaCheckCircle /> },
    ],
    maxLines: 7,
    onViewMore: () => router.push("/paginas/servicios/mercurioDigitalizacion"),
    badgeText: "¡Oferta recomendada!",
    borderColorClass: "hover:border-red-500",
    titleColorClass: "text-red-600",
    iconColorClass: "text-red-600",
    viewMoreText: "Descubre más"
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
    onViewMore: () => router.push("/paginas/servicios/serviciosAdicionales"),
    badgeText: "¡Oferta recomendada!",
    borderColorClass: "hover:border-green-500",
    titleColorClass: "text-green-700",
    iconColorClass: "text-green-500",
    viewMoreText: "Descubre más"
  };

  return (
    <>
      {/* Título principal */}
      <div
        className={`
          flex justify-center text-2xl md:text-4xl font-bold
          transition-all duration-500 ease-in-out
          ${isAnyDropdownActive ? 'mt-24' : 'mt-0'}
          text-teal-600 text-center titulo-shadow mb-10
        `}
      >
        <h1>¡Nuestros Servicios!</h1>
      </div>

      {/* Contenedor de tarjetas: con flex, wrap, items-center y justify-center */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4 p-2">
        {/* Columna 1 */}
        <div className="max-w-[300px] w-full flex flex-col self-auto md:self-stretch">
          <h2 className={`text-xl font-bold mb-2 text-center ${cardData1.titleColorClass}`}>
            {cardData1.title}
          </h2>
          <div className="flex-1 flex flex-col">
            <Card
              lines={cardData1.lines}
              maxLines={cardData1.maxLines}
              borderColorClass={cardData1.borderColorClass}
              titleColorClass={cardData1.titleColorClass}
              iconColorClass={cardData1.iconColorClass}
              showViewMore
              onViewMore={cardData1.onViewMore}
              viewMoreText={cardData1.viewMoreText}
            />
          </div>
        </div>

        {/* Columna 2 */}
        <div className="max-w-[300px] w-full flex flex-col self-auto md:self-stretch">
          <h2 className={`text-xl font-bold mb-2 text-center ${cardData2.titleColorClass}`}>
            {cardData2.title}
          </h2>
          <div className="flex-1 flex flex-col">
            <Card
              lines={cardData2.lines}
              maxLines={cardData2.maxLines}
              borderColorClass={cardData2.borderColorClass}
              titleColorClass={cardData2.titleColorClass}
              iconColorClass={cardData2.iconColorClass}
              showViewMore
              onViewMore={cardData2.onViewMore}
              viewMoreText={cardData2.viewMoreText}
            />
          </div>
        </div>

        {/* Columna 3 */}
        <div className="max-w-[300px] w-full flex flex-col self-auto md:self-stretch">
          <h2 className={`text-xl font-bold mb-2 text-center ${cardData3.titleColorClass}`}>
            {cardData3.title}
          </h2>
          <div className="flex-1 flex flex-col">
            <Card
              lines={cardData3.lines}
              maxLines={cardData3.maxLines}
              borderColorClass={cardData3.borderColorClass}
              titleColorClass={cardData3.titleColorClass}
              iconColorClass={cardData3.iconColorClass}
              showViewMore
              onViewMore={cardData3.onViewMore}
              viewMoreText={cardData3.viewMoreText}
              additionalButtonText={cardData3.additionalButtonText}
              additionalButtonHref={cardData3.additionalButtonHref}
            />
          </div>
        </div>

        {/* Columna 4 */}
        <div className="max-w-[300px] w-full flex flex-col self-auto md:self-stretch">
          <h2 className={`text-xl font-bold mb-2 text-center ${cardData4.titleColorClass}`}>
            {cardData4.title}
          </h2>
          <div className="flex-1 flex flex-col">
            <Card
              lines={cardData4.lines}
              maxLines={cardData4.maxLines}
              borderColorClass={cardData4.borderColorClass}
              badgeText={cardData4.badgeText}
              titleColorClass={cardData4.titleColorClass}
              iconColorClass={cardData4.iconColorClass}
              showViewMore
              onViewMore={cardData4.onViewMore}
              viewMoreText={cardData4.viewMoreText}
            />
          </div>
        </div>
      </div>

      {/* Sección de Servicios Adicionales */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4 p-2">
        <div className="max-w-[300px] w-full flex flex-col self-auto md:self-stretch">
          <h2 className={`text-xl font-bold mb-2 text-center ${cardData5.titleColorClass}`}>
            {cardData5.title}
          </h2>
          <div className="flex-1 flex flex-col">
            <Card
              lines={cardData5.lines}
              maxLines={cardData5.maxLines}
              borderColorClass={cardData5.borderColorClass}
              badgeText={cardData5.badgeText}
              titleColorClass={cardData5.titleColorClass}
              iconColorClass={cardData5.iconColorClass}
              showViewMore
              onViewMore={cardData5.onViewMore}
              viewMoreText={cardData5.viewMoreText}
            />
          </div>
        </div>
      </div>
    </>
  );
}
