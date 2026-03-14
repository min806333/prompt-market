"""
Daily Battle 2048 - Store Assets Generator v2
- 한글 깨짐 수정 (NotoSansKR / 맑은 고딕)
- 앱 아이콘: 그라데이션 + 타일 레이아웃 클린 디자인
- 스크린샷: 실제 앱 UI 반영, 한글 정상 출력
- 피처 그래픽: 1024x500
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, os, sys

# ── 한글 지원 폰트 ──────────────────────────────────────────────
FONT_REGULAR = "C:/Windows/Fonts/NotoSansKR-VF.ttf"
FONT_BOLD    = "C:/Windows/Fonts/malgunbd.ttf"
FONT_NORMAL  = "C:/Windows/Fonts/malgun.ttf"

def F(size, bold=False):
    path = FONT_BOLD if bold else FONT_NORMAL
    if not os.path.exists(path):
        path = FONT_REGULAR
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

# ── 색상 팔레트 ──────────────────────────────────────────────────
BG        = (13,  13,  25)
BG2       = (22,  22,  38)
ACCENT    = (246, 94,  59)
ACCENT2   = (255, 190, 60)
TILE_CLR  = {
    0:    ((45, 45, 65), (200,200,200)),
    2:    ((238,228,218),(119,110,101)),
    4:    ((237,224,200),(119,110,101)),
    8:    ((242,177,121),(255,255,255)),
    16:   ((245,149,99), (255,255,255)),
    32:   ((246,124,95), (255,255,255)),
    64:   ((246,94, 59), (255,255,255)),
    128:  ((237,207,114),(255,255,255)),
    256:  ((237,204,97), (255,255,255)),
    512:  ((237,200,80), (255,255,255)),
    1024: ((237,197,63), (255,255,255)),
    2048: ((60, 58, 50), (255,255,255)),
}
WHITE  = (255,255,255)
GRAY   = (140,140,165)
BOARD  = (28, 28, 46)
CELL   = (42, 42, 65)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "store_assets")
os.makedirs(OUT, exist_ok=True)

# ── 유틸 ────────────────────────────────────────────────────────
def rr(draw, x0,y0,x1,y1, r, fill):
    draw.rounded_rectangle([x0,y0,x1,y1], radius=r, fill=fill)

def centered_text(draw, cx, cy, text, font, color):
    bb = draw.textbbox((0,0), text, font=font)
    w, h = bb[2]-bb[0], bb[3]-bb[1]
    draw.text((cx - w//2, cy - h//2 - bb[1]//2), text, fill=color, font=font)

def draw_tile(draw, x, y, size, val):
    bg, tc = TILE_CLR.get(val, TILE_CLR[2048])
    r = max(4, size//8)
    rr(draw, x,y, x+size,y+size, r, bg)
    if val > 0:
        fs = int(size*0.38) if val<100 else int(size*0.30) if val<1000 else int(size*0.23)
        centered_text(draw, x+size//2, y+size//2, str(val), F(fs, bold=True), tc)

def gradient_bg(img, color_top, color_bot):
    """수직 그라데이션을 PIL로 구현"""
    draw = ImageDraw.Draw(img)
    w, h = img.size
    for y in range(h):
        t = y / h
        c = tuple(int(color_top[i] + (color_bot[i]-color_top[i])*t) for i in range(3))
        draw.line([(0,y),(w,y)], fill=c)
    return draw


# ════════════════════════════════════════════════════════════════
# 1. 앱 아이콘  —  클린 그라데이션 + 2048 타일 레이아웃
# ════════════════════════════════════════════════════════════════
def make_icon(size):
    img = Image.new("RGBA", (size,size), (0,0,0,0))
    base = Image.new("RGBA", (size,size), (0,0,0,0))
    draw = ImageDraw.Draw(base)

    pad = int(size*0.0)
    rad = int(size*0.22)

    # 배경 그라데이션 (진한 남색 → 진보라)
    for y in range(size):
        t = y/size
        c = (
            int(18 + (38-18)*t),
            int(18 + (10-18)*t),
            int(40 + (70-40)*t),
            255
        )
        draw.line([(pad,y),(size-pad,y)], fill=c)

    # 마스크로 둥근 사각형 만들기
    mask = Image.new("L", (size,size), 0)
    mask_d = ImageDraw.Draw(mask)
    mask_d.rounded_rectangle([pad,pad,size-pad,size-pad], radius=rad, fill=255)
    base.putalpha(mask)

    # 합성
    img.paste(base, (0,0), base)
    draw = ImageDraw.Draw(img)

    # 미니 4×4 그리드 (하단 60%)
    board_vals = [
        [2048, 256,  32,  4],
        [ 512, 128,  16,  2],
        [ 256,  64,   8,  0],
        [  64,  16,   0,  0],
    ]
    gap  = int(size*0.028)
    bpad = int(size*0.10)
    cell = (size - bpad*2 - gap*5) // 4
    top  = int(size*0.45)

    # 보드 배경
    rr(draw, bpad-gap, top-gap, size-bpad+gap, size-bpad+gap//2, int(size*0.05), (0,0,0,80))

    for r in range(4):
        for c2 in range(4):
            cx = bpad + gap + c2*(cell+gap)
            cy = top  + gap + r*(cell+gap)
            draw_tile(draw, cx, cy, cell, board_vals[r][c2])

    # 상단 "2048" 텍스트
    f_num = F(int(size*0.24), bold=True)
    # 그림자
    draw.text((int(size*0.13)+2, int(size*0.08)+2), "2048",
              fill=(0,0,0,100), font=f_num)
    # 그라데이션 느낌 — 골드
    draw.text((int(size*0.13), int(size*0.08)), "2048",
              fill=ACCENT2, font=f_num)

    # "DAILY BATTLE" 서브
    f_sub = F(int(size*0.082))
    draw.text((int(size*0.13), int(size*0.38)), "DAILY BATTLE",
              fill=(220,220,255,200), font=f_sub)

    # 오른쪽 상단 작은 오렌지 점 장식
    dot_r = int(size*0.04)
    draw.ellipse([size-bpad-dot_r, bpad, size-bpad+dot_r, bpad+dot_r*2],
                 fill=ACCENT)

    return img

icon_512 = make_icon(512)
icon_512.save(os.path.join(OUT, "icon_512.png"))
print("✓ icon_512.png")

for density, px in [("mdpi",48),("hdpi",72),("xhdpi",96),("xxhdpi",144),("xxxhdpi",192)]:
    make_icon(px).save(os.path.join(OUT, f"ic_launcher_{density}.png"))
    print(f"  ✓ ic_launcher_{density}.png")


# ════════════════════════════════════════════════════════════════
# 2. 스크린샷  1080×1920
# ════════════════════════════════════════════════════════════════
W, H = 1080, 1920

def new_screen():
    img = Image.new("RGB", (W,H), BG)
    draw = ImageDraw.Draw(img)
    # 상단 그라데이션 오버레이
    for y in range(300):
        t = 1 - y/300
        c = tuple(int(BG[i] + (ACCENT[i]-BG[i])*t*0.18) for i in range(3))
        draw.line([(0,y),(W,y)], fill=c)
    return img, draw

def top_bar(draw, title, sub):
    # 앱명
    draw.text((54, 62), "Daily Battle 2048", fill=WHITE, font=F(48, bold=True))
    draw.line([(54,122),(W-54,122)], fill=(50,50,75), width=2)
    # 화면 제목
    f = F(72, bold=True)
    bb = draw.textbbox((0,0), title, font=f)
    draw.text(((W-bb[2]+bb[0])//2, 158), title, fill=WHITE, font=f)
    # 부제
    fs = F(32)
    bb2 = draw.textbbox((0,0), sub, font=fs)
    draw.text(((W-bb2[2]+bb2[0])//2, 252), sub, fill=GRAY, font=fs)

def btn(draw, x,y,w,h, text, color=ACCENT, tc=WHITE):
    rr(draw, x,y,x+w,y+h, h//2, color)
    centered_text(draw, x+w//2, y+h//2, text, F(int(h*0.40), bold=True), tc)

def score_box(draw, x,y,w,h, label, val, bg=BOARD):
    rr(draw, x,y,x+w,y+h, 18, bg)
    centered_text(draw, x+w//2, y+28, label, F(26), GRAY)
    centered_text(draw, x+w//2, y+h-32, val,   F(44,bold=True), WHITE)

def draw_board(draw, board, top, bw):
    gap = 14
    cell = (bw - gap*5)//4
    left = (W-bw)//2
    rr(draw, left-gap, top-gap, left+bw+gap, top+bw+gap*2, 22, BOARD)
    for r in range(4):
        for c in range(4):
            draw_tile(draw, left+gap+c*(cell+gap), top+gap+r*(cell+gap), cell, board[r][c])


# ── 스크린샷 1: 홈 화면 ──────────────────────────────────────────
img, draw = new_screen()
top_bar(draw, "홈", "오늘의 배틀에 참가하세요")

modes = [
    ("⚔️", "Daily Battle",   "오늘의 랭킹 도전", ACCENT),
    ("♾️", "클래식 2048",    "무제한 자유 플레이", (70,150,230)),
    ("📅", "주간 챌린지",    "이번 주 최고 점수", (130,80,240)),
    ("🏆", "글로벌 랭킹",    "전세계 순위 확인", (220,160,40)),
    ("🎯", "일일 미션",      "오늘의 미션 3개",  (60,190,110)),
    ("🔥", "출석 스트릭",    "7일 연속 접속 중", (246,124,95)),
]
cw, ch, gap_c = 462, 190, 22
sy = 330
for i,(icon,title,sub,color) in enumerate(modes):
    r2,c2 = divmod(i,2)
    x = 54 + c2*(cw+gap_c)
    y = sy + r2*(ch+gap_c)
    rr(draw, x,y,x+cw,y+ch, 22, BOARD)
    rr(draw, x,y,x+7,y+ch, 4, color)      # 왼쪽 컬러 바
    draw.text((x+24, y+30), icon, font=F(44), fill=WHITE)
    draw.text((x+90, y+28), title, font=F(38,bold=True), fill=WHITE)
    draw.text((x+90, y+80), sub,   font=F(28), fill=GRAY)

# 오늘 참여자
f_b = F(30)
txt = "오늘 참여자  1,284명 · 최고 점수 32,768"
bb = draw.textbbox((0,0),txt,font=f_b)
bw2 = bb[2]-bb[0]+48
rr(draw,(W-bw2)//2,1438,(W+bw2)//2,1490,24,BOARD)
draw.text(((W-(bb[2]-bb[0]))//2, 1448), txt, fill=ACCENT2, font=f_b)

btn(draw, 80, 1540, W-160, 104, "오늘의 배틀 시작하기  →")
img.save(os.path.join(OUT,"screenshot_01_home.png"))
print("✓ screenshot_01_home.png")


# ── 스크린샷 2: 게임 플레이 ──────────────────────────────────────
img, draw = new_screen()
top_bar(draw, "Daily Battle", "2026-03-13  ·  도전 2/3")

score_box(draw, 54,  300, 300,140, "점수",   "15,240")
score_box(draw, 390, 300, 300,140, "최고",   "21,888")
score_box(draw, 726, 300, 300,140, "이동",   "87회")

board = [
    [1024, 512, 128, 32],
    [ 256,  64,  16,  8],
    [  32,  16,   4,  2],
    [   8,   4,   2,  0],
]
draw_board(draw, board, 488, 970)

draw.text((54,1580), "⏱  02:34", fill=ACCENT2, font=F(48,bold=True))
f_hint = F(32)
hint = "← → ↑ ↓   스와이프 또는 방향키"
bb = draw.textbbox((0,0),hint,font=f_hint)
draw.text(((W-(bb[2]-bb[0]))//2, 1650), hint, fill=GRAY, font=f_hint)
img.save(os.path.join(OUT,"screenshot_02_gameplay.png"))
print("✓ screenshot_02_gameplay.png")


# ── 스크린샷 3: 결과 화면 ────────────────────────────────────────
img, draw = new_screen()
top_bar(draw, "게임 결과", "Daily Battle 완료!")

rr(draw, 54,310,W-54,860, 28, BOARD)

# 점수
draw.text((W//2 - 160, 340), "18,560", fill=ACCENT2, font=F(100,bold=True))
bb = draw.textbbox((0,0),"최종 점수",font=F(34))
draw.text(((W-(bb[2]-bb[0]))//2,462),"최종 점수",fill=GRAY,font=F(34))

stats=[("최고 타일","1024"),("이동 수","94회"),("시간","2:48"),("순위","#127")]
sw2 = (W-108-54*2)//4
for i,(l,v) in enumerate(stats):
    score_box(draw,54+i*(sw2+18),560,sw2,240,l,v)

# 상위% 배지
pct = "상위  12%"
f_pct = F(54,bold=True)
bb=draw.textbbox((0,0),pct,font=f_pct); pw=bb[2]-bb[0]+64
rr(draw,(W-pw)//2,866,(W+pw)//2,966,48,ACCENT)
draw.text(((W-(bb[2]-bb[0]))//2,882),pct,fill=WHITE,font=f_pct)

# 비교 바
labels=[("나",18560,ACCENT),("평균",9200,(100,100,160)),("상위 10%",24000,ACCENT2)]
bx, bmax, by2 = 80, 26000, 1010
for lbl,val,color in labels:
    fw = int((W-160)*val/bmax)
    rr(draw,bx,by2,bx+(W-160),by2+44,10,CELL)
    rr(draw,bx,by2,bx+fw,by2+44,10,color)
    draw.text((bx+fw+16,by2+6),f"{lbl}: {val:,}",fill=WHITE,font=F(28))
    by2 += 76

btn(draw,80,1360,W-160,104,"결과 공유하기  📤")
btn(draw,80,1482,W-160,104,"리더보드 보기  🏆",(50,50,85))
img.save(os.path.join(OUT,"screenshot_03_result.png"))
print("✓ screenshot_03_result.png")


# ── 스크린샷 4: 글로벌 랭킹 ─────────────────────────────────────
img, draw = new_screen()
top_bar(draw, "글로벌 랭킹", "2026-03-13  Daily Battle")

entries=[
    ("KingTile",  28400,2048,72,False),
    ("DailyPro",  25120,1024,84,False),
    ("PuzzleMstr",23880,1024,91,False),
    ("나",        18560,1024,94,True),
    ("SwipeKing", 17200, 512,98,False),
    ("TileHunter",16800, 512,102,False),
    ("Lucky2048", 15400, 256,88,False),
]
medals=["🥇","🥈","🥉"]
ry=330; rh=116
for i,(name,score,tile,moves,is_me) in enumerate(entries):
    bg2=(52,42,28) if is_me else BOARD
    rr(draw,54,ry,W-54,ry+rh-8,18,bg2)
    if is_me:
        rr(draw,54,ry,62,ry+rh-8,4,ACCENT)
    rank = medals[i] if i<3 else f"#{i+1}"
    draw.text((74,ry+30),rank,fill=WHITE,font=F(40,bold=True))
    name_c = ACCENT2 if is_me else WHITE
    draw.text((190,ry+16),name+(" (나)" if is_me else ""),fill=name_c,font=F(38,bold=True))
    draw.text((190,ry+66),f"이동 {moves}회  최고 타일 {tile}",fill=GRAY,font=F(28))
    sc_str = f"{score:,}"
    bb=draw.textbbox((0,0),sc_str,font=F(38,bold=True))
    draw.text((W-54-(bb[2]-bb[0])-20,ry+30),sc_str,fill=ACCENT2,font=F(38,bold=True))
    ry += rh
img.save(os.path.join(OUT,"screenshot_04_leaderboard.png"))
print("✓ screenshot_04_leaderboard.png")


# ── 스크린샷 5: 일일 미션 ────────────────────────────────────────
img, draw = new_screen()
top_bar(draw, "일일 미션", "오늘의 미션 3개를 달성하세요")

missions=[
    ("🎯 스코어 도전","10,000점 이상 달성", 85, ACCENT, False),
    ("🔢 타일 마스터","256 타일 만들기",    100,(60,190,110),True),
    ("⚡ 스피드 런",  "3분 안에 게임 완료",  42,(100,140,255),False),
]
my=330
for title,desc,pct,color,done in missions:
    rr(draw,54,my,W-54,my+248,24,BOARD)
    draw.text((80,my+28),title,fill=WHITE,font=F(44,bold=True))
    draw.text((80,my+90),desc, fill=GRAY, font=F(32))
    bx2=80; bw3=W-108-80; by3=my+158
    rr(draw,bx2,by3,bx2+bw3,by3+30,14,CELL)
    rr(draw,bx2,by3,bx2+int(bw3*pct/100),by3+30,14,color)
    draw.text((bx2+bw3+16,by3+2),f"{pct}%",fill=color,font=F(28))
    if done:
        rr(draw,W-200,my+22,W-62,my+78,28,(50,180,100))
        bb=draw.textbbox((0,0),"완료 ✓",font=F(30,bold=True))
        draw.text((W-194,my+32),"완료 ✓",fill=WHITE,font=F(30,bold=True))
    my+=272

# 스트릭 카드
rr(draw,54,1190,W-54,1410,24,BOARD)
draw.text((80,1218),"🔥 연속 출석 7일째!",fill=ACCENT2,font=F(46,bold=True))
draw.text((80,1290),"오늘도 접속해서 스트릭을 유지하세요",fill=GRAY,font=F(32))
for d in range(7):
    cx=80+d*124
    col=ACCENT if d<7 else CELL
    draw.ellipse([cx,1348,cx+88,1388],fill=col)

img.save(os.path.join(OUT,"screenshot_05_missions.png"))
print("✓ screenshot_05_missions.png")


# ════════════════════════════════════════════════════════════════
# 3. 피처 그래픽  1024×500
# ════════════════════════════════════════════════════════════════
FW, FH = 1024, 500
fimg = Image.new("RGB",(FW,FH),BG)
fdraw = ImageDraw.Draw(fimg)

# 그라데이션 배경
for y in range(FH):
    t=y/FH
    c=(int(18+(30-18)*t), int(12+(8-12)*t), int(40+(65-40)*t))
    fdraw.line([(0,y),(FW,y)],fill=c)

# 오른쪽 미니 게임 보드
bvals=[[2048,256,64,8],[512,128,32,4],[64,32,16,2],[8,4,2,0]]
fc=72; fg=10; fbl=FW-400
for r2 in range(4):
    for c2 in range(4):
        draw_tile(fdraw, fbl+fg+c2*(fc+fg), 60+fg+r2*(fc+fg), fc, bvals[r2][c2])

# 왼쪽 텍스트
fdraw.text((54, 80), "2048",          fill=ACCENT2, font=F(130,bold=True))
fdraw.text((54, 230),"Daily Battle",  fill=WHITE,   font=F(62,bold=True))
fdraw.text((54, 308),"매일 같은 시드, 글로벌 경쟁", fill=GRAY, font=F(36))

# 하단 태그라인
rr(fdraw, 54,400,420,452, 24, ACCENT)
fdraw.text((80,408),"지금 바로 도전하세요", fill=WHITE, font=F(32,bold=True))

# 오른쪽 상단 점 장식
for i,r3 in enumerate([8,14,10]):
    fdraw.ellipse([FW-60-i*30-r3, 22-r3, FW-60-i*30+r3, 22+r3], fill=ACCENT if i==0 else ACCENT2)

fimg.save(os.path.join(OUT,"feature_graphic_1024x500.png"))
print("✓ feature_graphic_1024x500.png")

print(f"\n모든 파일 저장: {os.path.abspath(OUT)}")
