'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  const { items } = useCart(); // Tambahkan ini
  const total = subtotal + shippingCost;

  const handlePayment = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <div className="bg-primary rounded-xl border-2 border-black p-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">Total harga</span>
          <span className="font-bold">Rp {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold">Ongkos Kirim</span>
          <span className="font-bold">Rp {shippingCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t-2 border-black">
          <span className="font-bold">Total Keseluruhan</span>
          <span className="font-bold">Rp {total.toLocaleString()}</span>
        </div>
        <button 
          onClick={handlePayment}
          className="w-full bg-tertiary text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-sky-300 transition-colors mt-4"
        >
          Bayar
        </button>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderData={{
          ...orderData,
          cart: items // Pass cart items dari useCart
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
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary pt-24 pb-16 relative">
      <div className="container mx-auto px-4 flex justify-between items-center mb-8">
        <Link href="/datapemesanan" className="flex items-center text-black">
          <Image src="/direct-left.svg" alt="Back" width={60} height={40} priority />
          <span className="text-xl font-bold">KEMBALI</span>
        </Link>
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black">Checkout</h1>
        </div>
        
        <div className="w-[144px]" />
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

      {/* Main Content */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-4">
              {/* Store Info */}
              <div className="bg-secondary rounded-xl border-2 border-black p-4">
                <h3 className="font-bold mb-2">Dikirim dari : Buckery Store</h3>
              </div>
              
              {/* Shipping Method */}
              <div className="bg-primary rounded-xl border-2 border-black p-4">
                <h3 className="font-bold mb-2">
                  Pengiriman : {getDeliveryLabel(orderData.deliveryMethod)}
                </h3>
              </div>

              {/* Recipient Info */}
              <div className="bg-primary rounded-xl border-2 border-black p-4 space-y-2">
                <h3 className="font-bold mb-4">Alamat Penerima</h3>
                <p className="font-bold">{orderData.name}</p>
                <p className="font-bold">{orderData.phone}</p>
                <p className="font-bold">{orderData.address}</p>
                {orderData.notes && (
                  <p className="text-gray-600">Catatan : {orderData.notes}</p>
                )}
                <Link 
                  href="/order-data"
                  className="inline-block bg-secondary text-black font-bold py-2 px-4 rounded-xl border-2 border-black hover:bg-sky-300 transition-colors mt-2"
                >
                  Ganti Alamat
                </Link>
              </div>

              {/* Order Details */}
              <div className="bg-primary rounded-xl border-2 border-black p-4">
                <h3 className="font-bold mb-4">Detail Pesanan</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg border-2 border-black"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-gray-600">Rp {item.price.toLocaleString()}</p>
                        <p>Quantity : {item.quantity}</p>
                      </div>
                      <span className="font-bold">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t-2 border-black">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Sub Total :</span>
                    <span className="font-bold">Rp {subtotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
  <OrderSummary 
    subtotal={subtotal} 
    shippingCost={shippingCost} 
    orderData={orderData}  // Menambahkan orderData yang diperlukan
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