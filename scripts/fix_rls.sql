-- ============================================================
-- Supabase RLS 보안 수정 스크립트 (csxhlbsdtrjjronbpalu) v5
-- 각 테이블을 개별 DO 블록으로 처리 → 뷰면 자동 SKIP
-- ============================================================

-- ── profiles ──────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='profiles') = 'BASE TABLE' THEN
    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
    DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
    CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
    RAISE NOTICE 'profiles: done';
  ELSE RAISE NOTICE 'profiles: skipped (view)'; END IF;
END $$;

-- ── orders ────────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='orders') = 'BASE TABLE' THEN
    ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "orders_select_own" ON orders;
    CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);
    RAISE NOTICE 'orders: done';
  ELSE RAISE NOTICE 'orders: skipped (view)'; END IF;
END $$;

-- ── subscriptions ─────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='subscriptions') = 'BASE TABLE' THEN
    ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;
    CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
    RAISE NOTICE 'subscriptions: done';
  ELSE RAISE NOTICE 'subscriptions: skipped (view)'; END IF;
END $$;

-- ── favorites ─────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='favorites') = 'BASE TABLE' THEN
    ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "favorites_select_own" ON favorites;
    DROP POLICY IF EXISTS "favorites_insert_own" ON favorites;
    DROP POLICY IF EXISTS "favorites_delete_own" ON favorites;
    CREATE POLICY "favorites_select_own" ON favorites FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (auth.uid() = user_id);
    RAISE NOTICE 'favorites: done';
  ELSE RAISE NOTICE 'favorites: skipped (view)'; END IF;
END $$;

-- ── reports ───────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='reports') = 'BASE TABLE' THEN
    ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "reports_select_own" ON reports;
    DROP POLICY IF EXISTS "reports_insert_own" ON reports;
    CREATE POLICY "reports_select_own" ON reports FOR SELECT USING (auth.uid() = reporter_id);
    CREATE POLICY "reports_insert_own" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);
    RAISE NOTICE 'reports: done';
  ELSE RAISE NOTICE 'reports: skipped (view)'; END IF;
END $$;

-- ── playground_usage ──────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='playground_usage') = 'BASE TABLE' THEN
    ALTER TABLE playground_usage ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "playground_usage_select_own" ON playground_usage;
    DROP POLICY IF EXISTS "playground_usage_insert_own" ON playground_usage;
    CREATE POLICY "playground_usage_select_own" ON playground_usage FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "playground_usage_insert_own" ON playground_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE 'playground_usage: done';
  ELSE RAISE NOTICE 'playground_usage: skipped (view)'; END IF;
END $$;

-- ── commissions ───────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='commissions') = 'BASE TABLE' THEN
    ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "commissions_select_own" ON commissions;
    CREATE POLICY "commissions_select_own" ON commissions FOR SELECT USING (auth.uid() = seller_id);
    RAISE NOTICE 'commissions: done';
  ELSE RAISE NOTICE 'commissions: skipped (view)'; END IF;
END $$;

-- ── payouts ───────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='payouts') = 'BASE TABLE' THEN
    ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "payouts_select_own" ON payouts;
    CREATE POLICY "payouts_select_own" ON payouts FOR SELECT USING (auth.uid() = creator_id);
    RAISE NOTICE 'payouts: done';
  ELSE RAISE NOTICE 'payouts: skipped (view)'; END IF;
END $$;

-- ── creators ──────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='creators') = 'BASE TABLE' THEN
    ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "creators_select_public" ON creators;
    DROP POLICY IF EXISTS "creators_update_own" ON creators;
    CREATE POLICY "creators_select_public" ON creators FOR SELECT USING (true);
    CREATE POLICY "creators_update_own" ON creators FOR UPDATE USING (auth.uid() = user_id);
    RAISE NOTICE 'creators: done';
  ELSE RAISE NOTICE 'creators: skipped (view)'; END IF;
END $$;

-- ── support_tickets (user_id 없음 — INSERT 공개 허용, SELECT 차단) ──
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='support_tickets') = 'BASE TABLE' THEN
    ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "support_tickets_insert_anon" ON support_tickets;
    CREATE POLICY "support_tickets_insert_anon" ON support_tickets FOR INSERT WITH CHECK (true);
    RAISE NOTICE 'support_tickets: done';
  ELSE RAISE NOTICE 'support_tickets: skipped (view)'; END IF;
