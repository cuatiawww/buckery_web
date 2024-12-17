'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentImage from '@/components/PaymentImage';

interface ImageModalProps {
  paymentProof: string;
  onClose: () => void;
}

interface Order {
  id: string;
  orderNumber: string;
  items: {
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
  };
  total: number;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  paymentMethod: string;
  paymentProof: string;
}

const OrderStatusPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { isAuthenticated, userType } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (userType === 'ADMIN') {
      if (pathname === '/orders') {
        router.push('/admin/paymentmonitor');
        return;
      }
    } else if (userType === 'USER') {
      if (pathname === '/admin/paymentmonitor') {
        router.push('/orders');
        return;
      }
    }

    const fetchOrders = async () => {
      try {
        const data = await paymentService.getAllPayments();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router, userType, pathname]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-tertiary border-black text-black';
      case 'rejected':
        return 'bg-red-400 border-black text-black';
      default:
        return 'bg-primary border-black text-black';
    }
  };

  const OrderDetailModal = ({ order }: { order: Order }) => {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="my-8">
          <div className="bg-primary_bg rounded-3xl border-4 border-black max-w-2xl w-full relative shadow-lg max-h-[80vh] overflow-y-auto scrollbar-hide">
            {/* Static header */}
            <div className="bg-primary rounded-t-3xl border-b-4 border-black p-6 flex justify-between items-center">
              <h3 className="text-2xl font-black tracking-wide">
                DETAIL PEMBAYARAN #{order.orderNumber}
              </h3>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-tertiary hover:bg-primary w-10 h-10 rounded-full border-4 border-black font-bold transition-colors flex items-center justify-center"
              >
                ✕
              </button>
            </div>
  
            <div className="p-6 space-y-6">
              {/* Products Section */}
              <div className="bg-primary rounded-3xl border-4 border-black p-6">
                <h4 className="font-black text-xl mb-4 tracking-wide">DETAIL PRODUK</h4>
                <div className="space-y-4">
                  {order.items.items?.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center border-b-2 border-black border-dashed pb-3"
                    >
                      <span className="font-ChickenSoup text-lg">{item.name} x{item.quantity}</span>
                      <span className="font-ChickenSoup text-lg">Rp {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 items-center">
                    <span className="font-black text-xl tracking-wide">TOTAL</span>
                    <span className="font-black text-xl">Rp {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
  
              {/* Payment Proof Section */}
              <div className="bg-secondary rounded-3xl border-4 border-black p-6">
                <h4 className="font-black text-xl mb-4 tracking-wide">BUKTI PEMBAYARAN</h4>
                <div className="rounded-2xl border-4 border-black overflow-hidden">
                  <div className="relative w-full h-64">
                    <PaymentImage
                      paymentProof={order.paymentProof}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsImageModalOpen(true);
                      }}
                    />
                  </div>
                </div>
              </div>
  
              {/* Order Details Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-tertiary rounded-2xl border-4 border-black p-4">
                  <p className="font-black mb-2 tracking-wide">METODE PEMBAYARAN</p>
                  <p className="font-ChickenSoup text-lg">
                    {order.paymentMethod === 'bank' ? 'Transfer Bank' : 'QRIS'}
                  </p>
                </div>
                <div className="bg-primary rounded-2xl border-4 border-black p-4">
                  <p className="font-black mb-2 tracking-wide">STATUS</p>
                  <span className={`px-4 py-2 rounded-full border-4 text-sm font-black inline-block ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2 bg-secondary rounded-2xl border-4 border-black p-4">
                  <p className="font-black mb-2 tracking-wide">TANGGAL PEMESANAN</p>
                  <p className="font-ChickenSoup text-lg">
                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const styles = `
    .scrollbar-hide {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;  /* Chrome, Safari and Opera */
    }
  `;
  
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }

  const ImageModal = ({ paymentProof, onClose }: ImageModalProps) => {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          <button 
            onClick={onClose}
            className="absolute -top-16 right-0 bg-tertiary hover:bg-primary px-6 py-3 rounded-full border-4 border-black font-black transition-colors text-black"
          >
            ✕ Close
          </button>
          <div className="relative w-full h-[80vh] rounded-3xl border-4 border-black overflow-hidden">
            <PaymentImage paymentProof={paymentProof} />
          </div>
        </div>
      </div>
    );
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
              STATUS PESANAN
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-black transform skew-x-12"></div>
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-center max-w-2xl mx-auto font-ChickenSoup">
            Pantau status pesanan Anda dengan mudah
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
          {orders.length > 0 ? (
            <div className="bg-primary rounded-3xl border-4 border-black overflow-hidden shadow-lg">
              {orders.map((order, index) => (
                <div 
                  key={order.id}
                  className={`p-6 ${index !== orders.length - 1 ? 'border-b-4 border-black' : ''} hover:bg-secondary transition-colors cursor-pointer relative`}
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailModalOpen(true);
                  }}
                >
                  {/* Decorative dot */}
                  <div className="absolute top-6 right-6 w-4 h-4 rounded-full bg-tertiary border-2 border-black"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="md:col-span-2">
                      <p className="font-black text-lg">Order #{order.orderNumber}</p>
                      <p className="font-ChickenSoup">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div>
                      <p className="font-ChickenSoup">Total Pembayaran</p>
                      <p className="font-black text-lg">Rp {order.total.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full border-4 text-sm font-black inline-block ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-primary rounded-3xl border-4 border-black p-8 inline-block relative">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-tertiary rounded-full border-4 border-black rotate-12"></div>
                <p className="font-ChickenSoup text-xl mb-6">Anda belum memiliki pesanan</p>
                <Link 
                  href="/menu"
                  className="bg-tertiary text-black font-black py-3 px-6 rounded-full border-4 border-black hover:bg-primary transition-colors inline-block"
                >
                  Mulai Berbelanja
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && isDetailModalOpen && (
        <OrderDetailModal order={selectedOrder} />
      )}
      
      {selectedOrder && isImageModalOpen && (
        <ImageModal 
          paymentProof={selectedOrder.paymentProof}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}

      <Footer />
    </main>
  );
};

export default OrderStatusPage;