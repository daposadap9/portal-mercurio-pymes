import React from 'react';
import Slider from '@/components/Slider';
import Card from '@/components/Card';
import { FaHeart } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function About() {
    const router = useRouter();
    const cardData = {
        title: 'MERCURIO SGDEA',
        lines: [
          { text: 'Reduzca hasta un 80% el tiempo en busqueda de documentos con mercurio'},
          { text: 'Seguridad y acceso inmediato a tu informacion con mercurio' },
          { text: 'Digitaliza, automatiza y gestiona sin complicaciones. Mercurio lo hace por ti'},
          
        ],
        maxLines: 7,
      };
    
      const cardData2 = {
        title: 'MERCURIO PYMES',
        lines: [
          { text: 'Optimiza los procesos de tu empresa con documentos digitales de fácil acceso y busqueda rápida, digitaliza hoy y trabaja con mas eficiencia'},
          { text: 'Ahorra costos y gana productividad con mercurio, el futuro de la gestion documental'},
          { text: 'Dile adiós al papeleo y bienvenido a la eficiencia con mercurio'},
          
        ],
        maxLines: 7,
      };
      const cardData3 = {
        title: 'CUSTODIA',
        lines: [
          { text: 'Custodiamos desde 1 caja de documentos'},
          { text: 'Nuestra custodia te proporciona tranquilidad al saber que tus documentos están en condiciones óptimas y con un manejo totalmente confidencial'},
          { text: 'Aprovecha la reducción de costos operativos y de personal, al delegar la gestion de tus archivos fisicos en expertos'},
          
        ],
        maxLines: 7,
      };
      const cardData4 = {
        title: 'DIGITALIZACIÓN',
        lines: [
          { text: 'La digitalización documental no es un gasto, es una inversión en segurdiad, accesibilidad y productividad'},
          { text: 'Cumple con las normativas legales y protege tu información con copias digitales seguras y respaldadas'},
          { text: 'Convierte tu archivo físico en digital y reduce costos operativos mientras mejoras la eficiencia de tu empresa'},
          
        ],
        maxLines: 7,
      };
      const cardData5 = {
        title: 'SERVICIOS ADICIONALES',
        lines: [
          { text: 'Transporte de máx 50 cajas x300'},
          { text: 'Cajas x300'},
          { text: 'Consultas digitales hasta 5 folios'},
          { text: '1TB de almacenamiento'},
          { text: '100 GB de almacenamiento'},
        ],
        maxLines: 7,
      };
      const cardData6 = {
        title: 'PLAN LITE',
        lines: [
          { text: 'COP 2.000.000', color: 'text-blue-500', textSize: 'text-2xl'},
          { text: 'Mercurio pymes premium', color: 'text-black', showIcon: false },
          { text: 'Mercurio pymes premium', color: 'text-black', icon: <FaHeart/> },
          'Línea sin color222222',
          'Línea sin color 2',
          
        ],
        maxLines: 7,
      };
      const cardData7 = {
        title: 'PLAN GOLD',
        lines: [
          { text: 'COP 2.000.000', color: 'text-blue-500', textSize: 'text-2xl'},
          { text: 'Mercurio pymes premium', color: 'text-black', showIcon: false },
          { text: 'Mercurio pymes premium', color: 'text-black', icon: <FaHeart/> },
          'Línea sin color222222',
          'Línea sin color 2',
          
        ],
        maxLines: 7,
      };
      const cardData8 = {
        title: '¡CREA TU PLAN!',
        lines: [
          { text: 'COP 2.000.000', color: 'text-blue-500', textSize: 'text-2xl'},
          { text: 'Mercurio pymes premium', color: 'text-black', showIcon: false },
          { text: 'Mercurio pymes premium', color: 'text-black', icon: <FaHeart/> },
          'Línea sin color222222',
          'Línea sin color 2',
          
        ],
        maxLines: 7,
      };
  return (
    <>
      <div className='flex justify-center pt-20 text-6xl font-bold text-orange-500'><h1>¡Cotiza tu servicio!</h1></div>
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-20 gap-4">
        <Card 
          title={cardData.title} 
          lines={cardData.lines} 
          maxLines={cardData.maxLines}
          borderColorClass="hover:border-yellow-500"  
          titleColorClass="text-yellow-600"       // Opcional: cambiar color del título
          iconColorClass="text-yellow-600" 
          showViewMore={true}
          onViewMore={() => router.push("/mercurioSGDEA")}
          viewMoreText="Descubre más"  // Puedes cambiar este texto según necesites                 
        />
        <Card 
          title={cardData2.title} 
          lines={cardData2.lines} 
          maxLines={cardData2.maxLines}
          borderColorClass="hover:border-blue-500"
          titleColorClass="text-blue-600"       // Opcional: cambiar color del título
          iconColorClass="text-blue-600"
          showViewMore={true}
          onViewMore={() => router.push("/mercurioPYMES")}
          viewMoreText="Descubre más"  // Puedes cambiar este texto según necesites
          /* Aquí puedes usar los valores por defecto o personalizarlos */
        />
        <Card 
          title={cardData3.title} 
          lines={cardData3.lines} 
          maxLines={cardData3.maxLines} 
          borderColorClass="hover:border-orange-500"
          titleColorClass="text-orange-600"       // Opcional: cambiar color del título
          iconColorClass="text-orange-600"
          showViewMore={true}
          onViewMore={() => alert('¡Mostrando más detalles!')}
          viewMoreText="Descubre más"  // Puedes cambiar este texto según necesites
        />
        <Card 
          title={cardData4.title} 
          lines={cardData4.lines} 
          maxLines={cardData4.maxLines} 
          borderColorClass="hover:border-red-500"
          badgeText="¡Oferta recomendada!"
          titleColorClass="text-red-600"       // Opcional: cambiar color del título
          iconColorClass="text-red-600"         // Opcional: cambiar color del icono
          showViewMore={true}
          onViewMore={() => alert('¡Mostrando más detalles!')}
          viewMoreText="Descubre más"  // Puedes cambiar este texto según necesites
        />
        <Card 
          title={cardData5.title} 
          lines={cardData5.lines} 
          maxLines={cardData5.maxLines} 
          borderColorClass="hover:border-green-500"
          badgeText="¡Oferta recomendada!"
          titleColorClass="text-green-700"       // Opcional: cambiar color del título
          iconColorClass="text-green-500"         // Opcional: cambiar color del icono
          showViewMore={true}
          onViewMore={() => alert('¡Mostrando más detalles!')}
          viewMoreText="Descubre más"  // Puedes cambiar este texto según necesites
        />
      </div>
      <div className='flex justify-center pt-20 text-6xl font-bold text-orange-500'><h1>¡Nuestros planes!</h1></div>
      <div className="flex flex-col md:flex-row flex-wrap items-center justify-center pt-20 gap-4">
      <Card
        title={cardData6.title} 
        lines={cardData6.lines} 
        maxLines={cardData6.maxLines}
        borderColorClass="hover:border-blue-500"
        titleColorClass="text-blue-600"       // Opcional: cambiar color del título
        iconColorClass="text-blue-600"
        showViewMore={true}
        onViewMore={() => alert('¡Adquierelo ahora!')}
        viewMoreText="¡Adquierelo ahora!"  // Puedes cambiar este texto según necesites
                         
        />
        <Card 
          title={cardData7.title}
          lines={cardData7.lines} 
          maxLines={cardData7.maxLines}
          borderColorClass="hover:border-yellow-500"  
          titleColorClass="text-yellow-600"       // Opcional: cambiar color del título
          iconColorClass="text-yellow-600"
          showViewMore={true}
          onViewMore={() => alert('¡Adquierelo ahora!')}
          viewMoreText="¡Adquierelo ahora!"  // Puedes cambiar este texto según necesites
          badgeText="¡Oferta recomendada!"
        />
        <Card 
          title={cardData8.title} 
          lines={cardData8.lines} 
          maxLines={cardData8.maxLines} 
          borderColorClass="hover:border-orange-500"
          titleColorClass="text-orange-600"       // Opcional: cambiar color del título
          iconColorClass="text-orange-600"
          showViewMore={true}
          onViewMore={() => alert('¡Adquierelo ahora!')}
          viewMoreText="¡Adquierelo ahora!"  // Puedes cambiar este texto según necesites  
        />
      </div>
    </>
  );
}
