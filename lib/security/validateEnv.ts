// 서버 시작 시 필수 환경변수 검증
// 누락 시 명확한 에러 메시지로 조기 실패

interface EnvVar {
  name: string;
  required: boolean;
  phase: 1 | 2;
  description: string;
}

const ENV_VARS: EnvVar[] = [
  { name: "NEXT_PUBLIC_SUPABASE_URL",       required: true,  phase: 1, description: "Supabase 프로젝트 URL" },
  { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",  required: true,  phase: 1, description: "Supabase anon key" },
  { name: "NEXT_PUBLIC_SITE_URL",           required: true,  phase: 1, description: "사이트 URL" },
  { name: "SUPABASE_SERVICE_ROLE_KEY",      required: false, phase: 2, description: "Supabase service role key" },
  { name: "STRIPE_SECRET_KEY",              required: false, phase: 2, description: "Stripe secret key" },
  { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: false, phase: 2, description: "Stripe publishable key" },
  { name: "STRIPE_WEBHOOK_SECRET",          required: false, phase: 2, description: "Stripe webhook secret" },
];

export function validateEnv(): void {
  const missing: string[] = [];

  for (const envVar of ENV_VARS) {
    if (envVar.required && !process.env[envVar.name]) {
      missing.push(`  - ${envVar.name}: ${envVar.description}`);
    }
  }

  if (missing.length > 0) {
    console.error(
      `\n❌ 필수 환경변수가 누락되었습니다:\n${missing.join("\n")}\n` +
      `.env.local 파일을 확인하세요.\n`
    );
    // 빌드는 통과시키되 런타임에 명확한 경고
    if (process.env.NODE_ENV === "production") {
      throw new Error("필수 환경변수가 설정되지 않았습니다.");
    }
  }
}

// Phase 2 환경변수 준비 여부 확인
export function isPhase2Ready(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_WEBHOOK_SECRET &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
