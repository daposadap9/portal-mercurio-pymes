import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Ahora las imágenes por defecto son imagen1.jpg e imagen2.jpg
const defaultImages = ["/imagen1.jpg", "/imagen2.jpg"];

const Slider = ({ images = defaultImages, autoPlay = false, autoPlayTime = 3000 }) => {
  // Si se pasa un array vacío, se utiliza el array por defecto
  if (!images || images.length === 0) {
    images = defaultImages;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Auto-play: cambia de imagen automáticamente si se activa la opción
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
  }, [autoPlay, autoPlayTime, images.length]);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-md">
      {/* Contenedor de slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Slide ${index}`}
            className="w-full flex-shrink-0 h-80 sm:h-96 md:h-[32rem] object-cover"
          />
        ))}
      </div>

      {/* Botón de flecha izquierda */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 transform -translate-y-1/2 left-4 text-black bg-orange-500 bg-opacity-80 p-2 rounded-full hover:bg-opacity-75"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Botón de flecha derecha */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 transform -translate-y-1/2 right-4 text-black bg-orange-500 bg-opacity-80 p-2 rounded-full hover:bg-opacity-75"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-white shadow-md border-black border-1' : 'bg-orange-500 shadow-md border-black border-1'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
