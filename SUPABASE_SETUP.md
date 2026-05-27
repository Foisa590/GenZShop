# 🛠️ Supabase Setup Guide - GenZShop

Eta complete step-by-step guide. Follow koro exactly.

---

## Step 1: Supabase Account Create Koro

1. Browse koro: [https://supabase.com](https://supabase.com)
2. **Start your project** click koro
3. GitHub diye sign up koro (recommended) or email
4. Free plan-i enough — kono credit card lagbe na

---

## Step 2: New Project Create Koro

1. Dashboard-e giye **"New Project"** click koro
2. Form fill up koro:
   - **Name**: `genzshop` (jekono name)
   - **Database Password**: Strong password set koro (save kore rakho!)
   - **Region**: `Singapore (Southeast Asia)` — Bangladesh er kache, fastest
   - **Pricing Plan**: `Free`
3. **Create new project** click koro
4. ⏳ 2-3 minute wait koro project ready hote

---

## Step 3: Database Schema Setup (MOST IMPORTANT)

Eta na korle kichu kaj korbe na.

1. Left sidebar-e **SQL Editor** (icon: `</>`) click koro
2. **+ New Query** click koro
3. Repository theke `supabase-schema.sql` file open koro
4. Pura content **copy** koro (Ctrl+A, Ctrl+C)
5. SQL Editor-e **paste** koro
6. Bottom-right corner-e **RUN** button click koro (or Ctrl+Enter)
7. ✅ "Success. No rows returned" message dekhte pabe

Ki create hoyeche:
- 8 ta tables (profiles, products, categories, orders, etc.)
- RLS (Row Level Security) policies — auto data protection
- Indexes — fast query
- 15 ta sample products + 8 categories — testing er jonno

---

## Step 4: API Keys Copy Koro

Vercel deploy korte ei keys lagbe.

1. Left sidebar-e **Settings** (⚙️ icon) click koro
2. **API** tab-e jao
3. Ei 2 ta jinish copy koro:

```
Project URL:  https://xxxxxxxxxxxxx.supabase.co
anon public:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✏️ Ek jaygay save kore rakho — Vercel-e lagbe.

⚠️ **service_role** key kokhono share koro na or git-e push koro na.

---

## Step 5: Email Auth Configure Koro

1. **Authentication** sidebar → **Providers** tab
2. **Email** provider auto-enabled thakbe ✅
3. **Email Templates** customize korte chaile (optional):
   - Confirm signup, Magic Link, Reset Password — sob template change kora jay

### Email Confirmation Off Korte Chao? (Testing er jonno):

1. **Authentication → Settings**
2. Scroll down → **"Confirm email"** toggle OFF koro
3. Save koro

Now signup-e direct login hobe, email confirm lagbe na.

---

## Step 6: Google OAuth Setup (Optional but Recommended)

"Continue with Google" button kaj korate ei step lagbe.

### Part A: Google Cloud Console

1. [https://console.cloud.google.com](https://console.cloud.google.com) e jao
2. Top-bar e **"Select a project"** → **"NEW PROJECT"**
3. Name: `GenZShop` → **CREATE**
4. Project select hole left menu → **"APIs & Services"** → **"OAuth consent screen"**
5. **External** select koro → **CREATE**
6. Form fill koro:
   - App name: `GenZShop`
   - User support email: tomar email
   - Developer contact email: tomar email
7. **SAVE AND CONTINUE** (3 bar, sob default)
8. Left menu → **"Credentials"** → **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
9. Application type: **Web application**
10. Name: `GenZShop Web`
11. **Authorized JavaScript origins** (Add):
    ```
    https://your-vercel-domain.vercel.app
    http://localhost:3000
    ```
12. **Authorized redirect URIs** (Add — IMPORTANT):
    ```
    https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
    ```
    (`YOUR-PROJECT-ID` ke tomar Supabase URL er id diye replace koro)
13. **CREATE** click koro
14. ✅ Popup dekhabe **Client ID** ar **Client Secret** — copy kore rakho

### Part B: Supabase-e Google Add Koro

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Google** find koro → click
3. Toggle **ENABLE** koro
4. Paste koro:
   - **Client ID** (Google theke)
   - **Client Secret** (Google theke)
5. **Save** click koro

✅ Done! Now `/login` page e "Continue with Google" kaj korbe.

---

## Step 7: Site URL Add Koro (OAuth er jonno)

1. Supabase → **Authentication** → **URL Configuration**
2. **Site URL** field e tomar Vercel domain dao:
   ```
   https://your-app.vercel.app
   ```
3. **Redirect URLs** e add koro (newline diye):
   ```
   https://your-app.vercel.app/**
   http://localhost:3000/**
   ```
4. **Save**

⚠️ Ei step na korle Google login redirect fail korbe!

---

## Step 8: Yourself ke Admin Banaw

Signup korar pore (any user), tomar nije ke admin banate Supabase SQL Editor e ei query run koro:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'tomar@email.com';
```

Now `/admin` route access kora jabe — products add/edit/delete, orders manage, customers dekha.

---

## Step 9: Storage Setup (Product Images er jonno - Optional)

Admin panel theke product images upload korte chaile:

1. Supabase → **Storage** → **New bucket**
2. Name: `product-images`
3. **Public bucket** ✅ tick koro (so anyone can view images)
4. **Save**

Then SQL Editor e run koro for upload permission:
```sql
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## ✅ Verification Checklist

Sob done? Check koro:

- [ ] Supabase project created (Singapore region)
- [ ] `supabase-schema.sql` SQL Editor e run kora hoyeche
- [ ] **Tables tab e 8 ta table dekha jacche**: profiles, categories, products, addresses, orders, order_items, reviews, wishlist
- [ ] Products table e **15 ta sample products** ase
- [ ] Categories table e **8 ta categories** ase
- [ ] **Project URL** ar **anon key** copy kora hoyeche
- [ ] Email Auth enabled (default)
- [ ] Google OAuth enabled with Client ID + Secret (if using Google login)
- [ ] **Site URL** ar **Redirect URLs** set kora hoyeche
- [ ] Storage bucket `product-images` create hoyeche (optional)

---

## 🚀 Vercel Deploy Korar Time

Supabase ready! Now Vercel-e:

1. [https://vercel.com/new](https://vercel.com/new) e jao
2. GitHub login → `Foisa590/GenZShop` import koro
3. **Environment Variables** section e add koro:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJ...
   NEXT_PUBLIC_SITE_URL = https://your-app.vercel.app
   ```
4. **Deploy** click koro
5. ⏳ 1-2 minute, tarpor live!

Deploy hole, **Step 7** repeat koro — Vercel domain Site URL e add koro Supabase-e.

---

## 💡 Common Problems & Solutions

### "Could not find the table 'public.products'"
→ SQL schema run kora hoyni. **Step 3** abar koro.

### "Invalid API key"
→ `.env.local` or Vercel env-e wrong key paste hoyeche. **Step 4** verify koro.

### Google login "redirect mismatch"
→ Google Cloud Console-e wrong redirect URI dao. Must be: `https://YOUR-SUPABASE-PROJECT.supabase.co/auth/v1/callback`

### "Email not confirmed" error
→ **Step 5** e Confirm Email OFF koro, or email check kore confirmation link click koro.

### Admin route "404 Not Found"
→ **Step 8** run koni — admin role set koro.

---

## 💳 Payment Methods Configure Koro

Real merchant numbers set korte:

1. Repo theke open koro: `src/app/checkout/page.tsx`
2. Top-e `PAYMENT_METHODS` array:
   ```typescript
   { id: "bkash", info: "01XXX-XXXXXX" }, // ← Tomar real bKash merchant number
   { id: "nagad", info: "01XXX-XXXXXX" }, // ← Tomar Nagad
   { id: "rocket", info: "01XXX-XXXXXX-1" }, // ← Tomar Rocket
   { id: "upay", info: "01XXX-XXXXXX" }, // ← Tomar Upay
   ```
3. Replace koro tomar real numbers diye
4. Commit + push → Vercel auto deploy

---

## 🎉 Sob Done!

Tomar GenZShop ekhon ready! Customers can:
- Sign up with Email or Google
- Browse 15 sample products
- Add to cart & wishlist
- Checkout with bKash/Nagad/Rocket/Upay/COD
- Track orders from dashboard

Tumi (Admin):
- `/admin` route e products add/edit/delete kora
- `/admin/orders` e orders manage kora
- `/admin/users` e customers dekha
