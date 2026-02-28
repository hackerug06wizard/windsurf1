import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MarzPayRequest {
  amount: number;
  phone_number: string;
  country: string;
  reference?: string;
  description: string;
  callback_url: string;
}

interface MarzPayResponse {
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

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, phone_number, description, order_id, user_id } = await req.json()

    // Validate input
    if (!amount || !phone_number) {
      return new Response(
        JSON.stringify({ success: false, error: 'Amount and phone number are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get Marzpay credentials from environment variables
    const marzpayApiKey = Deno.env.get('MARZPAY_API_KEY')!
    const marzpayApiSecret = Deno.env.get('MARZPAY_API_SECRET')!
    const marzpayBaseUrl = 'https://wallet.wearemarz.com/api/v1'

    // Create Marzpay collection
    const formData = new FormData()
    formData.append('phone_number', phone_number)
    formData.append('amount', amount.toString())
    formData.append('country', 'UG')
    formData.append('reference', order_id || '')
    formData.append('description', description || 'Payment for Mami Papa Babies & Kids products')
    formData.append('callback_url', `${Deno.env.get('SITE_URL')}/api/payment-webhook`)

    console.log('Creating Marzpay collection:', {
      phone_number,
      amount,
      country: 'UG',
      reference: order_id || '',
    })

    const marzpayResponse = await fetch(`${marzpayBaseUrl}/collect-money`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${marzpayApiKey}:${marzpayApiSecret}`)}`,
      },
      body: formData,
    })

    if (!marzpayResponse.ok) {
      const errorText = await marzpayResponse.text()
      console.error('Marzpay API error:', errorText)
      throw new Error(`Marzpay API error: ${marzpayResponse.status} ${marzpayResponse.statusText}`)
    }

    const marzpayResult: MarzPayResponse = await marzpayResponse.json()
    console.log('Marzpay response:', marzpayResult)

    // Store payment transaction in database
    if (marzpayResult.status === 'success' && marzpayResult.data?.transaction) {
      const { error: dbError } = await supabase
        .from('payment_transactions')
        .insert({
          order_id: order_id || null,
          transaction_uuid: marzpayResult.data.transaction.uuid,
          amount: amount,
          phone_number: phone_number,
          provider: detectProvider(phone_number),
          status: 'pending',
          marzpay_response: marzpayResult,
        })

      if (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Failed to store payment transaction')
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: marzpayResult 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Payment processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Payment processing failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Helper function to detect mobile money provider
function detectProvider(phoneNumber: string): string {
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  // MTN Uganda numbers typically start with 077, 078, 039
  if (cleanPhone.startsWith('25677') || cleanPhone.startsWith('25678') || cleanPhone.startsWith('25639')) {
    return 'mtn'
  }
  
  // Airtel Uganda numbers typically start with 075, 070, 037
  if (cleanPhone.startsWith('25675') || cleanPhone.startsWith('25670') || cleanPhone.startsWith('25637')) {
    return 'airtel'
  }
  
  return 'unknown'
}
