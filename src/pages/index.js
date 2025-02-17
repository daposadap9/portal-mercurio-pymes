import React from 'react';
import Slider from '@/components/Slider';
import Servicios from './paginas/servicios';

export default function Home() {

  return (
    <>
      <Slider autoPlay={true} autoPlayTime={10000} />
      {/*
      <div className='mt-16'>
      <Servicios/>
      </div>*/}
    </>
  );
}
