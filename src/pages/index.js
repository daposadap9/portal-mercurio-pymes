import React from 'react';
import Slider from '@/components/Slider';
import Card from '../components/Card';
import { FaHeart } from 'react-icons/fa';

export default function Home() {

  return (
    <>
      <Slider autoPlay={true} autoPlayTime={10000} />
    </>
  );
}
