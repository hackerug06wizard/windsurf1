# Mami Papa Babies & Kids - E-commerce Store

A responsive e-commerce platform for baby and kids products built with Next.js, TypeScript, and Tailwind CSS. Features Marzpay payment integration, Meta Pixel tracking, and a custom admin dashboard.

## 🚀 Features

### 🛍️ E-commerce Functionality
- **Responsive Product Grid**: 2 columns (Mobile), 3 columns (Tablet), 4 columns (Desktop)
- **Shopping Cart**: Add/remove items, quantity management, localStorage persistence
- **Product Management**: Full CRUD operations for products
- **Search & Filter**: Category-based product filtering

### 💳 Payment Integration
- **Marzpay Gateway**: USSD push payments for MTN, Airtel, and Bank transfers
- **Secure Checkout**: Form validation and error handling
- **Payment Webhooks**: Real-time payment status updates

### 📊 Analytics & Tracking
- **Meta Pixel**: Purchase event tracking (ID: 2621239424886813)
- **Google Ads**: Conversion tracking (AW-17957602155)
- **Custom Events**: Cart interactions and checkout funnel

### 👥 Admin Dashboard
- **Protected Routes**: Admin authentication (barbarakatusabe999@gmail.com / QWer12@*)
- **Product Management**: Add, edit, delete products with image upload
- **Inventory Control**: Stock status management
- **Order Management**: View and manage customer orders

### 📱 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **WhatsApp Integration**: Floating chat button (+256783468608)
- **Pastel Theme**: Baby-friendly color palette
- **Smooth Animations**: Hover effects and transitions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom pastel colors
- **Icons**: Lucide React
- **Payment**: Marzpay API integration
- **Analytics**: Meta Pixel, Google Ads
- **Storage**: LocalStorage for cart persistence

## 📦 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── auth/              # Authentication page
│   ├── api/               # API routes
│   │   └── payment-webhook/ # Marzpay webhook handler
│   └── globals.css        # Global styles with pastel colors
├── components/            # React components
│   ├── Header.tsx         # Navigation header with cart
│   ├── ProductGrid.tsx    # Responsive product display
│   ├── Cart.tsx           # Shopping cart sidebar
│   ├── Checkout.tsx       # Payment flow with Marzpay
│   └── WhatsAppButton.tsx # Floating chat button
├── lib/                   # Utilities and constants
│   ├── constants.ts       # App configuration
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript definitions
    ├── index.ts           # Core interfaces
    └── global.d.ts        # Global type declarations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd store
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration

### Marzpay Integration
Update the Marzpay API credentials in `src/components/Checkout.tsx`:

```typescript
headers: {
  'Authorization': 'Basic YOUR_API_CREDENTIALS', // Replace with actual credentials
}
```

### Admin Credentials
- **Email**: barbarakatusabe999@gmail.com
- **Password**: QWer12@*

### Tracking IDs
- **Meta Pixel**: 2621239424886813
- **Google Ads**: AW-17957602155
- **WhatsApp**: +256783468608

## 📱 Responsive Breakpoints

- **Mobile**: 2 products per row (max-width: 768px)
- **Tablet**: 3 products per row (768px - 1024px)
- **Desktop**: 4 products per row (min-width: 1024px)

## 🎨 Design System

### Pastel Color Palette
- Primary: #FFE4E1 (Misty Rose)
- Secondary: #E6E6FA (Lavender)
- Accent: #F0E68C (Khaki)
- Pink: #FFB6C1 (Light Pink)
- Blue: #ADD8E6 (Light Blue)
- Green: #98FB98 (Pale Green)
- Yellow: #FFFFE0 (Light Yellow)
- Purple: #DDA0DD (Plum)

## 💾 Data Storage

Currently uses localStorage for:
- Shopping cart persistence
- Product catalog
- Admin session state

*Note: For production, consider implementing a proper database.*

## 🔐 Security Features

- Admin route protection
- Input validation and sanitization
- XSS protection through React
- CSRF protection considerations for webhooks

## 📊 Analytics Implementation

### Meta Pixel Events
- `PageView`: Automatic on page load
- `Purchase`: Triggered on successful payment
- Custom parameters for product tracking

### Google Ads Events
- Page view tracking
- Conversion tracking on purchase
- Custom transaction IDs

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create `.env.local` for production:
```env
MARZPAY_API_URL=https://wallet.wearemarz.com/api/v1
MARZPAY_API_CREDENTIALS=your_base64_credentials
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary and confidential.

## 🆘 Support

For support:
- WhatsApp: +256 783 468 608
- Email: info@mamipaba.com

---

**Built with ❤️ for Mami Papa Babies & Kids**
