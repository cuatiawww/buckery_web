import React from 'react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-primary overflow-hidden pb-48">
      {/* Content Container */}
      <div className="relative container mx-auto px-16 min-h-screen">
        {/* Left Section */}
        <div className="relative z-20 max-w-xl mt-32">
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
        <div className="absolute top-0 right-16 z-10">
          {/* Main Product Image */}
          <div className="relative">
            <div className="w-[450px] h-[450px] bg-white rounded-3xl overflow-hidden shadow-lg">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: 'url("/api/placeholder/450/450")' }}
                role="img"
                aria-label="Buckery Product"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="absolute -right-8 top-4 space-y-4">
              <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shadow-md">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: 'url("/api/placeholder/96/96")' }}
                  role="img"
                  aria-label="Product 1"
                />
              </div>
              <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shadow-md">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: 'url("/api/placeholder/96/96")' }}
                  role="img"
                  aria-label="Product 2"
                />
              </div>
              <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden shadow-md">
                <div 
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: 'url("/api/placeholder/96/96")' }}
                  role="img"
                  aria-label="Product 3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute -bottom-20 left-0 right-0 z-0">
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
      </div>
    </main>
  );
}