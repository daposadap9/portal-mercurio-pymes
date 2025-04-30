import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Definimos un arreglo de medios. En este ejemplo, son videos (o imágenes en webm)
// Cada objeto tiene una propiedad "type" y "publicId". Usa únicamente el publicId (sin ruta completa)..
const defaultMedia = [
  { type: 'video', publicId: 'imagen1' },
  { type: 'video', publicId: 'imagen2' },
  { type: 'video', publicId: 'banner' }
  // Ejemplo de imagen (webm animado, por ejemplo):
  // { type: 'image', publicId: 'imagen4' }
];

/**
 * Función para construir la URL local de un video usando archivos en la carpeta public.
 * Si los archivos se encuentran en una subcarpeta (ejemplo: /videos), ajusta la ruta.
 */
const buildVideoUrl = (publicId) => {
  // Si los videos están en una carpeta "videos" dentro de public, usa:
  // return `/videos/${publicId}.webm`;
  // Si están directamente en public, usa::
  return `/${publicId}.webm`;
};

const Slider = ({ media = defaultMedia, autoPlay = false, autoPlayTime = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  // Auto transición de slides si autoPlay está activado
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

  // Reproduce automáticamente el video del slide activo
  useEffect(() => {
    const currentItem = media[currentIndex];
    if (currentItem.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((error) =>
        console.error("Error reproduciendo el video:", error)
      );
    }
  }, [currentIndex, media]);

  return (
    <div className="relative w-full h-60 sm:h-80 md:h-[32rem] overflow-hidden rounded-md shadow-lg">
      {media.map((item, index) => {
        // Clases comunes para la transición de opacidad entre slides
        const commonClassNames = `absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
          index === currentIndex ? 'opacity-100' : 'opacity-0'
        }`;

        if (item.type === 'image') {
          return (
            <div key={index} className={commonClassNames}>
              <img
                src={`/${item.publicId}.webm`}
                alt={`Slide ${index}`}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          );
        } else if (item.type === 'video') {
          return (
            <div key={index} className={commonClassNames}>
              <video
                ref={index === currentIndex ? videoRef : null}
                src={buildVideoUrl(item.publicId)}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
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
