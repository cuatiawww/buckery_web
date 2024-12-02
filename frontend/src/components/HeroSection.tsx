"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const HeroSection = () => {
  const images = [
    '/Pict1.jpg',
    '/Pict2.jpg',
    '/Pict3.jpg',
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto change image every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <main className="min-h-screen bg-primary relative overflow-hidden">
      <div className="container mx-auto px-16 pt-24">
        <div className="flex justify-between items-start">
          {/* Left Section */}
          <div className="relative z-20 max-w-xl mt-16">
            <h1 className="text-7xl font-black mb-6 leading-none">
              HI,<br />
              BUCKERIZZ...
            </h1>
            <p className="text-2xl  max-w-md font-ChickenSoup leading-relaxed text-black/90">
              Nikmati setiasai soft, sweet, dan gurih dari Buckery kini kesahatan. 
              Pesan online sekarang dan rasakan
              #LembutnyaMagis!
            </p>
            <button className="relative z-20 bg-tertiary text-black px-20 py-3 rounded-3xl hover:bg-secondary transition font-ChickenSoup text-2xl border-4 border-black">
              Order Now!!!
            </button>
          </div>

          {/* Right Section - Image Carousel */}
          <div className="relative">
            {/* Main Image */}
            <div className="w-[450px] h-[450px] rounded-3xl overflow-hidden border-4 border-black shadow-xl">
              <div className="relative w-full h-full">
                <Image
                  src={images[currentImageIndex]}
                  alt="Hero"
                  fill
                  className="object-cover transition-opacity duration-500"
                  priority
                />
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute -right-8 top-4 space-y-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-24 h-24 rounded-2xl overflow-hidden border-4 border-black shadow-lg cursor-pointer transition-transform ${
                    currentImageIndex === index 
                      ? 'scale-110 border-secondary' 
                      : 'hover:scale-105'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Yellow Wave */}
      <div className="absolute -bottom-[76px] left-0 right-0 z-0">
        <svg
          viewBox="0 0 1440 180"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#000000"
            d="M0,64L60,64C120,64,240,64,360,69.3C480,75,600,85,720,80C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,180L1380,180C1320,180,1200,180,1080,180C960,180,840,180,720,180C600,180,480,180,360,180C240,180,120,180,60,180L0,180Z"
          />
        </svg>
      </div>
      <div className="absolute -bottom-20 left-0 right-0 z-0">
        <svg
          viewBox="0 0 1440 180"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            fill="#F8E6C2"
            d="M0,64L60,64C120,64,240,64,360,69.3C480,75,600,85,720,80C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,180L1380,180C1320,180,1200,180,1080,180C960,180,840,180,720,180C600,180,480,180,360,180C240,180,120,180,60,180L0,180Z"
          />
        </svg>
      </div>
      
    </main>
  );
};

export default HeroSection;