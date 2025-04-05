import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import PrevArrow from './Arrows/PrevArrow';
import NextArrow from './Arrows/NextArrow';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SlideProps {
  children: React.ReactNode;
}

const Slide: React.FC<SlideProps> = ({ children }) => {
  const [slidesToShow, setSlidesToShow] = useState(5);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 480) setSlidesToShow(1);
      else if (width < 600) setSlidesToShow(1);
      else if (width < 850) setSlidesToShow(2);
      else if (width < 1366) setSlidesToShow(4);
      else setSlidesToShow(6);
    };

    updateSlides(); // Gọi khi load
    window.addEventListener('resize', updateSlides); // Gọi khi resize
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const settings = {
    infinite: true,
    slidesToShow,
    slidesToScroll: slidesToShow,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipeToSlide: true,
  };

  return (
    <div className="w-full">
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
};

export default Slide;
