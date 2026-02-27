# Backend Architecture Documentation

## 📁 **Backend Structure**

This project uses **Next.js API Routes** as the backend, which provides server-side functionality without needing a separate backend server.

### 🚀 **API Routes (Backend Endpoints)**

#### **Core Business Logic**
- `GET/POST /api/products` - Product management
- `GET/POST /api/orders` - Order management  
- `GET/POST /api/users` - User management
- `POST /api/auth/login` - User authentication

#### **Payment Processing**
- `POST /api/marzpay/collect` - **Edge Function** for Marzpay payment processing
- `POST /api/payment-webhook` - Handles Marzpay payment callbacks

#### **Utilities**
- `GET /api/placeholder/[...params]` - Generates placeholder images

## 🔧 **Edge Functions**

Edge Functions are serverless functions that run globally at the edge (closer to users).

### **Marzpay Edge Function**
```typescript
// File: src/app/api/marzpay/collect/route.ts
export const runtime = 'edge'; // This makes it an Edge Function
```

**Benefits:**
- ⚡ **Faster response times** - Runs closer to users
- 🌍 **Global distribution** - Deployed worldwide
- 🔒 **Better security** - API keys stay server-side
- 💰 **Cost effective** - Pay only for execution time

## 🗄️ **Data Storage**

### **Current: localStorage (Client-side)**
- Products stored in browser localStorage
- Users stored in browser localStorage  
- Orders stored in browser localStorage
- **Limitation**: Data is lost when users clear browser cache

### **Production Recommendations**

#### **Option 1: Database (Recommended)**
```sql
-- PostgreSQL Schema Example
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT,
  description TEXT,
  category VARCHAR(100),
  age VARCHAR(50),
  size VARCHAR(50),
  color VARCHAR(50),
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  payment_method VARCHAR(50),
  items JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### **Option 2: Cloud Database Services**
- **Vercel Postgres** - Managed PostgreSQL
- **Supabase** - PostgreSQL with real-time features
- **PlanetScale** - MySQL serverless
- **MongoDB Atlas** - NoSQL document database

## 🔐 **Security Considerations**

### **Current Security**
- API keys hidden in server-side code
- Basic input validation
- No password hashing (needs improvement)

### **Production Security Requirements**
1. **Password Hashing**
```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 12);
const isValid = await bcrypt.compare(password, hashedPassword);
```

2. **JWT Authentication**
```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
```

3. **Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});
```

4. **CORS Configuration**
```typescript
export async function POST(request: NextRequest) {
  // Add CORS headers
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': 'https://mami-papa-store.onrender.com',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
```

## 🚀 **Deployment Options**

### **Current Setup**
- Next.js handles both frontend and backend
- API routes deploy with the frontend
- Edge Functions available globally

### **Production Deployments**

#### **Option 1: Vercel (Recommended)**
- ✅ Edge Functions supported
- ✅ Automatic deployments
- ✅ Built-in database (Postgres)
- ✅ Serverless functions

#### **Option 2: Render**
- ✅ Good for Next.js apps
- ✅ PostgreSQL available
- ✅ Edge Functions support
- ✅ Your current deployment platform

#### **Option 3: AWS**
- ✅ Lambda@Edge for Edge Functions
- ✅ RDS for database
- ✅ S3 for file storage
- ❌ More complex setup

#### **Option 4: Railway**
- ✅ Simple deployment
- ✅ PostgreSQL included
- ✅ Good for startups

## 📊 **Environment Variables**

Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Marzpay
MARZPAY_API_KEY="your-api-key"
MARZPAY_API_SECRET="your-api-secret"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
WEBHOOK_URL="https://your-domain.com/api/payment-webhook"
```

## 🔧 **API Documentation**

### **Products API**
```http
GET /api/products
POST /api/products
Content-Type: application/json

{
  "name": "Baby Blanket",
  "price": 45000,
  "category": "nursery",
  "age": "0-6 months",
  "size": "Newborn",
  "color": "Pink"
}
```

### **Orders API**
```http
GET /api/orders
POST /api/orders
Content-Type: application/json

{
  "items": [...],
  "total": 45000,
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+256783468608",
  "paymentMethod": "mobile_money"
}
```

### **Authentication API**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

## 🎯 **Next Steps**

1. **Set up a real database** (PostgreSQL recommended)
2. **Add proper authentication** with JWT
3. **Implement password hashing** with bcrypt
4. **Add rate limiting** for security
5. **Set up monitoring** and logging
6. **Add comprehensive error handling**
7. **Implement proper CORS** configuration

## 📝 **Summary**

Your current setup is actually quite modern:
- ✅ **Next.js API Routes** = Backend functionality
- ✅ **Edge Functions** = Global serverless functions
- ✅ **No separate backend server needed**
- ✅ **Marzpay integration** working via API routes

The main improvement needed is moving from localStorage to a proper database for production use.
