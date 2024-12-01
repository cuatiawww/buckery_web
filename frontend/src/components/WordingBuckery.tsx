"use client";

import React from 'react';
import Image from 'next/image';

const WordingBuckery = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-16 text-center">
        {/* Logo Container */}
        <div className="flex justify-center mb-16">
          <Image
            src="/Logo.svg"
            alt="Buckery Logo"
            width={300}
            height={100}
            priority
          />
        </div>

        {/* Text Content */}
        <div className="space-y-8 max-w-4xl mx-auto font-bold">
          <p className="text-3xl">
            KITA GAK CUMA JUAL ROTI, TAPI KITA NGE-RIZZ SNACK LO KE LEVEL NEXT.
          </p>
          
          <p className="text-3xl">
            ROTI LEMBUT, MANIS-GURIH COMBO YANG BIKIN LO AUTO SKIBIDI DOPAMINE.
          </p>

          <p className="text-3xl">
            SURE, LO PASTI TAU RASA ROTI.
            TAPI ROTI KITA TUH BEDA, TOP-TIER VIBES, GAK KAYAK ROTI BIASA DI MINIMARKET.
          </p>

          <p className="text-3xl">
            SETIAP HARI, BUCKERY FRESH FROM THE OVEN.
            PESAN ONLINE? EASY BANGET. TINGGAL CLICK, DONE!
          </p>

          <p className="text-3xl">
            KITA DI SINI BUAT NGASIH LO SNACK YANG WORTHY BUAT SIGMA VIBES LO.
          </p>

          <p className="text-3xl">
            KARENA, BRO... HIDUP TUH TERLALU PENDEK BUAT ROTI BIASA-BIASA AJA.
          </p>

          <p className="text-3xl font-black mt-12">
            BUCKERY - BEYOND BREAD, BEYOND BASIC.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WordingBuckery;