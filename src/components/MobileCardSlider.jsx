import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  '/cliente12.png',
];

// Pre-cargar las imágenes para mostrarlas de forma constante
images.forEach((src) => {
  const img = new Image();
  img.src = src;
});

const Horizontal3DSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragThreshold = 50;

  // Refs para el auto slide y pausa
  const autoSlideIntervalRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  const startAutoSlide = useCallback(() => {
    autoSlideIntervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0
      );
    }, 1500);
  }, []);

  useEffect(() => {
    startAutoSlide();
    return () => {
      if (autoSlideIntervalRef.current) clearInterval(autoSlideIntervalRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [startAutoSlide]);

  const pauseAutoSlide = useCallback(() => {
    if (autoSlideIntervalRef.current) {
      clearInterval(autoSlideIntervalRef.current);
      autoSlideIntervalRef.current = null;
    }
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      startAutoSlide();
    }, 3000);
  }, [startAutoSlide]);

  const handlePointerDown = useCallback((e) => {
    isDragging.current = true;
    startX.current = e.clientX;
  }, []);

  const handlePointerUp = useCallback(
    (e) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      const deltaX = e.clientX - startX.current;
      if (deltaX > dragThreshold && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
        pauseAutoSlide();
      } else if (deltaX < -dragThreshold && activeIndex < images.length - 1) {
        setActiveIndex((prev) => prev + 1);
        pauseAutoSlide();
      }
    },
    [activeIndex, pauseAutoSlide]
  );

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
      pauseAutoSlide();
    }
  }, [activeIndex, pauseAutoSlide]);

  const handleNext = useCallback(() => {
    if (activeIndex < images.length - 1) {
      setActiveIndex((prev) => prev + 1);
      pauseAutoSlide();
    }
  }, [activeIndex, pauseAutoSlide]);

  // Determinamos las imágenes en cada posición
  const leftImage = activeIndex - 1 >= 0 ? images[activeIndex - 1] : null;
  const activeImage = images[activeIndex];
  const rightImage = activeIndex + 1 < images.length ? images[activeIndex + 1] : null;
  const farRightImage = activeIndex + 2 < images.length ? images[activeIndex + 2] : null;

  return (
    <div className="slider-wrapper text-slate-950">
      {/* Botones de navegación */}
      <button onClick={handlePrev} className="nav-button prev-button">
        <FaChevronLeft size={18} />
      </button>
      <button onClick={handleNext} className="nav-button next-button">
        <FaChevronRight size={18} />
      </button>

      <div
        className="slider-container"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {leftImage && (
          <img
            src={leftImage}
            alt={`Imagen ${activeIndex - 1}`}
            className="slider-image left-image"
            style={{
              filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.4))',
              opacity: 0.1,
              zIndex: 1,
              transition: 'none',
            }}
          />
        )}

        <img
          src={activeImage}
          alt={`Imagen ${activeIndex}`}
          className="slider-image active-image"
          style={{
            opacity: 1,
            zIndex: 3,
            transition: 'none',
          }}
        />

        {rightImage && (
          <img
            src={rightImage}
            alt={`Imagen ${activeIndex + 1}`}
            className="slider-image right-image"
            style={{
              filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.8))',
              opacity: 0.4,
              zIndex: 1,
              transition: 'none',
            }}
          />
        )}

        {farRightImage && (
          <img
            src={farRightImage}
            alt={`Imagen ${activeIndex + 2}`}
            className="slider-image far-right-image"
            style={{
              filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))',
              opacity: 0.2,
              zIndex: 0,
              transition: 'none',
            }}
          />
        )}
      </div>

      {/* Indicadores */}
      <div className="indicator-container">
        {images.map((_, index) => (
          <div
            key={index}
            className={`indicator ${activeIndex === index ? 'active' : ''}`}
            onClick={() => {
              setActiveIndex(index);
              pauseAutoSlide();
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
        }
        .slider-container {
          width: 100%;
          height: 30vh;
          perspective: 1000px;
          overflow: hidden;
          position: relative;
        }
        .slider-image {
          position: absolute;
          height: auto;
          transition: none;
        }
        /* Mobile */
        @media (max-width: 768px) {
          .slider-image {
            width: 40vw;
            max-width: 350px;
          }
          .left-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% - 35vw), -50%) scale(0.35);
          }
          .active-image {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1);
          }
          .right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 35vw), -50%) scale(0.65);
          }
          .far-right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 70vw), -50%) scale(0.45);
          }
          .nav-button {
            background: white;
            color: #000;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
          }
          .indicator-container {
            bottom: 1rem;
          }
        }
        /* Desktop */
        @media (min-width: 769px) {
          .slider-image {
            width: 25vw;
            max-width: 250px;
          }
          .left-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% - 20vw), calc(-50% + 5vh)) scale(0.4);
          }
          .active-image {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1);
          }
          .right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 20vw), calc(-50% + 5vh)) scale(0.7);
          }
          .far-right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 40vw), calc(-50% + 8vh)) scale(0.5);
          }
        }
        @media (min-width: 769px) and (max-width: 1123px) {
          .left-image {
            transform: translate(calc(-50% - 25vw), calc(-50% + 5vh)) scale(0.4);
          }
          .active-image {
            transform: translate(-50%, -50%) scale(1);
          }
          .right-image {
            transform: translate(calc(-50% + 25vw), calc(-50% + 5vh)) scale(0.7);
          }
          .far-right-image {
            transform: translate(calc(-50% + 50vw), calc(-50% + 8vh)) scale(0.5);
          }
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
          box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
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
      `}</style>
    </div>
  );
};

export default Horizontal3DSlider;
