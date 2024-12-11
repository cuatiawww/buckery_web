/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial, testimonialService } from '@/services/api';

// Komponen Card
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 w-[280px] md:w-72 bg-primary rounded-3xl shadow-lg p-2 border-4 border-black overflow-hidden mx-2 transition-all duration-300 hover:shadow-xl">
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
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

    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
      <h3 className="font-bold text-lg md:text-xl truncate">@{testimonial.username}</h3>
      <p className="text-sm leading-relaxed line-clamp-4">{testimonial.message}</p>
      <p className="font-bold text-sm truncate">{testimonial.tagline}</p>
    </div>
  </div>
);

// Loading placeholder sederhana
const LoadingCard = () => (
  <div className="flex-shrink-0 w-[280px] md:w-72 bg-primary rounded-3xl shadow-lg p-2 border-4 border-black overflow-hidden mx-2">
    <div className="w-full aspect-[4/3] rounded-2xl bg-gray-200 mb-4 animate-pulse" />
    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="h-20 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
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
    <section className="py-12 md:py-24 bg-bg-primary_bg">
      <div className="container mx-auto px-4 md:px-16">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-8 md:mb-16">
          TESTIMONIEZZZ
        </h2>
        
        <div className="relative">
          {/* Gradient overlay kiri */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-bg-primary_bg to-transparent z-10" />
          
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 md:pb-8 hide-scrollbar">
            <div className="flex gap-4 md:gap-6 px-4 md:px-8">
              {loading ? (
                // Tampilkan 3 loading card
                [...Array(3)].map((_, index) => (
                  <LoadingCard key={index} />
                ))
              ) : error ? (
                // Tampilan error
                <div className="flex items-center justify-center w-full min-h-[200px] text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : testimonials.length === 0 ? (
                // Tampilan kosong
                <div className="flex items-center justify-center w-full min-h-[200px] text-center">
                  <p className="text-gray-500">No testimonials available yet.</p>
                </div>
              ) : (
                // Tampilkan testimonial
                testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))
              )}
            </div>
          </div>
          
          {/* Gradient overlay kanan */}
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-bg-primary_bg to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;