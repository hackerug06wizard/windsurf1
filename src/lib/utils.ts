import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-UG', {
    style: 'currency',
    currency: 'UGX',
    minimumFractionDigits: 0,
  }).format(price);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function validatePhone(phone: string): boolean {
  const ugandaPhoneRegex = /^\+256[0-9]{9}$/;
  return ugandaPhoneRegex.test(phone);
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If already has +256, return as is
  if (cleaned.startsWith('256')) {
    return `+${cleaned}`;
  }
  
  // If starts with 0, add +256
  if (cleaned.startsWith('0')) {
    return `+256${cleaned.substring(1)}`;
  }
  
  // If starts with 256 without +, add +
  if (cleaned.startsWith('256') && !cleaned.startsWith('+256')) {
    return `+${cleaned}`;
  }
  
  return phone;
}

export function detectProvider(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // MTN Uganda numbers typically start with 077, 078, 039
  if (cleanPhone.startsWith('25677') || cleanPhone.startsWith('25678') || cleanPhone.startsWith('25639')) {
    return 'mtn';
  }
  
  // Airtel Uganda numbers typically start with 075, 070, 037
  if (cleanPhone.startsWith('25675') || cleanPhone.startsWith('25670') || cleanPhone.startsWith('25637')) {
    return 'airtel';
  }
  
  return 'unknown';
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
