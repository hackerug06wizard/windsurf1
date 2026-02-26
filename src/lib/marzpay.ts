// Marzpay API Integration
const API_BASE_URL = 'https://wallet.wearemarz.com/api/v1';
const API_KEY = 'marz_ZfdKiQYeolMHgoNj';
const API_SECRET = 'eNKmvTVHMP5bFYMSkJpryxn8xDhclEJO';

// Create Base64 authorization header
const authHeader = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

export interface MarzPayRequest {
  amount: number;
  phone_number: string;
  country: string;
  reference: string;
  description?: string;
  callback_url?: string;
}

export interface MarzPayResponse {
  status: string;
  message: string;
  data: {
    transaction: {
      uuid: string;
      reference: string;
      status: string;
      provider_reference: string | null;
    };
    collection: {
      amount: {
        formatted: string;
        raw: number;
        currency: string;
      };
      provider: string;
      phone_number: string;
      mode: string;
    };
    timeline: {
      initiated_at: string;
      estimated_settlement: string;
    };
  };
}

export interface MarzPayService {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
}

// Generate UUID v4 for reference
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Create a collection
export async function createCollection(request: MarzPayRequest): Promise<MarzPayResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/collect-money`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        // Ensure reference is a valid UUID
        reference: request.reference || generateUUID(),
        // Set default callback URL if not provided
        callback_url: request.callback_url || 'https://mami-papa-store.onrender.com/api/payment-webhook',
      }),
    });

    if (!response.ok) {
      throw new Error(`Marzpay API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Marzpay collection:', error);
    throw error;
  }
}

// Get available services
export async function getAvailableServices(): Promise<MarzPayService[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/collect-money/services`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Marzpay API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching Marzpay services:', error);
    throw error;
  }
}

// Get collection details
export async function getCollectionDetails(uuid: string): Promise<MarzPayResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/collect-money/${uuid}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Marzpay API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching collection details:', error);
    throw error;
  }
}

// Validate phone number for Uganda
export function validatePhoneNumber(phone: string): boolean {
  // Remove any non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it starts with Uganda country code or 0
  if (cleanPhone.startsWith('256')) {
    return cleanPhone.length === 12; // 256 + 9 digits
  } else if (cleanPhone.startsWith('0')) {
    return cleanPhone.length === 10; // 0 + 9 digits
  }
  
  return false;
}

// Format phone number to international format
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.startsWith('256')) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.startsWith('0')) {
    return `+256${cleanPhone.substring(1)}`;
  }
  
  return phone;
}

// Detect mobile money provider
export function detectProvider(phone: string): 'mtn' | 'airtel' | 'unknown' {
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Remove country code if present
  const localNumber = cleanPhone.startsWith('256') ? cleanPhone.substring(3) : cleanPhone;
  
  // Remove leading 0 if present
  const number = localNumber.startsWith('0') ? localNumber.substring(1) : localNumber;
  
  // MTN Mobile Money patterns
  if (number.startsWith('760') || number.startsWith('780') || 
      number.startsWith('77') || number.startsWith('78') || 
      number.startsWith('31') || number.startsWith('39')) {
    return 'mtn';
  }
  
  // Airtel Money patterns
  if (number.startsWith('700') || number.startsWith('750')) {
    return 'airtel';
  }
  
  return 'unknown';
}
