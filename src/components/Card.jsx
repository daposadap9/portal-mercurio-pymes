import React from 'react';
import { FaDollarSign } from 'react-icons/fa';

const Card = ({ 
  title, 
  lines, 
  maxLines, 
  // Prop para el borde de la card (por ejemplo, al hacer hover)
  borderColorClass = "hover:border-blue-400", 
  // Prop para el tamaño del texto (se aplicará a cada línea)
  textSizeClass = "text-lg",
  // Props para iconos
  defaultShowIcon = true,         // Por defecto se muestra el icono
  defaultIcon = <FaDollarSign />,   // Icono por defecto
  iconClass = "mr-2 text-xl",         // Clases para el contenedor del icono
  // Nuevas props para el color del título y del icono
  titleColorClass = "text-black",
  iconColorClass = "text-black",
  // Nueva prop para la etiqueta (badge) de venta
  badgeText = "",  // Si se pasa un texto, se mostrará el badge; de lo contrario, no se muestra
  // Nuevas props para el botón "Ver más"
  showViewMore = false,
  onViewMore = () => {},
  viewMoreText = "Ver más" // Texto del botón, por defecto "Ver más"
}) => {
  // Tomamos solo las primeras maxLines líneas
  const displayLines = lines.slice(0, maxLines);

  return (
    <div className={`
      relative bg-slate-50 text-black rounded-xl shadow-2xl p-8 m-4 
      w-full max-w-[calc(100%-2rem)] 
      sm:w-1/2 sm:max-w-[calc(50%-2rem)] 
      lg:w-1/3 lg:max-w-[calc(33.33%-2rem)]
      transform transition duration-500 hover:scale-105 border-2 ${borderColorClass}
    `}>
      {/* Badge opcional: se muestra solo si badgeText tiene contenido */}
      {badgeText && (
        <div className="absolute -top-3 -right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded-full">
          {badgeText}
        </div>
      )}
      <h2 className={`text-2xl font-extrabold mb-6 ${titleColorClass}`}>
        {title}
      </h2>
      <ul className="space-y-4">
        {displayLines.map((line, index) => {
          let content = "";
          let colorClass = "text-black"; // Color por defecto para la línea
          let showIcon = defaultShowIcon; // Por defecto, se muestra el icono
          let customIcon = null;
          let lineTextSize = textSizeClass; // Tamaño de texto por defecto

          // Si la línea es un objeto, extraemos sus propiedades
          if (typeof line === "object" && line !== null) {
            content = line.text || "";
            if (line.color) {
              colorClass = line.color;
            }
            if (typeof line.showIcon !== "undefined") {
              showIcon = line.showIcon;
            }
            if (line.icon) {
              customIcon = line.icon;
            }
            if (line.textSize) {
              lineTextSize = line.textSize;
            }
          } else {
            // Si la línea es una cadena, se usa directamente
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
        <div className="mt-4">
          <button 
            onClick={onViewMore} 
            className="bg-teal-500 text-white rounded-md px-4 py-2 font-bold transition-colors duration-300 ease-in-out hover:bg-teal-600"
          >
            {viewMoreText}
          </button>
        </div>
      )}
    </div>
  );
};

export default Card;
