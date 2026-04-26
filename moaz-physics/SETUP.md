# MOAZ Physics - Setup Guide

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)

## Installation Steps

### 1. Install Dependencies
```bash
cd moaz-physics
npm install
```

### 2. Environment Variables
Create `.env.local` file:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/moaz_physics?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
STRIPE_WEBHOOK_SECRET="whsec_your_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@moazphysics.com"
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (optional)
npx prisma studio
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Stripe Webhook Setup (Local Development)
```bash
# Install Stripe CLI
# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/payments/webhook
```

## Features Overview

### Public Pages
- **Home**: 3D hero with black hole, cosmic characters, stats, featured videos
- **Relativity**: Interactive 3D spacetime visualization
- **Quantum**: Quantum field visualization with floating particles

### Authentication
- JWT-based auth with bcrypt password hashing
- Login/Register pages with glassmorphism design

### User Dashboard
- Course library with progress tracking
- Video player access
- Wallet balance and top-up via Stripe
- Payment history

### Admin Panel
- Dashboard with revenue statistics and charts
- Video manager (CRUD operations)
- File manager (upload and link resources)
- Payment center with withdrawal requests
- Withdrawals to: Bank Transfer, Vodafone Cash, InstaPay

### Payment System
- Stripe checkout for purchases
- Internal wallet system
- Admin can withdraw funds to any bank account or Vodafone Cash
- Webhook handling for payment confirmation

## Designer Credit
**Designed by Moaz Qassem**
Professional physics education platform

## Tech Stack
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- Three.js / React Three Fiber
- Framer Motion
- Prisma ORM + PostgreSQL
- Stripe Payments
- JWT Authentication
