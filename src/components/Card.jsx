// components/Card.jsx
import React, { useContext } from 'react';
import Image from 'next/image';
import { FaDollarSign } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext';

const Card = ({
  imageSrc,              // ruta de la imagen en /public
  imageAlt = '',         // texto alternativo
  imageClassName = '',   // clases extra para la imagen
  lines,
  borderColorClass = "hover:border-blue-400",
  titleColorClass = "text-black",
  iconColorClass = "text-black",
  badgeText = "",
  showViewMore = false,
  onViewMore = () => {},
  viewMoreText = "Ver más",
  additionalButtonText = "",
  additionalButtonHref = ""
}) => {
  const { theme } = useContext(ThemeContext);

  const bgClass =
    theme === 'dark'
      ? 'bg-custom-gradient'
      : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';

  return (
    <div
      className={`
        flex flex-col h-full
        relative rounded-xl shadow-2xl p-6
        min-w-[300px] max-w-[300px]
        transition-transform duration-200 hover:scale-105 border-2
        ${borderColorClass} ${bgClass} border border-white/30
      `}
    >
      {/* Imagen en la parte superior */}
      {imageSrc && (
        <div className="relative w-full h-40 mb-4 overflow-hidden rounded-lg">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            className={`object-cover ${imageClassName}`}
          />
        </div>
      )}

      {badgeText && (
        <div className="absolute -top-2 -right-0 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
          {badgeText}
        </div>
      )}

      <div className="flex-1 w-full text-left break-words whitespace-normal">
        <ul className="space-y-2">
          {lines.map((line, index) => {
            const text = line.text || line;
            const icon = line.icon || <FaDollarSign />;
            return (
              <li key={index} className="flex items-center">
                <span className={`mr-2 text-xl ${iconColorClass}`}>
                  {icon}
                </span>
                <span className="text-black">{text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {showViewMore && (
        <div className="mt-4 w-full">
          <button
            onClick={onViewMore}
            className="bg-teal-500 text-white rounded-md px-3 py-2 w-full font-bold transition-colors duration-300 ease-in-out hover:bg-teal-600"
          >
            {viewMoreText}
          </button>
        </div>
      )}
      {additionalButtonText && additionalButtonHref && (
        <div className="mt-4 w-full">
          <a
            href={additionalButtonHref}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white rounded-md px-3 py-2 w-full font-bold transition-colors duration-300 ease-in-out hover:bg-blue-600 text-center block"
          >
            {additionalButtonText}
          </a>
        </div>
      )}
    </div>
  );
};

export default Card;
