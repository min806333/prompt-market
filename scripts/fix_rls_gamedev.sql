-- ============================================================
-- gamedev-ai-toolkit RLS 보안 수정 스크립트 (qvneqyctxlobeoroczya)
-- 실행: Supabase Dashboard > SQL Editor 에 붙여넣기 후 실행
-- https://supabase.com/dashboard/project/qvneqyctxlobeoroczya/sql
-- ============================================================

-- profiles (본인만 접근)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- users (본인만 접근)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

-- generations (본인만 접근)
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "generations_select_own" ON generations;
DROP POLICY IF EXISTS "generations_insert_own" ON generations;
CREATE POLICY "generations_select_own" ON generations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "generations_insert_own" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- usage_logs (본인만 접근)
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "usage_logs_select_own" ON usage_logs;
DROP POLICY IF EXISTS "usage_logs_insert_own" ON usage_logs;
CREATE POLICY "usage_logs_select_own" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "usage_logs_insert_own" ON usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- usage_limits (본인만 접근)
ALTER TABLE usage_limits ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "usage_limits_select_own" ON usage_limits;
CREATE POLICY "usage_limits_select_own" ON usage_limits
  FOR SELECT USING (auth.uid() = user_id);

-- ai_cache (서비스 롤만 — 내부 캐시, 사용자 접근 불필요)
ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;
-- 정책 없음 = anon/authenticated 차단, service_role만 접근

-- stripe_events (서비스 롤만 — 결제 웹훅 데이터)
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
-- 정책 없음 = 완전 차단
