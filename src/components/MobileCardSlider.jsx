import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [
  '/cliente1.jpg',
  '/cliente2.jpg',
  '/cliente3.jpg',
  '/cliente4.jpg',
  '/cliente5.jpg',
  '/cliente6.jpg',
  '/cliente7.jpg',
  '/cliente8.jpg'
];

const MobileDraggableSlider = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Configuración: ancho de cada tarjeta y margen
  const cardWidth = 180; // Ancho de la tarjeta (px)
  const cardMargin = 12;  // Margen horizontal (px)
  const totalCardWidth = cardWidth + cardMargin * 2;
  const dragThreshold = 50; // Umbral de arrastre en píxeles

  // Variables para el arrastre (drag)
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Desplaza el contenedor a la tarjeta deseada y actualiza el índice activo
  const scrollToIndex = (index) => {
    if (containerRef.current) {
      const scrollPosition = index * totalCardWidth;
      containerRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      setActiveIndex(index);
    }
  };

  // Actualiza el índice activo basado en el scroll (cuando no se está arrastrando)
  const handleScroll = () => {
    if (containerRef.current && !isDragging.current) {
      const scrollLeft = containerRef.current.scrollLeft;
      const index = Math.round(scrollLeft / totalCardWidth);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Manejo de eventos pointer para arrastrar
  const handlePointerDown = (e) => {
    isDragging.current = true;
    containerRef.current.setPointerCapture(e.pointerId);
    startX.current = e.clientX;
    scrollLeftStart.current = containerRef.current.scrollLeft;
  };

  const handlePointerMove = (e) => {
    if (!isDragging.current) return;
    const x = e.clientX;
    const walk = x - startX.current;
    containerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handlePointerUp = (e) => {
    isDragging.current = false;
    containerRef.current.releasePointerCapture(e.pointerId);
    // Calcula la distancia arrastrada
    const dragDistance = e.clientX - startX.current;
    let newIndex = activeIndex;
    if (dragDistance > dragThreshold) {
      // Si se arrastra hacia la derecha, mostrar el slide anterior
      newIndex = Math.max(activeIndex - 1, 0);
    } else if (dragDistance < -dragThreshold) {
      // Si se arrastra hacia la izquierda, mostrar el siguiente slide
      newIndex = Math.min(activeIndex + 1, images.length - 1);
    }
    scrollToIndex(newIndex);
  };

  // Flechas de navegación
  const handlePrev = () => {
    const newIndex = Math.max(activeIndex - 1, 0);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = Math.min(activeIndex + 1, images.length - 1);
    scrollToIndex(newIndex);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto overflow-hidden">
      {/* Flechas de navegación */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md"
      >
        <FaChevronLeft size={18} />
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20 bg-white p-2 rounded-full shadow-md"
      >
        <FaChevronRight size={18} />
      </button>

      {/* Contenedor scrollable sin barras de desplazamiento */}
      <div
        ref={containerRef}
        className="flex snap-x snap-mandatory hide-scrollbar"
        style={{
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          touchAction: 'pan-y',
          padding: '0 1rem',
          msOverflowStyle: 'none', // IE y Edge
          scrollbarWidth: 'none'   // Firefox
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className={`
              flex-shrink-0 snap-center transition-transform duration-300 ease-in-out 
              ${activeIndex === index ? 'scale-110' : 'scale-100 opacity-80'}
            `}
            style={{ 
              width: `${cardWidth}px`,
              marginLeft: `${cardMargin}px`,
              marginRight: `${cardMargin}px`
            }}
          >
            <img
              src={img}
              alt={`Cliente ${index + 1}`}
              className="w-full h-auto object-cover rounded-lg select-none"
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
            />
          </div>
        ))}
      </div>

      {/* Indicadores */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToIndex(index)}
            className={`w-2 h-2 rounded-full focus:outline-none ${
              activeIndex === index ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          ></button>
        ))}
      </div>

      {/* Oculta las barras de desplazamiento en WebKit */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MobileDraggableSlider;
