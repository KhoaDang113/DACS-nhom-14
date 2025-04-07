import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import PrevArrow from '../Arrows/PrevArrow';
import NextArrow from '../Arrows/NextArrow';

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
      if (width < 640) setSlidesToShow(1);         // Mobile
      else if (width < 768) setSlidesToShow(2);    // Small tablets
      else if (width < 1024) setSlidesToShow(3);   // Tablets
      else if (width < 1280) setSlidesToShow(4);   // Small laptops
      else setSlidesToShow(5);                     // Large screens
    };

    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const settings = {
    infinite: true,
    slidesToShow,
    slidesToScroll: slidesToShow,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
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