END $$;

-- ── payment_failures (완전 차단 — service_role만) ─────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='payment_failures') = 'BASE TABLE' THEN
    ALTER TABLE payment_failures ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'payment_failures: done (fully blocked)';
  ELSE RAISE NOTICE 'payment_failures: skipped (view)'; END IF;
END $$;

-- ── email_leads (INSERT만 허용) ───────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='email_leads') = 'BASE TABLE' THEN
    ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "email_leads_insert_anon" ON email_leads;
    CREATE POLICY "email_leads_insert_anon" ON email_leads FOR INSERT WITH CHECK (true);
    RAISE NOTICE 'email_leads: done';
  ELSE RAISE NOTICE 'email_leads: skipped (view)'; END IF;
END $$;

-- ── processed_events (완전 차단) ─────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='processed_events') = 'BASE TABLE' THEN
    ALTER TABLE processed_events ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'processed_events: done (fully blocked)';
  ELSE RAISE NOTICE 'processed_events: skipped (view)'; END IF;
END $$;

-- ── webhook_event_stats (완전 차단) ───────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='webhook_event_stats') = 'BASE TABLE' THEN
    ALTER TABLE webhook_event_stats ENABLE ROW LEVEL SECURITY;
    RAISE NOTICE 'webhook_event_stats: done (fully blocked)';
  ELSE RAISE NOTICE 'webhook_event_stats: skipped (view)'; END IF;
END $$;

-- ── reviews ───────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='reviews') = 'BASE TABLE' THEN
    ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "reviews_select_public" ON reviews;
    DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
    CREATE POLICY "reviews_select_public" ON reviews FOR SELECT USING (true);
    CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
    RAISE NOTICE 'reviews: done';
  ELSE RAISE NOTICE 'reviews: skipped (view)'; END IF;
END $$;

-- ── product_ratings (공개 읽기) ───────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='product_ratings') = 'BASE TABLE' THEN
    ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "product_ratings_select_public" ON product_ratings;
    CREATE POLICY "product_ratings_select_public" ON product_ratings FOR SELECT USING (true);
    RAISE NOTICE 'product_ratings: done';
  ELSE RAISE NOTICE 'product_ratings: skipped (view)'; END IF;
END $$;

-- ── products ──────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='products') = 'BASE TABLE' THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "products_select_public" ON products;
    DROP POLICY IF EXISTS "products_insert_owner" ON products;
    DROP POLICY IF EXISTS "products_update_owner" ON products;
    CREATE POLICY "products_select_public" ON products FOR SELECT USING (true);
    CREATE POLICY "products_insert_owner" ON products FOR INSERT WITH CHECK (auth.uid() = creator_id);
    CREATE POLICY "products_update_owner" ON products FOR UPDATE USING (auth.uid() = creator_id);
    RAISE NOTICE 'products: done';
  ELSE RAISE NOTICE 'products: skipped (view)'; END IF;
END $$;

-- ── categories ────────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='categories') = 'BASE TABLE' THEN
    ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "categories_select_public" ON categories;
    CREATE POLICY "categories_select_public" ON categories FOR SELECT USING (true);
    RAISE NOTICE 'categories: done';
  ELSE RAISE NOTICE 'categories: skipped (view)'; END IF;
END $$;

-- ── announcements ─────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='announcements') = 'BASE TABLE' THEN
    ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "announcements_select_public" ON announcements;
    CREATE POLICY "announcements_select_public" ON announcements FOR SELECT USING (true);
    RAISE NOTICE 'announcements: done';
  ELSE RAISE NOTICE 'announcements: skipped (view)'; END IF;
END $$;

-- ── prompt_samples ────────────────────────────────────────
DO $$ BEGIN
  IF (SELECT table_type FROM information_schema.tables WHERE table_schema='public' AND table_name='prompt_samples') = 'BASE TABLE' THEN
    ALTER TABLE prompt_samples ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "prompt_samples_select_public" ON prompt_samples;
    CREATE POLICY "prompt_samples_select_public" ON prompt_samples FOR SELECT USING (true);
    RAISE NOTICE 'prompt_samples: done';
  ELSE RAISE NOTICE 'prompt_samples: skipped (view)'; END IF;
END $$;
