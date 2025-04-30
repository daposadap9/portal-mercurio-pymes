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

  // Datos para las tarjetas, agregando imageSrc & imageAlt
  const cardData1 = {
    title: 'MERCURIO SGDEA',
    imageSrc: '/sgdea.png',
    imageAlt: 'Mercurio SGDEA',
    lines: [
      { text: 'Radicación y gestión de correspondencia electrónica (R-I-E-N)', icon: <FaCheckCircle /> },
      { text: 'Rutas Documentales (WorkFlow - BPM)', icon: <FaCheckCircle /> },
      { text: 'Tablas de retención documental', icon: <FaCheckCircle /> },
      { text: 'Expedientes Electrónicos', icon: <FaCheckCircle /> },
      { text: 'Robot de notificación y radicación de correos', icon: <FaCheckCircle /> },
      { text: 'Firmas digitales y digitalizadas', icon: <FaCheckCircle /> },
      { text: 'Puntos de integración (+25 Web services Publicados)', icon: <FaCheckCircle /> },
    ],
    onViewMore: () => router.push("/paginas/servicios/mercurioSGDEA"),
    borderColorClass: "hover:border-yellow-500",
    titleColorClass: "text-yellow-600",
    iconColorClass: "text-yellow-600",
    viewMoreText: "Descubre más"
  };

  const cardData2 = {
    title: 'MERCURIO PYMES',
    imageSrc: '/pymes.png',
    imageAlt: 'Mercurio PYMES',
    lines: [
      { text: 'Radicación y recepción de documentos.', icon: <FaCheckCircle /> },
      { text: 'Flujo estándar de aprobación de facturas.', icon: <FaCheckCircle /> },
      { text: 'Flujo estándar de PQRS', icon: <FaCheckCircle /> },
      { text: 'Control de documentos.', icon: <FaCheckCircle /> },
    ],
    onViewMore: () => router.push("/paginas/servicios/mercurioPYMES"),
    borderColorClass: "hover:border-blue-500",
    titleColorClass: "text-blue-600",
    iconColorClass: "text-blue-600",
    viewMoreText: "Descubre más"
  };

  const cardData3 = {
    title: 'CUSTODIA',
    imageSrc: '/custodia.png',
    imageAlt: 'Custodia de documentos',
    lines: [
      { text: 'Custodiamos desde 1 caja de documentos', icon: <FaCheckCircle /> },
      { text: 'Nuestra custodia te proporciona tranquilidad al saber que tus documentos están en condiciones óptimas y con un manejo totalmente confidencial', icon: <FaCheckCircle /> },
      { text: 'Aprovecha la reducción de costos operativos y de personal, al delegar la gestión de tus archivos físicos en expertos', icon: <FaCheckCircle /> },
    ],
    onViewMore: () => router.push("/paginas/servicios/mercurioCustodia"),
    borderColorClass: "hover:border-orange-500",
    titleColorClass: "text-orange-600",
    iconColorClass: "text-orange-600",
    viewMoreText: "Descubre más"
  };

  const cardData4 = {
    title: 'DIGITALIZACIÓN',
    imageSrc: '/digitalizacion.png',
    imageAlt: 'Digitalización documental',
    lines: [
      { text: 'La digitalización documental no es un gasto, es una inversión en seguridad, accesibilidad y productividad', icon: <FaCheckCircle /> },
      { text: 'Cumple con las normativas legales y protege tu información con copias digitales seguras y respaldadas', icon: <FaCheckCircle /> },
      { text: 'Convierte tu archivo físico en digital y reduce costos operativos mientras mejoras la eficiencia de tu empresa', icon: <FaCheckCircle /> },
    ],
    badgeText: "¡Oferta recomendada!",
    onViewMore: () => router.push("/paginas/servicios/mercurioDigitalizacion"),
    borderColorClass: "hover:border-red-500",
    titleColorClass: "text-red-600",
    iconColorClass: "text-red-600",
    viewMoreText: "Descubre más"
  };

  const cardData5 = {
    title: 'SERVICIOS ADICIONALES',
    imageSrc: '/serviciosAdicionales.png',
    imageAlt: 'Servicios adicionales',
    lines: [
      { text: 'Transporte de máx 50 cajas x300', icon: <FaCheckCircle /> },
      { text: 'Cajas x300', icon: <FaCheckCircle /> },
      { text: 'Consultas digitales hasta 5 folios', icon: <FaCheckCircle /> },
      { text: '1TB de almacenamiento', icon: <FaCheckCircle /> },
      { text: '100 GB de almacenamiento', icon: <FaCheckCircle /> },
    ],
    badgeText: "¡Oferta recomendada!",
    onViewMore: () => router.push("/paginas/servicios/serviciosAdicionales"),
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

      {/* Contenedor de tarjetas */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4 p-2">
        {[cardData1, cardData2, cardData3, cardData4].map((data, i) => (
          <div key={i} className="max-w-[300px] w-full flex flex-col self-auto md:self-stretch">
            <h2 className={`text-xl font-bold mb-2 text-center ${data.titleColorClass}`}>
              {data.title}
            </h2>
            <div className="flex-1 flex flex-col">
              <Card
                imageSrc={data.imageSrc}
                imageAlt={data.imageAlt}
                lines={data.lines}
                borderColorClass={data.borderColorClass}
                titleColorClass={data.titleColorClass}
                iconColorClass={data.iconColorClass}
                badgeText={data.badgeText}
                showViewMore
                onViewMore={data.onViewMore}
                viewMoreText={data.viewMoreText}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Sección de Servicios Adicionales */}
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-5 gap-4 p-2">
        <div className="max-w-[300px] w-full flex flex-col self-auto md:self-stretch">
          <h2 className={`text-xl font-bold mb-2 text-center ${cardData5.titleColorClass}`}>
            {cardData5.title}
          </h2>
          <div className="flex-1 flex flex-col">
            <Card
              imageSrc={cardData5.imageSrc}
              imageAlt={cardData5.imageAlt}
              lines={cardData5.lines}
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
