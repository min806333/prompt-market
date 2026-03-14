// 메모리 기반 Rate Limiter (서버리스 환경용 간단 구현)
// 프로덕션 대용량 트래픽에는 Upstash Redis 사용 권장

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// 30초마다 만료된 항목 정리
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt < now) store.delete(key);
    }
  }, 30_000);
}

interface RateLimitOptions {
  limit: number;       // 허용 요청 수
  windowMs: number;    // 시간 창 (ms)
}

export function rateLimit(ip: string, options: RateLimitOptions): boolean {
  const now = Date.now();
  const key = ip;
  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return true; // 허용
  }

  if (entry.count >= options.limit) {
    return false; // 차단
  }

  entry.count++;
  return true; // 허용
}

export function getClientIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((s) => s.trim());
    return ips[ips.length - 1];
  }
  return "unknown";
}
