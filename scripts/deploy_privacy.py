import urllib.request, urllib.error, json, base64, pathlib, sys

TOKEN = sys.argv[1]
USER  = "min806333"
REPO  = "daily-battle-privacy"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
}

def api(method, path, data=None):
    url = f"https://api.github.com{path}"
    body = json.dumps(data).encode() if data else None
    req  = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read()), r.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read()), e.code

# 1) 레포 생성
print("1. 레포 생성 중...")
res, status = api("POST", "/user/repos", {
    "name": REPO, "description": "Daily Battle 2048 Privacy Policy",
    "private": False, "auto_init": True
})
if status in (201, 422):  # 422 = already exists
    print(f"   {'생성 완료' if status==201 else '이미 존재'}: https://github.com/{USER}/{REPO}")
else:
    print(f"   오류 {status}: {res}"); sys.exit(1)

# 2) 파일 내용 읽기
html_path = pathlib.Path(r"C:\Users\qpwsw\.verdent\verdent-projects\MvpSite\store_assets\privacy-policy.html")
content_b64 = base64.b64encode(html_path.read_bytes()).decode()

# 3) 기존 index.html SHA 조회 (업데이트 시 필요)
print("2. 기존 파일 SHA 조회...")
existing, _ = api("GET", f"/repos/{USER}/{REPO}/contents/index.html")
sha = existing.get("sha")

# 4) index.html 업로드
print("3. index.html 업로드...")
payload = {
    "message": "Add privacy policy page",
    "content": content_b64,
}
if sha:
    payload["sha"] = sha
res2, status2 = api("PUT", f"/repos/{USER}/{REPO}/contents/index.html", payload)
print(f"   {'완료' if status2 in (200,201) else f'오류 {status2}'}")

# 5) GitHub Pages 활성화
print("4. GitHub Pages 활성화...")
res3, status3 = api("POST", f"/repos/{USER}/{REPO}/pages", {
    "source": {"branch": "main", "path": "/"}
})
if status3 in (201, 409):  # 409 = already enabled
    print(f"   {'활성화 완료' if status3==201 else '이미 활성화됨'}")
else:
    print(f"   Pages 응답 {status3}: {res3}")

print(f"\n✓ 완료! URL (1~2분 후 접속 가능):")
print(f"  https://{USER}.github.io/{REPO}/")
