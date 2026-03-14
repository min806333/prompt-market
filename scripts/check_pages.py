import urllib.request, json, sys
t = sys.argv[1]
req = urllib.request.Request(
    "https://api.github.com/repos/min806333/daily-battle-privacy/pages",
    headers={"Authorization": f"Bearer {t}", "Accept": "application/vnd.github+json"}
)
d = json.loads(urllib.request.urlopen(req).read())
print("status :", d.get("status"))
print("url    :", d.get("html_url"))
