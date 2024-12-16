/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { paymentService } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
    const { isAuthenticated, userType } = useAuth(); // Tambahkan userType
    const router = useRouter();
    const pathname = usePathname();
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
  
    // Perbaiki path untuk user
    if (userType === 'ADMIN') {
      if (pathname === '/profile/orders') {
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
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const OrderDetailModal = ({ order }: { order: Order }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Detail Pesanan #{order.orderNumber}</h3>
          <button 
            onClick={() => setIsDetailModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Detail Produk</h4>
            <div className="space-y-2">
              {order.items.items?.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rp {item.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold pt-2">
                <span>Total</span>
                <span>Rp {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Bukti Pembayaran</h4>
            <div className="border rounded-lg overflow-hidden">
              <img 
                src={order.paymentProof} 
                alt="Payment Proof"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-semibold">Metode Pembayaran:</p>
              <p>{order.paymentMethod === 'bank' ? 'Transfer Bank' : 'QRIS'}</p>
            </div>
            <div>
              <p className="font-semibold">Status:</p>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold">Tanggal Pemesanan:</p>
              <p>{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-yellow-400">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary pt-24 pb-16 relative">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center">Status Pesanan</h1>
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

      {/* Content */}
      <div className="bg-primary_bg">
        <div className="container mx-auto px-4 py-16">
          {orders.length > 0 ? (
            <div className="bg-white rounded-xl border-4 border-black overflow-hidden">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="font-semibold">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="font-semibold">Total</p>
                      <p>Rp {order.total.toLocaleString()}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="font-semibold">Metode</p>
                      <p>{order.paymentMethod === 'bank' ? 'Transfer Bank' : 'QRIS'}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Anda belum memiliki pesanan</p>
              <Link 
                href="/menu"
                className="bg-tertiary text-black font-bold py-2 px-4 rounded-xl border-4 border-black hover:bg-primary transition-colors inline-block"
              >
                Mulai Berbelanja
              </Link>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && isDetailModalOpen && (
        <OrderDetailModal order={selectedOrder} />
      )}

      <Footer />
    </main>
  );
};

export default OrderStatusPage;