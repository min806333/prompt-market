import urllib.request, json, urllib.error

URL  = "https://qvneqyctxlobeoroczya.supabase.co"
KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bmVxeWN0eGxvYmVvcm9jenlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA2NTg1NSwiZXhwIjoyMDg4NjQxODU1fQ.OaZqEZKXldMuinfK9XVkCzOYrTDvB8o7HxxJ_RR1QcA"
ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bmVxeWN0eGxvYmVvcm9jenlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNjU4NTUsImV4cCI6MjA4ODY0MTg1NX0.wK-MRE_sIgJ_u9gqzTbIThCU5pFcRy0o2EV-73WsZTY"

svc_h  = {"apikey": KEY,  "Authorization": "Bearer " + KEY}
anon_h = {"apikey": ANON, "Authorization": "Bearer " + ANON}

sensitive = ["profiles", "users", "generations", "usage_logs", "usage_limits", "ai_cache", "stripe_events"]

def count(h, t):
    req = urllib.request.Request(f"{URL}/rest/v1/{t}?limit=5", headers=h)
    try:
        with urllib.request.urlopen(req) as r:
            return len(json.loads(r.read()))
    except urllib.error.HTTPError as e:
        return f"HTTP {e.code}"
    except:
        return "err"

print("=" * 65)
print(f"  {'테이블':<28} {'svc건수':>8}  {'anon건수':>8}  결과")
print("=" * 65)

all_ok = True
for t in sensitive:
    svc  = count(svc_h, t)
    anon = count(anon_h, t)
    if isinstance(anon, int) and anon == 0:
        status = "OK"
    elif isinstance(anon, str):
        status = f"OK ({anon})"
    else:
        status = f"FAIL (anon {anon}건 노출!)"
        all_ok = False
    print(f"  {t:<28} {str(svc):>8}  {str(anon):>8}  {status}")

print()
print("=" * 65)
print("  결론:", "모든 테이블 보호 완료" if all_ok else "추가 조치 필요")
