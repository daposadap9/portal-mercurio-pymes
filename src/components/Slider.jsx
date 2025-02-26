import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const defaultVideos = ["/imagen1.mp4", "/imagen2.mp4", "/imagen3.mp4"];

const Slider = ({ videos = defaultVideos, autoPlay = false, autoPlayTime = 3000 }) => {
  if (!videos || videos.length === 0) {
    videos = defaultVideos;
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);

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

  // Controla la reproducción del video activo: se reproduce y resetea los otros
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
    <div className="relative w-full h-60 sm:h-80 md:h-[32rem] overflow-hidden rounded-md">
      {/* Videos con efecto fade */}
      {videos.map((src, index) => (
        <video
          key={index}
          ref={el => videoRefs.current[index] = el}
          src={src}
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Botón de flecha izquierda */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black bg-orange-500 bg-opacity-80 p-3 rounded-full hover:bg-opacity-75 z-10"
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Botón de flecha derecha */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black bg-orange-500 bg-opacity-80 p-3 rounded-full hover:bg-opacity-75 z-10"
      >
        <FaChevronRight size={20} />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
        {videos.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-white shadow-md border-black border' : 'bg-orange-500 shadow-md border-black border'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
