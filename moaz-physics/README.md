# MOAZ Physics - Quantum & Relativity Universe

A professional futuristic sci-fi physics education platform built with Next.js 14, Tailwind CSS, Three.js, and Prisma.

## Designed by Moaz Qassem

## Features

- **Dark Space Theme** with neon accents and glassmorphism
- **3D Hero Section** with interactive black hole and quantum sphere
- **Relativity & Quantum Physics** sections with dedicated 3D scenes
- **Smooth Animations** using Framer Motion and GSAP
- **Admin Dashboard** with video/file management, revenue tracking
- **User Dashboard** with course library, progress tracking, wallet
- **Payment System** with Stripe integration
- **Wallet & Withdrawals** to bank accounts and Vodafone Cash
- **Animated 3D Cosmic Characters** with floating animations
- **Professional MOAZ Logo** with gradient effects

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Three.js / React Three Fiber
- Framer Motion
- Prisma ORM
- PostgreSQL
- Stripe Payments
- JWT Authentication

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables in `.env.local`:
```
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

3. Run database migrations:
```bash
npx prisma generate
npx prisma db push
```

4. Start development server:
```bash
npm run dev
```

## Project Structure

```
├── app/
│   ├── api/           # API routes (auth, videos, payments, admin)
│   ├── admin/         # Admin pages (dashboard, videos, payments)
│   ├── auth/          # Login & Register
│   ├── user/          # User dashboard
│   ├── relativity/    # Relativity section
│   ├── quantum/       # Quantum section
│   └── page.tsx       # Home page
├── components/
│   ├── 3d/            # Three.js components
│   ├── ui/            # UI components
│   └── *.tsx          # Page components
├── lib/               # Utilities (prisma, auth, stripe)
├── types/             # TypeScript types
└── prisma/            # Database schema
```

## Payment Features

- **Stripe Checkout** for one-time purchases and subscriptions
- **Wallet System** for internal balance management
- **Withdrawals** to:
  - Bank Transfer (IBAN)
  - Vodafone Cash
  - InstaPay
- **Admin Revenue Dashboard** with charts and statistics

## Designer

**Moaz Qassem** - Physics educator and full-stack developer

---

© 2026 MOAZ Physics. All rights reserved.