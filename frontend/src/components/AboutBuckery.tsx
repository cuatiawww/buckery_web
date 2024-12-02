"use client";

import React from 'react';
import Image from 'next/image';

const AboutBuckery = () => {
  return (
    <section className="relative bg-primary_bg">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-16">
        <div className="w-1/2 flex justify-center">
            <Image 
              src="/phone.svg"
              alt="Phone App Preview"
              width={320}
              height={640}
              className="w-auto h-auto"
              priority
            />
          </div>
          <div className="w-1/2 space-y-6 mt-[-50px]">
            <div className="bg-primary p-2 rounded-2xl shadow-lg max-w-md border-4 border-black">
              <p className="text-lg text-center">&quot;Lagi craving roti yang lembut banget?&quot;</p>
            </div>
            
            <div className="bg-secondary p-2 rounded-2xl shadow-lg max-w-md border-4 border-black">
              <p className="text-lg text-center">&quot;Coba deh, Buckery! Manis, gurih, auto bikin happy&quot;</p>
            </div>
            
            <div className="bg-secondary p-2 rounded-2xl shadow-lg max-w-md border-4 border-black">
              <p className="text-lg text-center">&quot;Pesan online aja, gampang banget! Yuk, gas sekarang&quot;</p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutBuckery;