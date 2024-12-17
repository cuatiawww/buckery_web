/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial, testimonialService } from '@/services/api';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 w-[300px] md:w-80 transform transition-all duration-500 hover:-translate-y-2 relative">
    <div className="bg-primary rounded-[32px] border-4 border-black overflow-hidden relative">
      {/* Decorative corner */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
      
      {/* Image container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden border-b-4 border-black">
        {testimonial.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={testimonial.image}
            alt={`Testimonial by ${testimonial.username}`}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
        )}
      </div>

      {/* Content container */}
      <div className="p-6 space-y-4">
      <h3 className="font-bold text-lg md:text-xl truncate">@{testimonial.username}</h3>
      <p className="text-sm leading-relaxed line-clamp-4">{testimonial.message}</p>
      <p className="font-bold text-sm truncate">{testimonial.tagline}</p>
      </div>
    </div>
  </div>
);

const LoadingCard = () => (
  <div className="flex-shrink-0 w-[300px] md:w-80">
    <div className="bg-primary rounded-[32px] border-4 border-black overflow-hidden relative">
      {/* Decorative corner */}
      <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary border-4 border-black rounded-full"></div>
      
      <div className="w-full aspect-[4/3] bg-gray-200 animate-pulse border-b-4 border-black" />
      <div className="p-6 space-y-4">
        <div className="h-10 bg-gray-200 rounded-xl animate-pulse w-3/4" />
        <div className="h-24 bg-gray-200 rounded-xl animate-pulse" />
        <div className="h-8 bg-gray-200 rounded-xl animate-pulse w-1/2" />
      </div>
    </div>
  </div>
);

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const data = await testimonialService.getAllTestimonials();
        const activeTestimonials = data.filter(t => t.is_active);
        setTestimonials(activeTestimonials);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching testimonials:', err);
        setError('Unable to load testimonials. Please try again later.');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-primary_bg relative">
      {/* Decorative elements */}
      <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
      <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>
      
      <div className="container mx-auto px-4 md:px-16">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black relative inline-block">
            <span className="relative z-10">
              TESTIMONIEZZZ
            </span>
          </h2>
        </div>
        
        <div className="relative">
          {/* Left gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-primary_bg to-transparent z-10" />
          
          <div className="flex overflow-x-auto gap-6 md:gap-8 pb-8 hide-scrollbar">
            <div className="flex gap-6 md:gap-8 px-8">
              {loading ? (
                [...Array(3)].map((_, index) => (
                  <LoadingCard key={index} />
                ))
              ) : error ? (
                <div className="flex items-center justify-center w-full min-h-[300px]">
                  <div className="bg-red-200 p-6 rounded-3xl border-4 border-black">
                    <p className="font-ChickenSoup text-xl text-center">{error}</p>
                  </div>
                </div>
              ) : testimonials.length === 0 ? (
                <div className="flex items-center justify-center w-full min-h-[300px]">
                  <div className="bg-secondary p-6 rounded-3xl border-4 border-black">
                    <p className="font-ChickenSoup text-xl text-center">No testimonials available yet.</p>
                  </div>
                </div>
              ) : (
                testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))
              )}
            </div>
          </div>
          
          {/* Right gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-primary_bg to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;