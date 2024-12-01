import Footer from '@/components/Footer';
import PreviewMenu from '@/components/PreviewMenu';
import TestimonialsSection from '@/components/TestimonyCard';
import WordingBuckery from '@/components/WordingBuckery';
import React from 'react';

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <main className="min-h-screen bg-primary relative overflow-hidden">
        <div className="container mx-auto px-16 pt-24 pb-48">
          {/* Left Section */}
          <div className="relative z-20 max-w-xl mt-16">
            <h1 className="text-7xl font-black mb-6 leading-none">
              HI,<br />
              BUCKERIZZ...
            </h1>
            <p className="text-2xl mb-12 max-w-md font-ChickenSoup leading-relaxed text-black/90">
              Nikmati setiasai soft, sweet, dan gurih dari Buckery - 
              kini kesahatan. Pesan online sekarang dan rasakan 
              #LembutnyaMagis!
            </p>
            <button className="relative z-20 bg-tertiary text-black px-12 py-3 rounded-full hover:bg-secondary transition font-ChickenSoup text-2xl border-4 border-black">
              Order Now!!!
            </button>
          </div>

          {/* Right Section - Images */}
          <div className="absolute top-24 right-16 z-10">
            <div className="relative">
              <div className="w-[450px] h-[450px] bg-white rounded-3xl overflow-hidden shadow-xl">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: 'url("/api/placeholder/450/450")' }}
                  role="img"
                  aria-label="Buckery Product"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="absolute -right-8 top-4 space-y-4">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="w-24 h-24 bg-white rounded-2xl overflow-hidden shadow-lg">
                    <div 
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: 'url("/api/placeholder/96/96")' }}
                      role="img"
                      aria-label={`Product ${num}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Yellow Wave */}
        <div className="absolute -bottom-1 left-0 right-0 z-0">
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

      {/* Mobile App Section */}
      <section className="relative bg-primary_bg pt-24 pb-48">
        <div className="container mx-auto px-16">
          <div className="flex items-center justify-between gap-16">
            <div className="w-1/2">
              <h2 className="text-6xl font-black mb-12">DOWNLOAD OUR APP!</h2>
              {/* Feature Frames */}
              <div className="space-y-8">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="bg-white p-8 rounded-2xl shadow-lg max-w-md border-2 border-black/10">
                    <h3 className="text-2xl font-bold mb-3">Feature {num}</h3>
                    <p className="text-lg text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex justify-center">
              <div className="w-[320px] h-[640px] bg-white rounded-[3rem] shadow-2xl border-8 border-black/10">
                <div 
                  className="w-full h-full bg-cover bg-center rounded-[2.5rem]"
                  style={{ backgroundImage: 'url("/api/placeholder/320/640")' }}
                  role="img"
                  aria-label="Mobile App Screenshot"
                />
              </div>
            </div>
          </div>
        </div>

        {/* White Wave */}
        {/* <div className="absolute -bottom-1 left-0 right-0">
          <svg 
            viewBox="0 0 1440 180" 
            className="w-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#FFFFFF"
              d="M0,64L60,64C120,64,240,64,360,69.3C480,75,600,85,720,80C840,75,960,53,1080,48C1200,43,1320,53,1380,58.7L1440,64L1440,180L1380,180C1320,180,1200,180,1080,180C960,180,840,180,720,180C600,180,480,180,360,180C240,180,120,180,60,180L0,180Z"
            />
          </svg>
        </div> */}
      </section>

      {/* Categories Section */}
      <section className="bg-primary_bg">
  <div className="container mx-auto px-16">
    <PreviewMenu />
  </div>
</section>
{/* Wording Section */}
<section className="bg-primary_bg ">
  <div className="container mx-auto px-16">
  <WordingBuckery />
  </div>\
</section>
{/* Testimony Section */}
<section className="bg-primary_bg">
  <div className="container mx-auto px-16">
  <TestimonialsSection />
  </div>
</section>
{/* Footer */}
  <Footer />

    </div>
  );
}