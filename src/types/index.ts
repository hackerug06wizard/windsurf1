export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  inStock: boolean;
  age?: string;
  size?: string;
  color?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface MarzPayRequest {
  amount: number;
  phone_number: string;
  country: string;
  reference: string;
  description: string;
  callback_url: string;
}

export interface MarzPayResponse {
  status: string;
  message?: string;
  data?: {
    transaction: {
      uuid: string;
      reference: string;
      amount: number;
      phone_number: string;
      status: string;
      created_at: string;
    };
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  phone: string;
  isAdmin?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod?: string;
  createdAt: string;
}
