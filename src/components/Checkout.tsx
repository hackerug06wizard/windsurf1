'use client';

import { useState } from 'react';
import { CartItem } from '@/types';
import { formatPrice, validatePhone, validateEmail } from '@/lib/utils';
import { MARZPAY_API_URL, CURRENCY } from '@/lib/constants';

interface CheckoutProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
  onCheckout?: () => void;
}

export default function Checkout({ isOpen, items, onClose, onSuccess, onCheckout }: CheckoutProps) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'details' | 'payment' | 'processing'>('details');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!customerInfo.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!validateEmail(customerInfo.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!validatePhone(customerInfo.phone)) {
      setError('Please enter a valid phone number (format: +256xxxxxxxxx)');
      return false;
    }
    return true;
  };

  const handleMarzPay = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setError('');
    setStep('processing');

    try {
      const reference = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const response = await fetch(`${MARZPAY_API_URL}/collect-money`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic YOUR_API_CREDENTIALS', // Replace with actual credentials
        },
        body: JSON.stringify({
          amount: total,
          phone_number: customerInfo.phone,
          country: 'UG',
          reference,
          description: `Payment for ${items.length} items from Mami Papa Babies & Kids`,
          callback_url: `${window.location.origin}/api/payment-webhook`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Trigger Meta Pixel Purchase event
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'Purchase', {
            value: total,
            currency: CURRENCY,
            content_ids: items.map(item => item.product.id),
            content_type: 'product',
          });
        }

        // Trigger Google Ads conversion
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'conversion', {
            send_to: 'AW-17957602155/YourConversionLabel',
            value: total,
            currency: CURRENCY,
            transaction_id: reference,
          });
        }

        setStep('payment');
        // In a real implementation, you would show payment status
        // and handle the webhook response
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } else {
        setError(result.error || 'Payment failed. Please try again.');
        setStep('details');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  if (step === 'processing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'payment') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">Thank you for your order. You will receive a confirmation message shortly.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Checkout</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Order Summary</h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-pink-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Customer Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="+256xxxxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: +256xxxxxxxxx (for Uganda numbers)
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <button
              onClick={handleMarzPay}
              disabled={isProcessing}
              className="w-full py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Payment powered by Marzpay - MTN, Airtel & Bank transfers supported
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
