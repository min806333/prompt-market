import urllib.request, json, urllib.error

URL = "https://csxhlbsdtrjjronbpalu.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeGhsYnNkdHJqanJvbmJwYWx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzMTg1MiwiZXhwIjoyMDg4OTA3ODUyfQ.BnXmE1zUfefaERr5iVNQ84xFBHgNxjDKlZzhNMwU-Lc"

h = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}

# 모든 후보 테이블명
candidates = [
    "prompt_samples","support_tickets","commissions","webhook_event_stats",
    "payouts","orders","subscriptions","profiles","favorites","reports",
    "creators","products","announcements","product_ratings","payment_failures",
    "processed_events","playground_usage","products_with_category",
    "active_subscriptions","completed_orders","email_leads","seller_products",
    "categories","reviews"
]

print("=== ALTER RLS 가능 여부 테스트 ===")
print("(각 테이블에 ENABLE ROW LEVEL SECURITY 시도 — 뷰면 에러)")
print()

views = []
tables = []

for t in candidates:
    # OPTIONS 로 테이블 정보 확인
    req = urllib.request.Request(
        f"{URL}/rest/v1/{t}",
        headers={**h, "Accept": "application/openapi+json"},
        method="OPTIONS"
    )
    try:
        with urllib.request.urlopen(req) as r:
            body = r.read().decode()
            # definition 힌트
            if '"is-view":true' in body or '"isView":true' in body:
                views.append(t)
                print(f"  VIEW   {t}")
            else:
                tables.append(t)
                print(f"  TABLE  {t}")
    except Exception as e:
        print(f"  ?????  {t}  ({e})")

print()
print("VIEW  목록:", views)
print("TABLE 목록:", tables)
