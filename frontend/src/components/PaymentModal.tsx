import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, AlertCircle, X, CheckCircle } from 'lucide-react';
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
    cart?: {
      id: number;
      name: string;
      price: number;
      quantity: number;
    }[];
  };
  total: number;
}

const SuccessNotification = ({ onClose }: { onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timeout = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" 
           style={{ opacity: isVisible ? 1 : 0 }} />
      <div className={`relative bg-primary_bg rounded-3xl border-4 border-black p-8 max-w-md w-full shadow-lg transform transition-all duration-300 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        {/* Decorative elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 bg-tertiary rounded-full border-4 border-black rotate-12"></div>
        
        <div className="mb-6 animate-bounce">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
        </div>
        <div className="bg-tertiary rounded-2xl border-4 border-black p-6 mb-6">
          <h3 className="text-2xl font-black mb-3 tracking-wide text-center">
            PESANAN BERHASIL DIBUAT!
          </h3>
          <p className="font-ChickenSoup text-lg text-center">
            Silahkan menunggu konfirmasi selanjutnya. Jika belum ada konfirmasi dalam 1x24 jam, 
            Anda bisa menghubungi kami melalui menu kontak kami.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="h-3 w-3 bg-primary rounded-full animate-pulse border-2 border-black"></div>
          <div className="h-3 w-3 bg-secondary rounded-full animate-pulse delay-100 border-2 border-black"></div>
          <div className="h-3 w-3 bg-tertiary rounded-full animate-pulse delay-200 border-2 border-black"></div>
        </div>
      </div>
    </div>
  );
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, orderData, total }) => {
  const [selectedPayment, setSelectedPayment] = useState('bank');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter();
  const { items } = useCart();

  const bankAccounts = [
    { bank: 'BCA', number: '7425211366', name: 'Yosua Elwistio Malau' },
    { bank: 'Mandiri', number: '1730015246243', name: 'Yosua Elwistio Malau' },
  ];

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
      
      const itemsData = {
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
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
      setShowSuccess(true);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Gagal mengupload bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    router.push('/orders');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-primary_bg rounded-3xl border-4 border-black w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="sticky top-0 bg-primary rounded-t-3xl border-b-4 border-black px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-wide">PEMBAYARAN</h2>
              <button 
                onClick={onClose} 
                className="bg-tertiary hover:bg-primary w-10 h-10 rounded-full border-4 border-black font-bold transition-colors flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="font-ChickenSoup text-lg mt-2">
              Total Pembayaran: <span className="font-black">Rp {total.toLocaleString()}</span>
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Payment Method Selector */}
            <div className="bg-secondary rounded-2xl border-4 border-black p-4">
              <div className="flex space-x-4">
                <button
                  className={`flex-1 py-3 px-6 rounded-full border-4 border-black font-black transition-colors ${
                    selectedPayment === 'bank' 
                      ? 'bg-tertiary' 
                      : 'bg-primary_bg hover:bg-primary'
                  }`}
                  onClick={() => setSelectedPayment('bank')}
                >
                  TRANSFER BANK
                </button>
                <button
                  className={`flex-1 py-3 px-6 rounded-full border-4 border-black font-black transition-colors ${
                    selectedPayment === 'qris' 
                      ? 'bg-tertiary' 
                      : 'bg-primary_bg hover:bg-primary'
                  }`}
                  onClick={() => setSelectedPayment('qris')}
                >
                  QRIS
                </button>
              </div>
            </div>

            {/* Payment Details */}
            {selectedPayment === 'bank' ? (
              <div className="bg-primary rounded-2xl border-4 border-black p-6 space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.bank} className="bg-primary_bg rounded-xl border-4 border-black p-4">
                    <p className="font-black text-xl mb-2">{account.bank}</p>
                    <p className="font-ChickenSoup text-2xl mb-1">{account.number}</p>
                    <p className="font-ChickenSoup">a.n {account.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary rounded-2xl border-4 border-black p-6 text-center">
                <Image 
                  src="/qris.jpg"
                  alt="QRIS Code"
                  width={300}
                  height={300}
                  className="mx-auto mb-4 rounded-xl border-4 border-black"
                />
                <p className="font-black text-xl">Scan QRIS code untuk pembayaran</p>
              </div>
            )}

            {/* Upload Section */}
            <div className="bg-secondary rounded-2xl border-4 border-black p-6">
              <label className="block font-black text-xl mb-4 tracking-wide">
                UPLOAD BUKTI PEMBAYARAN
              </label>
              <div className="border-4 border-dashed border-black rounded-xl p-6 bg-primary_bg">
                <input
                  type="file"
                  id="payment-proof"
                  accept="image/jpeg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="payment-proof"
                  className="cursor-pointer flex flex-col items-center space-y-3"
                >
                  <div className="bg-tertiary p-3 rounded-full border-4 border-black">
                    <Upload className="h-8 w-8" />
                  </div>
                  <span className="font-ChickenSoup text-lg text-center">
                    {paymentProof ? paymentProof.name : 'Klik untuk upload bukti pembayaran'}
                  </span>
                </label>
              </div>

              {error && (
                <div className="flex items-center space-x-2 mt-3 bg-red-400 text-black p-3 rounded-xl border-4 border-black">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-ChickenSoup">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-primary_bg px-6 py-4 border-t-4 border-black rounded-b-3xl">
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="w-full bg-tertiary hover:bg-primary text-black font-black py-3 px-6 rounded-full border-4 border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'MENGUNGGAH...' : 'KONFIRMASI PEMBAYARAN'}
            </button>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessNotification onClose={handleSuccessClose} />}
    </>
  );
};

export default PaymentModal;