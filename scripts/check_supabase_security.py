import urllib.request, json

URL  = "https://csxhlbsdtrjjronbpalu.supabase.co"
KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzeGhsYnNkdHJqanJvbmJwYWx1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzMzMTg1MiwiZXhwIjoyMDg4OTA3ODUyfQ.BnXmE1zUfefaERr5iVNQ84xFBHgNxjDKlZzhNMwU-Lc"

h = {"apikey": KEY, "Authorization": "Bearer " + KEY}

# pg_policies 시스템 카탈로그 조회
req = urllib.request.Request(
    URL + "/rest/v1/pg_policies?tablename=eq.support_tickets&select=policyname,cmd,qual,with_check,roles",
    headers=h
)
try:
    with urllib.request.urlopen(req) as r:
        rows = json.loads(r.read())
        print("=== support_tickets 현재 정책 ===")
        if rows:
            for row in rows:
                print(f"  {row}")
        else:
            print("  정책 없음 (pg_policies 접근 불가)")
except Exception as e:
    print(f"pg_policies 오류: {e}")

# pg_tables 로 RLS 활성화 여부 확인
req2 = urllib.request.Request(
    URL + "/rest/v1/pg_tables?tablename=eq.support_tickets&select=tablename,rowsecurity",
    headers=h
)
try:
    with urllib.request.urlopen(req2) as r:
        rows2 = json.loads(r.read())
        print("\n=== support_tickets RLS 상태 ===")
        print(f"  {rows2}")
except Exception as e:
    print(f"pg_tables 오류: {e}")
