import urllib.request, json

URL = "https://csxhlbsdtrjjronbpalu.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeGhsYnNkdHJqanJvbmJwYWx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzMTg1MiwiZXhwIjoyMDg4OTA3ODUyfQ.BnXmE1zUfefaERr5iVNQ84xFBHgNxjDKlZzhNMwU-Lc"
ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeGhsYnNkdHJqanJvbmJwYWx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMzE4NTIsImV4cCI6MjA4ODkwNzg1Mn0.o4Jh3GCD9N9tKHhTWKqro5TZt2cnuKDw39WDYTwV79Q"

h = {"apikey": KEY, "Authorization": f"Bearer {KEY}"}
req = urllib.request.Request(f"{URL}/rest/v1/", headers=h)
with urllib.request.urlopen(req) as r:
    d = json.loads(r.read())
    tables = list(d.get("definitions", {}).keys())
    print("=== 모든 테이블 ===")
    for t in tables:
        print(f"  {t}")

print()
print("=== anon이 직접 접근 가능한 테이블 테스트 ===")
anon_h = {"apikey": ANON, "Authorization": f"Bearer {ANON}"}
for t in tables:
    req2 = urllib.request.Request(f"{URL}/rest/v1/{t}?limit=1", headers=anon_h)
    try:
        with urllib.request.urlopen(req2) as r2:
            rows = json.loads(r2.read())
            print(f"  {t:<35} ← anon 접근 가능! {len(rows)}건")
    except urllib.error.HTTPError as e:
        code = e.code
        print(f"  {t:<35} HTTP {code} (차단됨)")
