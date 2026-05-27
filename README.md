# GenZShop - Modern E-Commerce Platform

A full-stack e-commerce application built for Gen Z shoppers with a modern, fast, and intuitive shopping experience.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Backend & Auth | Supabase (PostgreSQL + Auth + RLS) |
| State Management | Zustand |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A [Supabase](https://supabase.com) account (free tier works)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/GenZShop.git
cd GenZShop
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` and run it
4. This will create all tables, RLS policies, indexes, and seed data

### 4. Configure Environment Variables

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase dashboard under **Settings > API**.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

Your app will be live in under a minute.

## Making Yourself Admin

After signing up, run this in your Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

This grants access to the admin dashboard at `/admin`.

## Project Structure

```
GenZShop/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard (products, orders, users)
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── dashboard/          # User dashboard (orders, addresses)
│   │   ├── login/              # Authentication pages
│   │   ├── signup/
│   │   ├── product/[slug]/     # Product detail page
│   │   ├── products/           # Product listing with filters
│   │   ├── wishlist/           # User wishlist
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── home/               # Homepage sections (hero, categories, deals)
│   │   ├── layout/             # Navbar, Footer
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── supabase/           # Supabase client, server, queries, middleware
│   │   ├── constants.ts        # App-wide constants
│   │   └── utils.ts            # Utility functions
│   ├── store/                  # Zustand stores (cart, wishlist)
│   ├── types/                  # TypeScript type definitions
│   └── middleware.ts           # Auth middleware
├── public/                     # Static assets
├── supabase-schema.sql         # Complete database schema + seed data
├── .env.local.example          # Environment variables template
└── package.json
```

## Features

- **Authentication** - Email/password signup & login with Supabase Auth
- **Product Catalog** - Browse by category, filter by brand/price/rating
- **Product Search** - Full-text search across products
- **Shopping Cart** - Persistent cart with Zustand
- **Wishlist** - Save products for later
- **Checkout** - Address management and order placement
- **Order Tracking** - View order status and history
- **Reviews** - Rate and review purchased products
- **Admin Panel** - Manage products, orders, and users
- **Responsive Design** - Mobile-first with Tailwind CSS 4
- **Row Level Security** - Secure data access at the database level

## License

MIT


## Setting Up Google OAuth (Optional)

To enable "Continue with Google" login:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project → Enable **Google+ API**
3. Go to **Credentials** → Create **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add Authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
6. Copy `Client ID` and `Client Secret`
7. In Supabase Dashboard → **Authentication → Providers → Google** → Enable & paste credentials
8. Save. Done!

## Payment Methods Supported

The checkout supports **5 payment options** popular in Bangladesh:
- 📱 **bKash** - Mobile banking
- 💰 **Nagad** - Mobile banking
- 🚀 **Rocket** - Dutch-Bangla mobile banking
- 💳 **Upay** - UCB digital wallet
- 💵 **Cash on Delivery (COD)**

For mobile banking, customers send money to your merchant number and enter the Transaction ID. To set your merchant numbers, edit `PAYMENT_METHODS` in `src/app/checkout/page.tsx`.
