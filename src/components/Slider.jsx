import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const defaultMedia = ['/video1.mp4', '/video2.mp4', '/video3.mp4']; // Asegúrate de que estas rutas sean correctas

const Slider = ({ media = defaultMedia, autoPlay = false, autoPlayTime = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

  // Determina el tipo de medio según su extensión
  const getMediaType = (src) => {
    const ext = src.split('.').pop().toLowerCase();
    if (ext === 'mp4') return 'video';
    // Puedes agregar otras extensiones de imagen si es necesario
    return 'image';
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  // Cambio automático de slide si autoPlay es true
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
  }, [autoPlay, autoPlayTime, media.length]);

  // Reproduce el video activo y pausa los demás
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
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
      {media.map((src, index) => {
        const commonClassNames = `absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
          index === currentIndex ? 'opacity-100' : 'opacity-0'
        }`;
        const mediaType = getMediaType(src);

        if (mediaType === 'image') {
          return (
            <div key={index} className={commonClassNames}>
              <Image 
                src={src} 
                alt={`Slide ${index}`} 
                layout="fill" 
                objectFit="cover"
              />
            </div>
          );
        } else if (mediaType === 'video') {
          return (
            <video
              key={index}
              ref={el => videoRefs.current[index] = el}
              muted
              loop
              playsInline
              preload="metadata"
              className={commonClassNames}
            >
              <source src={src} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          );
        }
        return null;
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
        {media.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentIndex === index
                ? 'bg-white shadow-md border-black border'
                : 'bg-blue-500 shadow-md border-teal-500 border'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
