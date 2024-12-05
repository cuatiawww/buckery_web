"use client";

import React from 'react';
import Image from 'next/image';

const WordingBuckery = () => {
  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-16 text-center">
        {/* Logo Container */}
        <div className="flex justify-center mb-8 md:mb-16">
          <Image
            src="/Logo.svg"
            alt="Buckery Logo"
            width={200}
            height={67}
            className="w-auto h-auto md:w-[300px]"
            priority
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto font-bold px-4 md:px-0">
          <p className="text-xl md:text-3xl leading-snug">
            KITA GAK CUMA JUAL ROTI, TAPI KITA NGE-RIZZ SNACK LO KE LEVEL NEXT.
          </p>
          
          <p className="text-xl md:text-3xl leading-snug">
            ROTI LEMBUT, MANIS-GURIH COMBO YANG BIKIN LO AUTO SKIBIDI DOPAMINE.
          </p>

          <p className="text-xl md:text-3xl leading-snug">
            SURE, LO PASTI TAU RASA ROTI.
            TAPI ROTI KITA TUH BEDA, TOP-TIER VIBES, GAK KAYAK ROTI BIASA DI MINIMARKET.
          </p>

          <p className="text-xl md:text-3xl leading-snug">
            SETIAP HARI, BUCKERY FRESH FROM THE OVEN.
            PESAN ONLINE? EASY BANGET. TINGGAL CLICK, DONE!
          </p>

          <p className="text-xl md:text-3xl leading-snug">
            KITA DI SINI BUAT NGASIH LO SNACK YANG WORTHY BUAT SIGMA VIBES LO.
          </p>

          <p className="text-xl md:text-3xl leading-snug">
            KARENA, BRO... HIDUP TUH TERLALU PENDEK BUAT ROTI BIASA-BIASA AJA.
          </p>

          <p className="text-xl md:text-3xl leading-snug font-black mt-8 md:mt-12">
            BUCKERY - BEYOND BREAD, BEYOND BASIC.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WordingBuckery;