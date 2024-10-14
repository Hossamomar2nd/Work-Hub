import React, { useState } from 'react';
import "./Slider.scss"

const Slider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // const imageUrls = [
  //   '/img/12.jpg',
  //   '/img/13.jpg',
  //   '/img/14.jpg',
  //   // Add more image URLs as needed
  // ];

  return (
    <div>
      <div className="slider-container">
        <button className="previousButton" onClick={prevSlide}>
          <div className="leftArrowContainer">
            <img className="leftArrow" src="/img/arrow.png" alt="" />
          </div>
        </button>
        <img src={images[currentIndex]} />
        <button className="nextButton" onClick={nextSlide}>
          <div className="rightArrowContainer">
            <img className="rightArrow" src="/img/arrow.png" alt="" />
          </div>
        </button>
      </div>
    </div>
  );
};

// // Example usage
// const App = () => {
//   const imageUrls = [
//     '/img/12.jpg',
//     '/img/13.jpg',
//     '/img/14.jpg',
//     // Add more image URLs as needed
//   ];

//   return (
//     <div>
//       <Slider images={imageUrls} />
//     </div>
//   );
// };

export default Slider;