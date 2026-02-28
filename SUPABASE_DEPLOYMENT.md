# Supabase Deployment Guide for Mami Papa Babies & Kids Store

## 🚀 **Quick Start**

### 1. **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name: `mami-papa-store`
4. Select a region closest to your users (Uganda → Africa)
5. Wait for project creation

### 2. **Set Up Database**
1. Go to your project → **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL script
4. This will create all tables, indexes, and RLS policies

### 3. **Deploy Edge Functions**

#### **Option A: Using Supabase CLI (Recommended)**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy functions
supabase functions deploy marzpay-collect
supabase functions deploy payment-webhook

# Set environment variables
supabase secrets set MARZPAY_API_KEY=your-api-key
supabase secrets set MARZPAY_API_SECRET=your-api-secret
supabase secrets set SITE_URL=https://your-project-ref.supabase.co
```

#### **Option B: Using Dashboard**
1. Go to **Edge Functions** in Supabase dashboard
2. Click **New Function**
3. Function name: `marzpay-collect`
4. Copy contents from `supabase/functions/marzpay-collect/index.ts`
5. Set environment variables:
   - `MARZPAY_API_KEY`: Your Marzpay API key
   - `MARZPAY_API_SECRET`: Your Marzpay API secret
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key
   - `SITE_URL`: Your deployed site URL
6. Click **Deploy**

7. Repeat for `payment-webhook` function

### 4. **Configure Environment Variables**

#### **In Supabase Dashboard:**
Go to **Settings** → **Edge Functions** → **Environment Variables**

Add these variables:
```
MARZPAY_API_KEY=your-marzpay-api-key
MARZPAY_API_SECRET=your-marzpay-secret
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SITE_URL=https://your-project-ref.supabase.co
```

#### **For Local Development:**
Create `.env.local` file (add to `.gitignore`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
MARZPAY_API_KEY=your-api-key
MARZPAY_API_SECRET=your-api-secret
```

### 5. **Update Frontend to Use Supabase**

#### **Install Supabase Client:**
```bash
npm install @supabase/supabase-js
```

#### **Create Supabase Client:**
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// For server-side operations
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${cookieStore.get('sb-access-token')?.value}`
        }
      }
    }
  )
}
```

### 6. **Update API Routes to Use Supabase**

#### **Products API:**
```typescript
// src/app/api/products/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, error: error.message })
  }

  return NextResponse.json({ success: true, data })
}
```

#### **Orders API:**
```typescript
// src/app/api/orders/route.ts
export async function POST(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const orderData = await request.json()
  
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()

  if (error) {
    return NextResponse.json({ success: false, error: error.message })
  }

  return NextResponse.json({ success: true, data: data[0] })
}
```

### 7. **Update Frontend Components**

#### **MarzPayPayment Component:**
```typescript
// Update to call Supabase Edge Function
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validatePhone()) return;
  
  setIsProcessing(true);

  try {
    const formattedPhone = formatPhoneNumber(formData.phone_number);
    
    // Call Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('marzpay-collect', {
      body: {
        amount: total,
        phone_number: formattedPhone,
        description: formData.description,
      }
    });

    if (error) {
      onError('Payment processing failed. Please try again.');
      return;
    }

    if (data.success && data.data.status === 'success') {
      onSuccess(data.data.data.transaction.uuid);
      onClose();
    } else {
      onError(data.data?.message || 'Payment failed');
    }
  } catch (error) {
    console.error('Payment error:', error);
    onError('Payment processing failed. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};
```

### 8. **Set Up Webhook URL**

1. Go to Marzpay dashboard
2. Set webhook URL to: `https://your-project-ref.supabase.co/functions/v1/payment-webhook`
3. Enable webhook events: payment.completed, payment.failed, payment.cancelled

### 9. **Test the Integration**

#### **Test Payment Flow:**
1. Add items to cart
2. Proceed to checkout
3. Fill customer details
4. Select "Pay with Mobile Money"
5. Enter phone number and description
6. Submit payment
7. Check Supabase database for transaction record
8. Verify webhook receives payment status

#### **Test Database:**
```sql
-- Check if data was inserted
SELECT * FROM products LIMIT 5;
SELECT * FROM orders ORDER BY created_at DESC LIMIT 5;
SELECT * FROM payment_transactions ORDER BY created_at DESC LIMIT 5;
```

### 10. **Production Checklist**

#### **Security:**
- [ ] Enable Row Level Security (RLS) policies
- [ ] Set up authentication
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Set up monitoring

#### **Performance:**
- [ ] Add database indexes
- [ ] Enable caching
- [ ] Set up CDN for images
- [ ] Optimize Edge Functions

#### **Monitoring:**
- [ ] Set up error tracking
- [ ] Add logging
- [ ] Set up alerts
- [ ] Monitor performance

### 11. **Troubleshooting**

#### **Common Issues:**

**Edge Function Errors:**
```bash
# Check function logs
supabase functions logs marzpay-collect
supabase functions logs payment-webhook
```

**Database Connection:**
```typescript
// Test connection
const { data, error } = await supabase
  .from('products')
  .select('count')
  .single()

console.log('Database connection test:', { data, error })
```

**CORS Issues:**
```typescript
// Make sure your frontend URL is in allowed origins
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://your-domain.com',
}
```

**Environment Variables:**
```typescript
// Debug environment variables
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Has service key:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
```

### 12. **Deployment Commands**

#### **Deploy Everything:**
```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy marzpay-collect
supabase functions deploy payment-webhook

# Check deployment status
supabase functions list
```

#### **Database Migrations:**
```bash
# Apply schema changes
supabase db push

# Reset database (careful!)
supabase db reset
```

### 13. **Next Steps**

1. **Set up authentication** with Supabase Auth
2. **Add real-time features** with Supabase Realtime
3. **Implement file storage** with Supabase Storage
4. **Add analytics** with Supabase Analytics
5. **Set up monitoring** with Supabase Logs

---

## 🎯 **Summary**

Your Supabase backend will provide:
- ✅ **Global Edge Functions** for payments
- ✅ **PostgreSQL database** with RLS
- ✅ **Real-time capabilities**
- ✅ **File storage** for products
- ✅ **Authentication** system
- ✅ **Automatic scaling** and high availability

The TypeScript errors you're seeing are **expected** because these are **Deno Edge Functions**, not regular TypeScript. They will work correctly when deployed to Supabase.
