import urllib.request, json, urllib.error

URL  = "https://csxhlbsdtrjjronbpalu.supabase.co"
KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeGhsYnNkdHJqanJvbmJwYWx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzMTg1MiwiZXhwIjoyMDg4OTA3ODUyfQ.BnXmE1zUfefaERr5iVNQ84xFBHgNxjDKlZzhNMwU-Lc"
ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeGhsYnNkdHJqanJvbmJwYWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzE4NTIsImV4cCI6MjA4ODkwNzg1Mn0.o4Jh3GCD9N9tKHhTWKqro5TZt2cnuKDw39WDYTwV79Q"

svc_h  = {"apikey": KEY,  "Authorization": "Bearer " + KEY}
anon_h = {"apikey": ANON, "Authorization": "Bearer " + ANON}

# 민감 테이블: anon이 0건 이어야 정상 (RLS 필터링)
sensitive = [
    "profiles", "orders", "subscriptions", "favorites", "reports",
    "playground_usage", "commissions", "payouts", "creators",
    "support_tickets", "payment_failures", "processed_events", "email_leads"
]

# 공개 테이블: anon이 데이터 볼 수 있어야 정상
public = ["products", "categories", "announcements", "prompt_samples", "reviews"]

# service_role로 실제 데이터 건수 확인
def count_svc(t):
    req = urllib.request.Request(
        f"{URL}/rest/v1/{t}?limit=5",
        headers={**svc_h, "Prefer": "count=exact"}
    )
    try:
        with urllib.request.urlopen(req) as r:
            rows = json.loads(r.read())
            return len(rows)
    except:
        return -1

# anon으로 접근해서 건수 확인
def count_anon(t):
    req = urllib.request.Request(
        f"{URL}/rest/v1/{t}?limit=5",
        headers=anon_h
    )
    try:
        with urllib.request.urlopen(req) as r:
            rows = json.loads(r.read())
            return len(rows)
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code}"
    except Exception as e:
        return f"err"

print("=" * 70)
print(f"  {'테이블':<30} {'svc건수':>8}  {'anon건수':>8}  결과")
print("=" * 70)

print("\n[민감 테이블 — anon 0건이어야 정상]")
all_ok = True
for t in sensitive:
    svc = count_svc(t)
    anon = count_anon(t)
    if svc > 0 and anon == 0:
        status = "OK  (RLS 적용, 필터링됨)"
    elif svc == 0 and anon == 0:
        status = "OK  (데이터 없음)"
    elif isinstance(anon, str):
        status = f"OK  ({anon} 차단)"
    else:
        status = f"FAIL (anon {anon}건 노출!)"
        all_ok = False
    print(f"  {t:<30} {str(svc):>8}  {str(anon):>8}  {status}")

print("\n[공개 테이블 — anon 접근 가능해야 정상]")
for t in public:
    svc = count_svc(t)
    anon = count_anon(t)
    if isinstance(anon, int) and anon >= 0:
        status = "OK  (공개 접근 정상)"
    else:
        status = f"WARN ({anon})"
    print(f"  {t:<30} {str(svc):>8}  {str(anon):>8}  {status}")

print()
print("=" * 70)
print("  결론:", "모든 민감 테이블 보호 완료" if all_ok else "일부 테이블 추가 조치 필요")
