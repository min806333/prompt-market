import urllib.request, json, sys
t = sys.argv[1]
req = urllib.request.Request(
    "https://api.github.com/repos/min806333/daily-battle-privacy/contents/index.html",
    headers={"Authorization": f"Bearer {t}", "Accept": "application/vnd.github+json"}
)
d = json.loads(urllib.request.urlopen(req).read())
print("name   :", d.get("name"))
print("size   :", d.get("size"), "bytes")
print("sha    :", d.get("sha"))
print("path   :", d.get("path"))
