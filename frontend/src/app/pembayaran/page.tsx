'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentModal from '@/components/PaymentModal';

interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  orderData: OrderData; 
}

interface OrderData {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  deliveryMethod: string;
  cart?: { // Tambahkan cart sebagai opsional
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}


const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, shippingCost, orderData }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { items } = useCart();
  const total = subtotal + shippingCost;

  return (
    <>
      <div className="bg-primary rounded-3xl border-4 border-black p-6 space-y-4 relative">
        {/* Decorative element */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary rounded-full border-4 border-black"></div>
        
        <h3 className="font-black text-xl tracking-wide mb-4">RINGKASAN PEMBAYARAN</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-ChickenSoup text-lg">Total Harga</span>
            <span className="font-ChickenSoup text-lg">Rp {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-ChickenSoup text-lg">Ongkos Kirim</span>
            <span className="font-ChickenSoup text-lg">Rp {shippingCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t-4 border-black">
            <span className="font-black text-xl">TOTAL</span>
            <span className="font-black text-xl">Rp {total.toLocaleString()}</span>
          </div>
        </div>
        <button 
          onClick={() => setIsPaymentModalOpen(true)}
          className="w-full bg-tertiary hover:bg-primary text-black font-black py-3 px-6 rounded-full border-4 border-black transition-colors mt-4"
        >
          BAYAR SEKARANG
        </button>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={{
          ...orderData,
          cart: items
        }}
        total={total}
      />
    </>
  );
};
const PaymentPage = () => {
  const router = useRouter();
  const { items } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    const savedOrderData = localStorage.getItem('orderData');
    console.log('Saved Order Data:', savedOrderData); // Debug log
    if (!savedOrderData) {
      router.push('/datapemesanan');
      return;
    }
    setOrderData(JSON.parse(savedOrderData));
  }, [router]);

  if (!orderData) {
    return <div>Loading...</div>;
  }

  // Get shipping cost based on delivery method
  const getShippingCost = (method: string) => {
    const costs = {
      'pickup': 0,
      'local': 10000,
      'gojek': 15000,
      'courier': 20000
    };
    return costs[method as keyof typeof costs] || 0;
  };

  const shippingCost = getShippingCost(orderData.deliveryMethod);

  // Get delivery method label
  const getDeliveryLabel = (method: string) => {
    const labels = {
      'pickup': 'Pick Up (ambil sendiri)',
      'local': 'Antar (hanya daerah karawang)',
      'gojek': 'Go-Jek, Grab, Shopee food',
      'courier': 'Jarak jauh (JNE, JNT, Paxel)'
    };
    return labels[method as keyof typeof labels] || method;
  };

  return (
    <main className="min-h-screen bg-yellow-400 overflow-x-hidden">
      <Navbar />
      
      {/* Enhanced Header Section */}
      <div className="bg-yellow-400 pt-32 pb-16 relative">
        <div className="container mx-auto px-4">
          {/* Decorative elements */}
          <div className="absolute top-12 left-8 w-16 h-16 rounded-full bg-tertiary border-4 border-black animate-bounce delay-100"></div>
          <div className="absolute top-24 right-12 w-12 h-12 rounded-full bg-primary border-4 border-black animate-bounce delay-300"></div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-8 relative">
            <span className="relative inline-block">
              CHECKOUT
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto font-ChickenSoup">
            Selesaikan pesanan Anda dengan aman
          </p>
        </div>

        {/* Wave Border */}
        <div className="absolute bottom-50 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16" preserveAspectRatio="none">
            <path
              fill="#000000"
              d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16" preserveAspectRatio="none">
            <path
              fill="#F8E6C2"
              d="M0,64 C480,150 960,-20 1440,64 L1440,120 L0,120 Z"
            />
          </svg>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Store Info */}
              <div className="bg-secondary rounded-3xl border-4 border-black p-6 relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full border-4 border-black"></div>
                <h3 className="font-black text-xl tracking-wide">Dikirim dari : Buckery Store</h3>
              </div>
              
              {/* Shipping Method */}
              <div className="bg-primary rounded-3xl border-4 border-black p-6 relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary rounded-full border-4 border-black"></div>
                <h3 className="font-black text-xl tracking-wide">
                  Pengiriman : {getDeliveryLabel(orderData.deliveryMethod)}
                </h3>
              </div>

              {/* Recipient Info */}
              <div className="bg-primary rounded-3xl border-4 border-black p-6 relative space-y-3">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-secondary rounded-full border-4 border-black"></div>
                <h3 className="font-black text-xl tracking-wide mb-4">ALAMAT PENERIMA</h3>
                <p className="font-ChickenSoup text-lg">{orderData.name}</p>
                <p className="font-ChickenSoup text-lg">{orderData.phone}</p>
                <p className="font-ChickenSoup text-lg">{orderData.address}</p>
                {orderData.notes && (
                  <p className="font-ChickenSoup text-lg">Catatan : {orderData.notes}</p>
                )}
                {/* <Link 
                  href="/order-data"
                  className="inline-block bg-tertiary hover:bg-primary text-black font-black py-2 px-6 rounded-full border-4 border-black transition-colors mt-4"
                >
                  GANTI ALAMAT
                </Link> */}
              </div>

              {/* Order Details */}
              <div className="bg-primary rounded-3xl border-4 border-black p-6 relative">
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-tertiary rounded-full border-4 border-black"></div>
                <h3 className="font-black text-xl tracking-wide mb-6">DETAIL PESANAN</h3>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-6 bg-primary_bg rounded-2xl border-4 border-black p-4">
                      <div className="relative w-24 h-24">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-xl border-4 border-black"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-lg mb-1">{item.name}</h4>
                        <p className="font-ChickenSoup">Rp {item.price.toLocaleString()}</p>
                        <p className="font-ChickenSoup">Quantity: {item.quantity}</p>
                      </div>
                      <span className="font-black text-lg">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t-4 border-black">
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xl">SUB TOTAL</span>
                    <span className="font-black text-xl">Rp {subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <OrderSummary 
                subtotal={subtotal} 
                shippingCost={shippingCost} 
                orderData={orderData}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default PaymentPage;