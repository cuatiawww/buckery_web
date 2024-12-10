// src/components/TestimonyCard.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial, testimonialService } from '@/services/api';

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="flex-shrink-0 w-[280px] md:w-72 bg-primary rounded-3xl shadow-lg p-2 border-4 border-black overflow-hidden mx-2">
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
      {testimonial.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={testimonial.image}
          alt={`Testimonial by ${testimonial.username}`}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
    </div>

    <div className="p-3 md:p-4 space-y-2 md:space-y-3">
      <h3 className="font-bold text-lg md:text-xl">@{testimonial.username}</h3>
      <p className="text-sm leading-relaxed">{testimonial.message}</p>
      <p className="font-bold text-sm">{testimonial.tagline}</p>
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
        setTestimonials(data);
        setError(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      setError(err.response?.data?.message || 'Failed to load testimonials');
      // Hapus bagian data dummy untuk melihat error yang sebenarnya
      setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading testimonials...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-16">
        <h2 className="text-4xl md:text-6xl font-black text-center mb-8 md:mb-16">
          TESTIMONIEZZZ
        </h2>
        
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-bg-primary_bg to-transparent z-10" />
          
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 md:pb-8 hide-scrollbar">
            <div className="flex gap-4 md:gap-6 px-4 md:px-8">
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-bg-primary_bg to-transparent z-10" />
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;