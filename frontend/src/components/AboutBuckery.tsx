"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const AboutBuckery = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-primary_bg">
      {/* Section Title
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black relative inline-block">
          <span className="relative z-10">
            TENTANG BUCKERY
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
          </span>
        </h2>
      </div> */}

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16">
          {/* Left Side - Phone Image */}
          <div className={`w-full md:w-1/2 flex justify-center transform transition-all duration-1000 
            ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="relative">
              {/* Decorative circles */}
              <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
              <div className="absolute -bottom-8 -right-8 w-12 h-12 rounded-full bg-secondary border-4 border-black animate-bounce delay-300"></div>
              
              {/* Phone container */}
              <div className="relative bg- rounded-[32px] p-4 transform transition-all duration-500 hover:-translate-y-2">
                {/* Decorative corner */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
                
                <Image 
                  src="/phone.svg"
                  alt="Phone App Preview"
                  width={320}
                  height={640}
                  className="w-auto h-auto"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right Side - Text Bubbles */}
          <div className={`w-full md:w-1/2 space-y-8 transform transition-all duration-1000 
            ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            {/* Chat bubble 1 */}
            <div className="max-w-md mx-auto transform transition-all duration-500 hover:-translate-y-2">
              <div className="bg-primary p-6 rounded-3xl border-4 border-black relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
                <p className="text-lg md:text-xl font-ChickenSoup text-center">
                &quot;Lagi craving roti yang lembut banget?&quot;
                </p>
              </div>
            </div>
            
            {/* Chat bubble 2 */}
            <div className="max-w-md mx-auto transform transition-all duration-500 hover:-translate-y-2">
              <div className="bg-secondary p-6 rounded-3xl border-4 border-black relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
                <p className="text-lg md:text-xl font-ChickenSoup text-center">
                &quot;Coba deh, Buckery! Manis, gurih, auto bikin happy&quot;
                </p>
              </div>
            </div>
            
            {/* Chat bubble 3 */}
            <div className="max-w-md mx-auto transform transition-all duration-500 hover:-translate-y-2">
              <div className="bg-tertiary p-6 rounded-3xl border-4 border-black relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-secondary border-4 border-black rounded-full"></div>
                <p className="text-lg md:text-xl font-ChickenSoup text-center">
                &quot;Pesan online aja, gampang banget! Yuk, gas sekarang&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBuckery;