// Marzpay API Integration - LIVE ENVIRONMENT
const API_BASE_URL = 'https://wallet.wearemarz.com/api/v1';
const API_KEY = 'marz_ZfdKiQYeolMHgoNj';
const API_SECRET = 'eNKmvTVHMP5bFYMSkJpryxn8xDhclEJO';

// Create Base64 authorization header (Works in Node.js)
const authHeader = 'Basic ' + Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');

export interface MarzPayRequest {
  amount: number;
  phone_number: string;
  country: string;
  reference?: string; // Optional: Code will generate UUID if missing
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

// Strictly Generates UUID v4 (Required by MarzPay Docs)
function generateUUIDv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Formats phone to the required +256... format
export function formatPhoneNumber(phone: string): string {
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) clean = '256' + clean.substring(1);
  if (!clean.startsWith('256')) clean = '256' + clean;
  return `+${clean}`;
}

// --- API Methods ---

/**
 * Creates a collection (Triggers USSD Push to user)
 */
export async function createCollection(request: MarzPayRequest): Promise<MarzPayResponse> {
  try {
    const formData = new FormData();
    
    // Documentation requires +256 format
    formData.append('phone_number', formatPhoneNumber(request.phone_number));
    formData.append('amount', request.amount.toString());
    formData.append('country', request.country || 'UG');
    
    // Documentation requires a strict UUID v4 for the reference
    const ref = request.reference || generateUUIDv4();
    formData.append('reference', ref);

    if (request.description) {
      formData.append('description', request.description);
    }
    
    // Defaulting to your Render webhook if none provided
    formData.append('callback_url', request.callback_url || 'https://mami-papa-store.onrender.com/api/payment-webhook');

    console.log(`Initiating LIVE collection for ${request.phone_number} - Ref: ${ref}`);

    const response = await fetch(`${API_BASE_URL}/collect-money`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
      },
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Marzpay API error:', responseData);
      throw new Error(`Marzpay API error: ${response.status} - ${responseData.message}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error creating Marzpay collection:', error);
    throw error;
  }
}

/**
 * Get collection status by UUID
 */
export async function getCollectionDetails(uuid: string): Promise<MarzPayResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/collect-money/${uuid}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      throw new Error(`Marzpay API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching details:', error);
    throw error;
  }
      }
