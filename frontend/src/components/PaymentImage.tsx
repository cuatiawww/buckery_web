import React, { useState } from 'react';
import Image from 'next/image';

interface PaymentImageProps {
  paymentProof: string | null;
  className?: string;
  onClick?: () => void;
  baseUrl?: string;
}

const PaymentImage = ({ 
  paymentProof, 
  className = "", 
  onClick = () => {},
  baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
}: PaymentImageProps) => {
  const [hasError, setHasError] = useState(false);
  
  const getImageUrl = (proof: string | null): string => {
    if (!proof) return '/placeholder-payment.png';
    if (proof.startsWith('http')) return proof;
    if (proof.startsWith('/')) return `${baseUrl}${proof}`;
    return `${baseUrl}/media/payment_proofs/${proof}`;
  };

  const imageUrl = hasError ? '/placeholder-payment.png' : getImageUrl(paymentProof);

  return (
    <Image
      src={imageUrl}
      alt="Bukti Pembayaran"
      fill
      className={`object-contain ${className}`}
      onClick={onClick}
      onError={() => setHasError(true)}
      unoptimized={true} // Penting: tambahkan ini untuk menghindari optimisasi Next.js
    />
  );
};

export default PaymentImage;