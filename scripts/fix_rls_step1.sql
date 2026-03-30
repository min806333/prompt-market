-- ============================================================
-- Supabase RLS 보안 수정 스크립트 (csxhlbsdtrjjronbpalu) v6
-- DO 블록 없이 직접 실행 — 뷰(product_ratings 등) 제외
-- Supabase SQL Editor에 붙여넣기 후 Run
-- ============================================================

-- 1) RLS 활성화
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports            ENABLE ROW LEVEL SECURITY;
ALTER TABLE playground_usage   ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE creators           ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_failures   ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_leads        ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews            ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_samples     ENABLE ROW LEVEL SECURITY;
