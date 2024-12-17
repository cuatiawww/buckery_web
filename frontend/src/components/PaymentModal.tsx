/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Image from 'next/image';
import { Upload, AlertCircle, X } from 'lucide-react';
import { paymentService } from '@/services/api';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    cart?: { // Make cart optional to prevent type errors
      id: number;
      name: string;
      price: number;
      quantity: number;
    }[];
  };
  total: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, orderData, total }) => {
  const [selectedPayment, setSelectedPayment] = useState('bank');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const { clearCart } = useCart();
  const router = useRouter();
  const { items } = useCart();
  console.log('orderData:', orderData);

  const bankAccounts = [
    { bank: 'BCA', number: '7425211366', name: 'Yosua Elwistio Malau' },
    { bank: 'Mandiri', number: '0987654321', name: 'Yosua Elwistio Malau' },
  ];

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File terlalu besar. Maksimal 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Format file harus JPG atau PNG');
        return;
      }
      setPaymentProof(file);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (!paymentProof) {
      setError('Harap upload bukti pembayaran');
      return;
    }
  
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('customer_name', orderData.name);
      formData.append('phone', orderData.phone);
      formData.append('email', orderData.email);
      formData.append('address', orderData.address);
      
      // Format items sesuai yang diharapkan backend
      const itemsData = {
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image // Tambahkan image jika diperlukan
        }))
      };
      
      formData.append('items', JSON.stringify(itemsData));
      formData.append('total', total.toString());
      formData.append('payment_method', selectedPayment);
      formData.append('payment_proof', paymentProof);
      formData.append('status', 'pending');

      const response = await paymentService.createPayment(formData);
      console.log('Payment created:', response);
      
      clearCart(); 
      onClose();
      router.push('/orders'); // Update path ke /profile/orders
    } catch (error) {
      console.error('Upload error:', error);
      setError('Gagal mengupload bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Pembayaran</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-1">
            Total Pembayaran: <span className="font-bold">Rp {total.toLocaleString()}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Payment Method Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-4 py-2 font-semibold text-sm border-b-2 ${
                selectedPayment === 'bank'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedPayment('bank')}
            >
              Transfer Bank
            </button>
            <button
              className={`px-4 py-2 font-semibold text-sm border-b-2 ${
                selectedPayment === 'qris'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setSelectedPayment('qris')}
            >
              QRIS
            </button>
          </div>

          {/* Payment Method Content */}
          {selectedPayment === 'bank' ? (
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {bankAccounts.map((account) => (
                <div key={account.bank} className="border p-3 rounded-lg bg-white">
                  <p className="font-bold">{account.bank}</p>
                  <p className="text-lg font-mono">{account.number}</p>
                  <p className="text-sm text-gray-600">a.n {account.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
        <Image 
          src="/.png" // Ganti dengan QRIS image yang sebenarnya
          alt="QRIS Code"
          width={300}
          height={300}
          className="mx-auto mb-4 border-2 border-black rounded-lg"
        />
        <p className="font-bold">Scan QRIS code untuk pembayaran</p>
      </div>
          )}

          {/* Upload Section */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Bukti Pembayaran
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                id="payment-proof"
                accept="image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="payment-proof"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {paymentProof ? paymentProof.name : 'Klik untuk upload bukti pembayaran'}
                </span>
              </label>
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-600 mt-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="w-full bg-tertiary text-black font-bold py-3 px-4 rounded-xl border-2 border-black hover:bg-sky-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Mengunggah...' : 'Konfirmasi Pembayaran'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;