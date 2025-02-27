import React, { useState, useRef } from 'react';
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
];

const Horizontal3DSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
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
    const deltaX = e.clientX - startX.current;
    if (deltaX > dragThreshold && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else if (deltaX < -dragThreshold && activeIndex < images.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  };

  const handleNext = () => {
    if (activeIndex < images.length - 1) setActiveIndex(activeIndex + 1);
  };

  const leftImage = activeIndex - 1 >= 0 ? images[activeIndex - 1] : null;
  const activeImage = images[activeIndex];
  const rightImage = activeIndex + 1 < images.length ? images[activeIndex + 1] : null;
  const farRightImage = activeIndex + 2 < images.length ? images[activeIndex + 2] : null;

  const transitionStyle = 'all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

  return (
    <div className="slider-wrapper">
      {/* Flechas de navegación */}
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
        {/* Imagen a la izquierda */}
        {leftImage && (
          <img
            src={leftImage}
            alt={`Imagen ${activeIndex - 1}`}
            className="slider-image left-image"
            style={{
              transition: transitionStyle,
              filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.4))',
              opacity: 0.1,
              zIndex: 1,
            }}
          />
        )}

        {/* Imagen activa */}
        <img
          src={activeImage}
          alt={`Imagen ${activeIndex}`}
          className="slider-image active-image"
          style={{
            transition: transitionStyle,
            filter: 'drop-shadow(0px 0px 15px rgba(0,0,0,0.8))',
            opacity: 1,
            zIndex: 3,
          }}
        />

        {/* Imagen inmediata a la derecha */}
        {rightImage && (
          <img
            src={rightImage}
            alt={`Imagen ${activeIndex + 1}`}
            className="slider-image right-image"
            style={{
              transition: transitionStyle,
              filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.8))',
              opacity: 0.4,
              zIndex: 1,
            }}
          />
        )}

        {/* Imagen lejana a la derecha */}
        {farRightImage && (
          <img
            src={farRightImage}
            alt={`Imagen ${activeIndex + 2}`}
            className="slider-image far-right-image"
            style={{
              transition: transitionStyle,
              filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))',
              opacity: 0.2,
              zIndex: 0,
            }}
          />
        )}
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
        }
        /* Mobile: efecto 3D exagerado pero con menos offset vertical */
        @media (max-width: 768px) {
          .slider-image {
            width: 40vw;
            max-width: 350px;
          }
          .left-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% - 35vw), calc(-50% + 5vh)) scale(0.35);
          }
          .active-image {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1);
          }
          .right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 35vw), calc(-50% + 5vh)) scale(0.65);
          }
          .far-right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 70vw), calc(-50% + 8vh)) scale(0.45);
          }
          .nav-button {
            background: white;
            color: #000000;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
          }
        }
        /* Desktop: efecto menos extremo para mantener el layout compacto */
        @media (min-width: 769px) {
          .slider-image {
            width: 25vw;
            max-width: 250px;
          }
          .left-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% - 15vw), calc(-50% + 5vh)) scale(0.4);
          }
          .active-image {
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1);
          }
          .right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 15vw), calc(-50% + 5vh)) scale(0.7);
          }
          .far-right-image {
            left: 50%;
            top: 50%;
            transform: translate(calc(-50% + 30vw), calc(-50% + 8vh)) scale(0.5);
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
          transition: background 0.3s ease;
        }
        .prev-button {
          left: 1rem;
        }
        .next-button {
          right: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Horizontal3DSlider;
