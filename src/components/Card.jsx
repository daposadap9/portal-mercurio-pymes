// components/Card.jsx
import React, { useContext } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { ThemeContext } from '../context/ThemeContext'; // Ajusta la ruta según tu estructura

const Card = ({ 
  title, 
  lines, 
  maxLines, 
  borderColorClass = "hover:border-blue-400", 
  textSizeClass = "text-base",  
  defaultShowIcon = true,
  defaultIcon = <FaDollarSign />,
  iconClass = "mr-2 text-xl", 
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

  // Selecciona la clase de fondo según el tema actual:
  const bgClass =
    theme === 'dark'
      ? 'bg-custom-gradient'
      : theme === 'purple'
      ? 'bg-custom-gradient2'
      : 'bg-custom-gradient3';

  const displayLines = lines.slice(0, maxLines);

  return (
    <div 
      className={`
        md:self-stretch relative rounded-xl shadow-2xl p-6
        min-w-[300px] max-w-[300px] flex flex-col items-center transition-transform duration-200 hover:scale-105 border-2 
        ${borderColorClass} ${bgClass} border border-white/30
      `}
    >
      {/* Badge opcional */}
      {badgeText && (
        <div className="absolute -top-2 -right-0 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
          {badgeText}
        </div>
      )}
      
      <h2 className={`text-lg font-extrabold mb-4 text-center ${titleColorClass}`}>
        {title}
      </h2>

      {/* Contenedor para las líneas */}
      <ul className="space-y-2 flex-1 w-full text-left">
        {displayLines.map((line, index) => {
          let content = "";
          let colorClass = "text-black";
          let showIcon = defaultShowIcon;
          let customIcon = null;
          let lineTextSize = textSizeClass;

          if (typeof line === "object" && line !== null) {
            content = line.text || "";
            if (line.color) colorClass = line.color;
            if (typeof line.showIcon !== "undefined") showIcon = line.showIcon;
            if (line.icon) customIcon = line.icon;
            if (line.textSize) lineTextSize = line.textSize;
          } else {
            content = line;
          }

          return (
            <li key={index} className="flex items-center">
              {showIcon && (
                <span className={`${iconClass} ${iconColorClass}`}>
                  {customIcon ? customIcon : defaultIcon}
                </span>
              )}
              <span className={`${colorClass} ${lineTextSize}`}>
                {content}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Botón "Ver más" opcional */}
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

      {/* Botón adicional opcional */}
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
