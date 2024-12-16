'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { paymentService } from '@/services/api';

interface Payment {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  items: {
    items: {
      name: string;
      quantity: number;
      price: number;
    }[];
  };
  total: number;
  paymentMethod: string;
  paymentProof: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

const PaymentMonitorPage = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await paymentService.getAllPayments();
        setPayments(data);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, []);

  const handleUpdateStatus = async (paymentId: string, newStatus: 'confirmed' | 'rejected') => {
    try {
      await paymentService.updatePaymentStatus(paymentId, newStatus);
      
      setPayments(payments.map(payment => 
        payment.id === paymentId ? { ...payment, status: newStatus } : payment
      ));
      setSelectedPayment(null);
      setIsDetailModalOpen(false);
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const PaymentDetailModal = ({ payment }: { payment: Payment }) => (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Detail Pembayaran #{payment.orderNumber}</h3>
          <button 
            onClick={() => setIsDetailModalOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Informasi Pelanggan</h4>
            <div className="space-y-2">
              <p>Nama: {payment.customerName}</p>
              <p>Telepon: {payment.phone}</p>
              <p>Email: {payment.email}</p>
              <p>Alamat: {payment.address}</p>
            </div>

            <h4 className="font-semibold mt-4 mb-2">Detail Pesanan</h4>
            <div className="space-y-2">
              {payment.items.items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rp {item.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>Rp {payment.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Bukti Pembayaran</h4>
            <div className="border rounded-lg overflow-hidden">
              <div 
                className="w-full h-64 bg-center bg-cover cursor-pointer"
                style={{ backgroundImage: `url(${payment.paymentProof})` }}
                onClick={() => {
                  setSelectedPayment(payment);
                  setIsImageModalOpen(true);
                }}
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <p>Status: 
                <span className={`ml-2 font-semibold
                  ${payment.status === 'confirmed' ? 'text-green-600' : ''}
                  ${payment.status === 'rejected' ? 'text-red-600' : ''}
                  ${payment.status === 'pending' ? 'text-yellow-600' : ''}
                `}>
                  {payment.status.toUpperCase()}
                </span>
              </p>
              <p>Metode: {payment.paymentMethod === 'bank' ? 'Transfer Bank' : 'QRIS'}</p>
              <p>Tanggal: {payment.createdAt ? new Date(payment.createdAt).toLocaleString('id-ID') : '-'}</p>
            </div>

            {payment.status === 'pending' && (
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => handleUpdateStatus(payment.id, 'confirmed')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Konfirmasi Pembayaran
                </button>
                <button
                  onClick={() => handleUpdateStatus(payment.id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Tolak Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ImageModal = ({ payment }: { payment: Payment }) => (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button 
          onClick={() => setIsImageModalOpen(false)}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          ✕ Close
        </button>
        <div 
          className="w-full h-[80vh] bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: `url(${payment.paymentProof})` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="flex items-center text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-bold">Payment Monitoring</h1>
            <div className="w-24" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'confirmed'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg ${
              filter === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rejected
          </button>
        </div>

        {/* Payment List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rp {payment.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${payment.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                      ${payment.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                      ${payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    `}>
                      {payment.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedPayment(payment);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {selectedPayment && isDetailModalOpen && (
        <PaymentDetailModal payment={selectedPayment} />
      )}
      
      {selectedPayment && isImageModalOpen && (
        <ImageModal payment={selectedPayment} />
      )}
    </div>
  );
};

export default PaymentMonitorPage;