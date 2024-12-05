"use client";

import React from 'react';
import Image from 'next/image';

const TestimonialCard = () => (
  <div className="flex-shrink-0 w-[280px] md:w-72 bg-primary rounded-3xl shadow-lg p-2 border-4 border-black overflow-hidden mx-2">
    {/* Image Container with proper aspect ratio */}
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
      <Image
        src="/Pict1.jpg"
        alt="Customer Testimonial"
        fill
        className="object-cover"
        priority
      />
    </div>

    {/* Content */}
    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
      <h3 className="font-bold text-lg md:text-xl">@username</h3>
      <p className="text-sm leading-relaxed">
        Rotinya lembut banget! Isinya pas, gak pelit-pelit. Worth it sih buat jadi comfort food!
      </p>
      <p className="font-bold text-sm">COMFORT FOOD!</p>
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-16">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-8 md:mb-16">
          TESTIMONIEZZZ
        </h2>
        
        {/* Scrollable Container */}
        <div className="relative">
          {/* Gradient Fade - Left */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-bg-primary_bg to-transparent z-10" />
          
          {/* Testimonials */}
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 md:pb-8 hide-scrollbar">
            <div className="flex gap-4 md:gap-6 px-4 md:px-8">
              {Array(8).fill(null).map((_, index) => (
                <TestimonialCard key={index} />
              ))}
            </div>
          </div>
          
          {/* Gradient Fade - Right */}
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-bg-primary_bg to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;