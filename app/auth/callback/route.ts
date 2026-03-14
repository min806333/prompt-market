import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DEFAULT_LOCALE = "ko";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const locale = request.cookies.get("NEXT_LOCALE")?.value ?? DEFAULT_LOCALE;
  const localePrefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${localePrefix}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}${localePrefix}/auth/login?error=invalid_code`
  );
}
