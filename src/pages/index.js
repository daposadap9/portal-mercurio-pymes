import React from 'react';
import Slider from '@/components/Slider';
import Servicios from './paginas/servicios';

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
    </>
  );
}
