"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HeroSection = () => {
  const images = ['/Pict1.jpg', '/Pict2.jpg', '/Pict3.jpg'];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      {/* Content section remains the same */}
      <div className="container mx-auto px-4 md:px-8 lg:px-16 pt-12 md:pt-24">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          {/* Left Section - with animations */}
          <div className={`relative z-20 max-w-xl mt-8 md:mt-16 text-center md:text-left transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
          }`}>
            <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-none animate-fade-in">
              <span className="inline-block animate-slide-up">HI,</span><br />
              <span className="inline-block animate-slide-up delay-200">BUCKERIZZ...</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-md font-ChickenSoup leading-relaxed text-black/90 mb-6 animate-fade-in delay-300">
              Nikmati setiasai soft, sweet, dan gurih dari Buckery kini kesahatan. 
              Pesan online sekarang dan rasakan
              #LembutnyaMagis!
            </p>
            <button className="relative z-20 bg-tertiary text-black px-12 md:px-20 py-3 rounded-3xl hover:bg-secondary transition-all duration-300 font-ChickenSoup text-xl md:text-2xl border-4 border-black transform hover:scale-105 hover:-translate-y-1 animate-bounce-in delay-500">
              Order Now!!!
            </button>
          </div>

          {/* Right Section - Image Carousel remains the same */}
          <div className={`relative mt-8 md:mt-0 transform transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}>
            {/* Main Image */}
            <div className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-3xl overflow-hidden border-4 border-black shadow-xl mx-auto transform hover:scale-[1.02] transition-transform duration-300">
              <div className="relative w-full h-full">
                <Image
                  src={images[currentImageIndex]}
                  alt="Hero"
                  fill
                  className="object-cover transition-all duration-700 transform hover:scale-110"
                  priority
                />
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex md:block space-x-4 md:space-x-0 md:space-y-4 justify-center mt-4 md:mt-0 md:absolute md:-right-8 md:top-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden border-4 border-black shadow-lg cursor-pointer transition-all duration-300 ${
                    currentImageIndex === index 
                      ? 'scale-110 border-secondary rotate-3' 
                      : 'hover:scale-105 hover:rotate-3'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Wave Section with separate mobile and desktop versions */}
      <div className="absolute w-full -bottom-[30] left-0 right-0 z-0">
        {/* Mobile Wave (hidden on desktop) */}
        <div className="md:hidden">
          <div className="relative h-[120px]">
            <svg
              viewBox="0 0 1440 320"
              className="absolute bottom-0 w-full"
              preserveAspectRatio="none"
              // style={{ transform: 'scale(1.2)' }}
            >
              <path
                fill="#000000"
                d="M0,160L26.7,154.7C53.3,149,107,139,160,154.7C213.3,171,267,213,320,218.7C373.3,224,427,192,480,181.3C533.3,171,587,181,640,181.3C693.3,181,747,171,800,181.3C853.3,192,907,224,960,229.3C1013.3,235,1067,213,1120,202.7C1173.3,192,1227,192,1280,197.3C1333.3,203,1387,213,1413,218.7L1440,224L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
              />
            </svg>
          </div>
          <div className="relative h-[120px] -mt-[40px]">
            <svg
              viewBox="0 0 1440 320"
              className="absolute bottom-0 w-full"
              preserveAspectRatio="none"
              // style={{ transform: 'scale(1.2)' }}
            >
              <path
                fill="#F8E6C2"
                d="M0,160L26.7,154.7C53.3,149,107,139,160,154.7C213.3,171,267,213,320,218.7C373.3,224,427,192,480,181.3C533.3,171,587,181,640,181.3C693.3,181,747,171,800,181.3C853.3,192,907,224,960,229.3C1013.3,235,1067,213,1120,202.7C1173.3,192,1227,192,1280,197.3C1333.3,203,1387,213,1413,218.7L1440,224L1440,320L1413.3,320C1386.7,320,1333,320,1280,320C1226.7,320,1173,320,1120,320C1066.7,320,1013,320,960,320C906.7,320,853,320,800,320C746.7,320,693,320,640,320C586.7,320,533,320,480,320C426.7,320,373,320,320,320C266.7,320,213,320,160,320C106.7,320,53,320,27,320L0,320Z"
              />
            </svg>
          </div>
        </div>

        {/* Desktop Wave (hidden on mobile) */}
        <div className="hidden md:block">
          <div className="relative h-[180px]">
            <svg
              viewBox="0 0 1440 320"
              className="absolute -bottom-[113] w-full h-full"
              preserveAspectRatio="none"
              // style={{ transform: 'scale(1.1)' }}
            >
              <path
                fill="#000000"
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
          <div className="relative h-[180px] -mt-[60px]">
            <svg
              viewBox="0 0 1440 320"
              className="absolute bottom-0 w-full h-full "
              preserveAspectRatio="none"
              // style={{ transform: 'scale(1.1)' }}
            >
              <path
                fill="#F8E6C2"
                d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HeroSection;