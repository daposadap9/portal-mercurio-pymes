import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const defaultVideos = ["/imagen1.gif", "/imagen2.gif", "/imagen3.gif"];

const Slider = ({ videos = defaultVideos, autoPlay = false, autoPlayTime = 3000 }) => {
  if (!videos || videos.length === 0) {
    videos = defaultVideos;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

  // Función para detectar si es un GIF
  const isGif = (src) => src.toLowerCase().endsWith('.gif');

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  // Cambio automático de slide
  useEffect(() => {
    let interval = null;
    if (autoPlay) {
      interval = setInterval(() => {
        nextSlide();
      }, autoPlayTime);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, autoPlayTime, videos.length]);

  // Controla la reproducción de los videos activos
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      // Solo se procesa si existe el elemento video (no aplica para GIFs)
      if (video) {
        if (index === currentIndex) {
          video.currentTime = 0;
          video.play().catch(error => console.error("Error al reproducir el video:", error));
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  return (
    <div className="relative w-full h-60 sm:h-80 md:h-[32rem] overflow-hidden rounded-md shadow-lg">
      {videos.map((src, index) => {
        const commonClassNames = `absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`;
        return isGif(src) ? (
          <img 
            key={index} 
            src={src} 
            alt={`Slide ${index}`} 
            className={commonClassNames} 
          />
        ) : (
          <video
            key={index}
            ref={el => videoRefs.current[index] = el}
            src={src}
            muted
            loop
            playsInline
            className={commonClassNames}
          />
        );
      })}

      {/* Botón de flecha izquierda */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-950 bg-teal-500 shadow-md bg-opacity-80 p-3 rounded-full hover:bg-opacity-75 z-10"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Botón de flecha derecha */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-950 bg-teal-500 shadow-md bg-opacity-80 p-3 rounded-full hover:bg-opacity-75 z-10"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
        {videos.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-white shadow-md border-black border' : 'bg-blue-500 shadow-md border-teal-500 border'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
