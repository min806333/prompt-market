-- ============================================================
-- STEP 2: 정책 생성
-- fix_rls_step1.sql 실행 후 이 파일 실행
-- ============================================================

-- profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- orders
DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (auth.uid() = user_id);

-- subscriptions
DROP POLICY IF EXISTS "subscriptions_select_own" ON subscriptions;
CREATE POLICY "subscriptions_select_own" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- favorites
DROP POLICY IF EXISTS "favorites_select_own"   ON favorites;
DROP POLICY IF EXISTS "favorites_insert_own"   ON favorites;
DROP POLICY IF EXISTS "favorites_delete_own"   ON favorites;
CREATE POLICY "favorites_select_own"  ON favorites FOR SELECT USING     (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own"  ON favorites FOR INSERT WITH CHECK(auth.uid() = user_id);
CREATE POLICY "favorites_delete_own"  ON favorites FOR DELETE USING     (auth.uid() = user_id);

-- reports
DROP POLICY IF EXISTS "reports_select_own"  ON reports;
DROP POLICY IF EXISTS "reports_insert_own"  ON reports;
CREATE POLICY "reports_select_own"  ON reports FOR SELECT USING     (auth.uid() = reporter_id);
CREATE POLICY "reports_insert_own"  ON reports FOR INSERT WITH CHECK(auth.uid() = reporter_id);

-- playground_usage
DROP POLICY IF EXISTS "playground_usage_select_own"  ON playground_usage;
DROP POLICY IF EXISTS "playground_usage_insert_own"  ON playground_usage;
CREATE POLICY "playground_usage_select_own"  ON playground_usage FOR SELECT USING     (auth.uid() = user_id);
CREATE POLICY "playground_usage_insert_own"  ON playground_usage FOR INSERT WITH CHECK(auth.uid() = user_id);

-- commissions (seller_id)
DROP POLICY IF EXISTS "commissions_select_own" ON commissions;
CREATE POLICY "commissions_select_own" ON commissions FOR SELECT USING (auth.uid() = seller_id);

-- payouts (creator_id)
DROP POLICY IF EXISTS "payouts_select_own" ON payouts;
CREATE POLICY "payouts_select_own" ON payouts FOR SELECT USING (auth.uid() = creator_id);

-- creators (공개 읽기, user_id로 수정)
DROP POLICY IF EXISTS "creators_select_public" ON creators;
DROP POLICY IF EXISTS "creators_update_own"    ON creators;
CREATE POLICY "creators_select_public" ON creators FOR SELECT USING (true);
CREATE POLICY "creators_update_own"    ON creators FOR UPDATE USING (auth.uid() = user_id);

-- support_tickets (INSERT 공개, SELECT 차단)
DROP POLICY IF EXISTS "support_tickets_insert_anon" ON support_tickets;
CREATE POLICY "support_tickets_insert_anon" ON support_tickets FOR INSERT WITH CHECK (true);

-- email_leads (INSERT만 허용)
DROP POLICY IF EXISTS "email_leads_insert_anon" ON email_leads;
CREATE POLICY "email_leads_insert_anon" ON email_leads FOR INSERT WITH CHECK (true);

-- reviews (공개 읽기, 본인 작성)
DROP POLICY IF EXISTS "reviews_select_public" ON reviews;
DROP POLICY IF EXISTS "reviews_insert_own"    ON reviews;
CREATE POLICY "reviews_select_public" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own"    ON reviews FOR INSERT WITH CHECK(auth.uid() = user_id);

-- products (공개 읽기, creator_id로 쓰기)
DROP POLICY IF EXISTS "products_select_public"  ON products;
DROP POLICY IF EXISTS "products_insert_owner"   ON products;
DROP POLICY IF EXISTS "products_update_owner"   ON products;
CREATE POLICY "products_select_public"  ON products FOR SELECT USING (true);
CREATE POLICY "products_insert_owner"   ON products FOR INSERT WITH CHECK(auth.uid() = creator_id);
CREATE POLICY "products_update_owner"   ON products FOR UPDATE USING (auth.uid() = creator_id);

-- categories, announcements, prompt_samples (공개 읽기)
DROP POLICY IF EXISTS "categories_select_public"    ON categories;
CREATE POLICY "categories_select_public"    ON categories    FOR SELECT USING (true);

DROP POLICY IF EXISTS "announcements_select_public" ON announcements;
CREATE POLICY "announcements_select_public" ON announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "prompt_samples_select_public" ON prompt_samples;
CREATE POLICY "prompt_samples_select_public" ON prompt_samples FOR SELECT USING (true);

-- payment_failures, processed_events, webhook_event_stats
-- 정책 없음 = service_role만 접근 가능 (완전 차단)
