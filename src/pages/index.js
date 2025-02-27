import React from 'react';
import Slider from '@/components/Slider';
import Servicios from './paginas/servicios';
import MobileCardSlider from '@/components/MobileCardSlider';

export default function Home() {
  return (
    <>
      {/* Wrapper que anula el padding horizontal */}
      <div className="-mx-4 md:-mx-10 md:-mt-14">
        <Slider autoPlay={true} autoPlayTime={20000} />
      </div>
      
      <div className="mt-16">
        <Servicios disabledProvider="diabledProvider" />
      </div>
      <div className="mt-16">
      <div className={`flex justify-center text-2xl md:text-4xl font-bold transition-all duration-500 ease-in-out text-teal-600 text-center titulo-shadow`}>
      <h1>Nuestros clientes</h1>
      </div>
        <MobileCardSlider/>
      </div>
    </>
  );
}
