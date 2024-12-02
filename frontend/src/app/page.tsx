// app/page.tsx
import React from 'react';
import AboutBuckery from '@/components/AboutBuckery';
import Footer from '@/components/Footer';
import PreviewMenu from '@/components/PreviewMenu';
import TestimonialsSection from '@/components/TestimonyCard';
import WordingBuckery from '@/components/WordingBuckery';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="relative">
      <HeroSection />

      {/* Mobile App Section */}
      <section className="py-16 bg-primary_bg">
        <div className="container mx-auto px-16">
          <AboutBuckery />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-primary_bg">
        <div className="container mx-auto px-16">
          <PreviewMenu />
        </div>
      </section>

      {/* Wording Section */}
      <section className="py-16 bg-primary_bg">
        <div className="container mx-auto px-16">
          <WordingBuckery />
        </div>
      </section>

      {/* Testimony Section */}
      <section className="py-16 bg-primary_bg">
        <div className="container mx-auto px-16">
          <TestimonialsSection />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}