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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      setIsMobile(width < 480);
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
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    swipeToSlide: true,
    centerMode: true,
    centerPadding: '0px',
    className: 'center-carousel',
    adaptiveHeight: true,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '0px',
          variableWidth: false,
          arrows: true
        }
      }
    ]
  };

  return (
    <div className="w-full mx-auto relative carousel-wrapper">
      <div className={`carousel-container relative ${isMobile ? 'mobile-carousel' : 'w-full'}`}>
        <Slider {...settings}>
          {React.Children.map(children, (child) => (
            <div className="carousel-item flex justify-center items-center">
              {child}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Slide;