import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const images = [
  '/cliente10.png',
  '/cliente7.png',
  '/cliente2.png',
  '/cliente3.png',
  '/cliente5.png',
  '/cliente6.png',
  '/cliente4.png',
  '/cliente1.png',
  '/cliente11.png',
  /*'/cliente12.png', finagro, inder medellin, indeportes antioquia, contraloria general, */
  '/cliente13.png',
  '/cliente14.png',
  '/cliente15.png',
  '/cliente16.png',
  '/cliente17.png',
  '/cliente20.png',
  '/cliente21.png',
  '/cliente22.png',
];

// Array extendido para efecto infinito: [última imagen, ...imágenes, primera imagen]
const extendedSlides = [images[images.length - 1], ...images, images[0]];

const getSlideStyle = (position, isMobile = false, disableTransition = false) => {
  const base = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transition: disableTransition
      ? 'none'
      : 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  if (isMobile) {
    switch (position) {
      case -1:
        return {
          ...base,
          transform: 'translate(calc(-50% - 230px), -50%) scale(0.4)',
          opacity: 0.1,
          zIndex: 1,
          filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.9))',
        };
      case 0:
        return {
          ...base,
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1,
          zIndex: 3,
          filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))',
        };
      case 1:
        return {
          ...base,
          transform: 'translate(calc(-50% + 230px), -50%) scale(0.8)',
          opacity: 0.4,
          zIndex: 1,
          filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.8))',
        };
      case 2:
        return {
          ...base,
          transform: 'translate(calc(-50% + 460px), -50%) scale(0.65)',
          opacity: 0.2,
          zIndex: 0,
          filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))',
        };
      default:
        return { opacity: 0, pointerEvents: 'none' };
    }
  } else {
    switch (position) {
      case -1:
        return {
          ...base,
          transform: 'translate(calc(-50% - 28vw), calc(-50% + 5vh)) scale(0.4)',
          opacity: 0.1,
          zIndex: 1,
          filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.4))',
        };
      case 0:
        return {
          ...base,
          transform: 'translate(-50%, -50%) scale(1)',
          opacity: 1,
          zIndex: 3,
          filter: 'drop-shadow(0px 0px 4px rgba(0,0,0,0.8))',
        };
      case 1:
        return {
          ...base,
          transform: 'translate(calc(-50% + 28vw), calc(-50% + 5vh)) scale(0.7)',
          opacity: 0.4,
          zIndex: 1,
          filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.8))',
        };
      case 2:
        return {
          ...base,
          transform: 'translate(calc(-50% + 56vw), calc(-50% + 8vh)) scale(0.5)',
          opacity: 0.2,
          zIndex: 0,
          filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))',
        };
      default:
        return { opacity: 0, pointerEvents: 'none' };
    }
  }
};

const Infinite3DFadingSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [disableTransition, setDisableTransition] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Usamos un timeout recursivo para el auto slide
  const autoSlideTimeoutRef = useRef(null);

  // Detecta si es mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para avanzar de slide
  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev + 1);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1100);
  }, [isTransitioning]);

  // Función para retroceder de slide
  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(prev => prev - 1);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 1100);
  }, [isTransitioning]);

  // Programa el auto slide cada 1000 ms (más rápido)
  const scheduleAutoSlide = useCallback(() => {
    clearTimeout(autoSlideTimeoutRef.current);
    autoSlideTimeoutRef.current = setTimeout(() => {
      nextSlide();
      scheduleAutoSlide();
    }, 1000);
  }, [nextSlide]);

  useEffect(() => {
    scheduleAutoSlide();
    return () => clearTimeout(autoSlideTimeoutRef.current);
  }, [scheduleAutoSlide]);

  // Reinicia el auto slide tras una interacción (pausa de 500 ms)
  const resetAutoSlide = useCallback(() => {
    clearTimeout(autoSlideTimeoutRef.current);
    setTimeout(() => {
      scheduleAutoSlide();
    }, 500);
  }, [scheduleAutoSlide]);

  // Al llegar a un clon, reajusta el índice sin animación
  useEffect(() => {
    if (currentSlide === extendedSlides.length - 1) {
      setTimeout(() => {
        setDisableTransition(true);
        setCurrentSlide(1);
        setTimeout(() => setDisableTransition(false), 50);
      }, 1100);
    }
    if (currentSlide === 0) {
      setTimeout(() => {
        setDisableTransition(true);
        setCurrentSlide(extendedSlides.length - 2);
        setTimeout(() => setDisableTransition(false), 50);
      }, 1100);
    }
  }, [currentSlide]);

  // Control con flechas
  const handleNext = useCallback(() => {
    nextSlide();
    resetAutoSlide();
  }, [nextSlide, resetAutoSlide]);

  const handlePrev = useCallback(() => {
    prevSlide();
    resetAutoSlide();
  }, [prevSlide, resetAutoSlide]);

  // Manejo de swipe (pointer events)
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragThreshold = 50;

  const handlePointerDown = (e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  };

  const handlePointerUp = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const delta = e.clientX - startX.current;
    if (delta > dragThreshold) {
      handlePrev();
    } else if (delta < -dragThreshold) {
      handleNext();
    }
  };

  return (
    <div
      className="slider-wrapper"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <button onClick={handlePrev} className="nav-button prev-button text-gray-950 border-gray-950">
        <FaChevronLeft size={18} />
      </button>
      <button onClick={handleNext} className="nav-button next-button text-gray-950 border-gray-950">
        <FaChevronRight size={18} />
      </button>

      <div className="slider-container">
        {extendedSlides.map((src, index) => {
          const relativePosition = index - currentSlide;
          if (relativePosition < -1 || relativePosition > 2) return null;
          return (
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className="slider-image"
              style={getSlideStyle(relativePosition, isMobile, disableTransition)}
            />
          );
        })}
      </div>

      <div className="indicator-container">
        {images.map((_, index) => (
          <div
            key={index}
            className={`indicator ${currentSlide - 1 === index ? 'active' : ''}`}
            onClick={() => {
              if (isTransitioning) return;
              setIsTransitioning(true);
              setCurrentSlide(index + 1);
              resetAutoSlide();
              setTimeout(() => {
                setIsTransitioning(false);
              }, 1100);
            }}
          />
        ))}
      </div>

      <style jsx>{`
        .slider-wrapper {
          width: 90%;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          height: 30vh;
          overflow: hidden;
        }
        .slider-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        .slider-image {
          transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, opacity;
          object-fit: contain;
          display: block;
          max-width: 100%;
          max-height: 100%;
        }
        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          background: white;
          border: none;
          padding: 0.5rem;
          border-radius: 9999px;
          box-shadow: 0px 2px 13px rgba(0,0,0,0.9);
          cursor: pointer;
        }
        .prev-button {
          left: 1rem;
        }
        .next-button {
          right: 1rem;
        }
        .indicator-container {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 50;
        }
        .indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .indicator.active {
          background: #000;
          transform: scale(1.2);
        }
        @media (max-width: 768px) {
          .slider-image {
            width: 30vw;
            max-width: 320px;
          }
        }
        @media (max-width: 522px) {
          .slider-image {
            width: 40vw;
            max-width: 320px;
          }
        }
        @media (min-width: 769px) {
          .slider-image {
            width: 25vw;
            max-width: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default Infinite3DFadingSlider;
