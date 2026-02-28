import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Marzpay Webhook received:', body)

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { 
      transaction, 
      collection, 
      status 
    } = body

    // Find the payment transaction by transaction UUID
    const { data: paymentTx, error: paymentError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('transaction_uuid', transaction?.uuid || '')
      .single()

    if (paymentError || !paymentTx) {
      console.error('Payment transaction not found:', paymentError)
      return new Response(
        JSON.stringify({ success: false, error: 'Transaction not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update payment transaction status
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: status || 'pending',
        webhook_data: body,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentTx.id)

    if (updateError) {
      console.error('Failed to update payment transaction:', updateError)
      throw new Error('Failed to update payment transaction')
    }

    // Update order status if payment is completed
    if (status === 'completed' && paymentTx.order_id) {
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          status: 'completed',
          payment_reference: transaction?.uuid,
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentTx.order_id)

      if (orderError) {
        console.error('Failed to update order:', orderError)
        throw new Error('Failed to update order')
      }
    }

    // Handle different transaction statuses
    switch (status) {
      case 'completed':
        console.log('Payment completed for transaction:', transaction?.uuid)
        await handleCompletedPayment(transaction, collection, supabase)
        break
      case 'failed':
        console.log('Payment failed for transaction:', transaction?.uuid)
        await handleFailedPayment(transaction, collection, supabase)
        break
      case 'cancelled':
        console.log('Payment cancelled for transaction:', transaction?.uuid)
        await handleCancelledPayment(transaction, collection, supabase)
        break
      default:
        console.log('Unknown payment status:', status)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: (error as Error).message || 'Webhook processing failed' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function handleCompletedPayment(transaction: any, collection: any, supabase: any) {
  // You can add additional logic here:
  // - Send confirmation email/SMS
  // - Update inventory
  // - Notify admin
  // - Create shipping order
  
  console.log('Payment completed successfully:', {
    transactionId: transaction?.uuid,
    amount: collection?.amount,
    phone: collection?.phone_number
  })
}

async function handleFailedPayment(transaction: any, collection: any, supabase: any) {
  // You can add logic here:
  // - Notify user of payment failure
  // - Retry logic
  // - Update order status to failed
  
  console.log('Payment failed:', {
    transactionId: transaction?.uuid,
    amount: collection?.amount,
    phone: collection?.phone_number
  })
}

async function handleCancelledPayment(transaction: any, collection: any, supabase: any) {
  // You can add logic here:
  // - Notify user of cancellation
  // - Update order status to cancelled
  
  console.log('Payment cancelled:', {
    transactionId: transaction?.uuid,
    amount: collection?.amount,
    phone: collection?.phone_number
  })
}
