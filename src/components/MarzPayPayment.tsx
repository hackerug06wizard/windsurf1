'use client';

import { useState } from 'react';
import { createCollection, validatePhoneNumber, formatPhoneNumber, detectProvider } from '@/lib/marzpay';
import { CartItem } from '@/types';

interface MarzPayPaymentProps {
  isOpen: boolean;
  items: CartItem[];
  total: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export default function MarzPayPayment({ isOpen, items, total, onSuccess, onError, onClose }: MarzPayPaymentProps) {
  const [formData, setFormData] = useState({
    phone_number: '',
    description: 'Payment for Mami Papa Babies & Kids products',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear phone error when user starts typing
    if (name === 'phone_number') {
      setPhoneError('');
    }
  };

  const validatePhone = () => {
    if (!formData.phone_number) {
      setPhoneError('Phone number is required');
      return false;
    }
    
    if (!validatePhoneNumber(formData.phone_number)) {
      setPhoneError('Please enter a valid Uganda phone number');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone()) {
      return;
    }

    setIsProcessing(true);

    try {
      const formattedPhone = formatPhoneNumber(formData.phone_number);
      const provider = detectProvider(formattedPhone);
      
      const result = await createCollection({
        amount: total,
        phone_number: formattedPhone,
        country: 'UG',
        reference: '', // Will be generated automatically
        description: formData.description,
        callback_url: 'https://mami-papa-store.onrender.com/api/payment-webhook',
      });

      if (result.status === 'success' && result.data?.transaction) {
        onSuccess(result.data.transaction.uuid);
        onClose();
      } else {
        onError(result.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const provider = detectProvider(formatPhoneNumber(formData.phone_number));
  const providerColor = provider === 'mtn' ? 'yellow' : provider === 'airtel' ? 'red' : 'gray';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Complete Payment</h2>
              <p className="text-sm text-gray-600 mt-1">Pay with Mobile Money</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b bg-gray-50">
            <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span className="font-medium">
                    UGX {(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t flex justify-between font-semibold">
                <span>Total Amount</span>
                <span className="text-pink-600">UGX {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  placeholder="0780123456 or +256780123456"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 pr-12 ${
                    phoneError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {formData.phone_number && provider !== 'unknown' && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className={`w-8 h-8 rounded-full bg-${providerColor}-100 flex items-center justify-center`}>
                      <span className={`text-xs font-bold text-${providerColor}-600`}>
                        {provider === 'mtn' ? 'M' : 'A'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {phoneError && (
                <p className="mt-2 text-sm text-red-600">{phoneError}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Enter your MTN Mobile Money or Airtel Money number
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Description (Optional)
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={255}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Payment for products"
              />
            </div>

            {/* Provider Info */}
            {formData.phone_number && provider !== 'unknown' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full bg-${providerColor}-100 flex items-center justify-center mr-3`}>
                    <span className={`text-sm font-bold text-${providerColor}-600`}>
                      {provider === 'mtn' ? 'M' : 'A'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money'}
                    </p>
                    <p className="text-xs text-gray-600">
                      You will receive a prompt on your phone to complete the payment
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing || !formData.phone_number}
                className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Pay UGX ${total.toLocaleString()}`
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="px-6 pb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.162V7.162c0-1.495-1.002-3.162-2.502-3.162H4.162C2.662 4 1.66 5.667 1.66 7.162v9.676c0 1.495 1.002 3.162 2.502 3.162h13.696c1.54 0 2.502-1.667 2.502-3.162V7.162c0-1.495-1.002-3.162-2.502-3.162z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Secure Payment</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    Your payment is processed securely through Marzpay. Never share your PIN with anyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
