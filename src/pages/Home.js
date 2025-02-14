import React from 'react';
import Card from '../components/Card';

export default function Home() {
  const cardData = {
    title: 'Título de la Tarjeta',
    lines: [
      'Primera línea 2',
      'Segunda línea',
      'Tercera línea',
      'Cuarta línea',
    ],
    maxLines: 3,
  };

  const cardData2 = {
    title: 'Título de la Tarjeta',
    lines: [
      'Primera línea 2',
      'Segunda línea 2',
      'Tercera línea 2',
    ],
    maxLines: 7,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
        <h1>Nuestros planes</h1>
      <div className="flex-grow flex flex-col md:flex-row flex-wrap items-center justify-center pt-20 gap-4">
        <Card 
          title={cardData.title}
          lines={cardData.lines} 
          maxLines={cardData.maxLines} 
        />
        <Card 
          title={cardData2.title} 
          lines={cardData2.lines} 
          maxLines={cardData2.maxLines} 
        />
        <Card 
          title={cardData.title}
          lines={cardData.lines} 
          maxLines={cardData.maxLines}
        />
      </div>
    </div>
  );
}
