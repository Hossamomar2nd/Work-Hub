import React, { useState } from 'react';
import "./learnSlider.scss"

const LearnSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="learnSlider-container">
          <button className='previousButton' onClick={prevSlide}>
            <div className="learnLeftArrowContainer">
                <img className='leftArrow' src="/img/arrow.png" alt="" />
            </div>  
          </button>
      <img src={images[currentIndex]}/>
          <button className='nextButton' onClick={nextSlide}>
            <div className="learnRightArrowContainer">
                <img className='rightArrow' src="/img/arrow.png" alt="" />
            </div>  
          </button>
    </div>
  );
};

// Example usage
const learnApp = () => {
  const imageUrls = [
    '/img/img_1.png',
    '/img/img_2.png',
    '/img/img_3.png',
    // Add more image URLs as needed
  ];

  return (
    <div>
      <LearnSlider images={imageUrls} />
    </div>
  );
};

export default learnApp;