-- ============================================
-- RLS Policy Fix for Admin Order Updates
-- Run this in Supabase SQL Editor if order status updates fail
-- ============================================

-- Drop existing policies (if any conflict)
DROP POLICY IF EXISTS "Admins can update any order" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

-- Recreate orders policies with SELECT after UPDATE support
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update any order"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Verify with this query (replace with your email):
-- SELECT id, email, role FROM profiles WHERE email = 'your@email.com';

-- If role is not 'admin', run:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
