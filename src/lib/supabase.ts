import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side Supabase client for API routes
export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

// Helper function to call Supabase Edge Functions
export async function callSupabaseFunction<T = any>(
  functionName: string,
  payload?: any
): Promise<{ data: T | null; error: any }> {
  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    })

    return { data, error }
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error)
    return { data: null, error }
  }
}

// Database helpers
export const db = {
  // Products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    return { data, error }
  },

  async createProduct(product: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()

    return { data: data?.[0], error }
  },

  // Orders
  async getOrders(userId?: string) {
    let query = supabase
      .from('orders')
      .select('*, items(*)')
      .order('created_at', { ascending: false })

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query
    return { data, error }
  },

  async createOrder(order: any) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()

    return { data: data?.[0], error }
  },

  // Users
  async createUser(user: any) {
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          name: user.name,
          phone: user.phone
        }
      }
    })

    return { data, error }
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Payment transactions
  async createPaymentTransaction(transaction: any) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert([transaction])
      .select()

    return { data: data?.[0], error }
  },

  async updatePaymentTransaction(id: string, updates: any) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .update(updates)
      .eq('id', id)
      .select()

    return { data: data?.[0], error }
  }
}

// Auth helpers
export const auth = {
  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  }
}
