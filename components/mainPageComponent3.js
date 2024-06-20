import React, { useState, useEffect } from 'react';

export default function MainPageComponent3() {

  const images = [
    "/images/mainpage/DogVariation1.png",
    "/images/mainpage/DogVariation2.png",
    "/images/mainpage/DogVariation3.png",
    "/images/mainpage/DogVariation4.png",
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="pt-60">
      <div className="flex">
        <div className='w-1/3'></div>
       
        <div className="w-1/3 pt-32">
          <div className="text-4xl font-semibold">Image Variation</div>
          <div className="text-sm pt-2 text-slate-400 w-5/6">
            Get variations of your images by simply dragging.
          </div>
          <div className="mt-4">
            <button onClick={() => window.location.href = '/image-variations'} className="button-34 hover:opacity-90">
              Image Variation
            </button>
          </div>
        </div>
        <div className="w-1/3">
        {images.map((src, index) => (
        <img
          key={index}
          src={src}
          className={`w-1/4 border border-transparent rounded-3xl absolute transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transition: 'opacity 1s ease-in-out' }}
        />
      ))}
        </div>
      </div>
    </div>
  );
}
