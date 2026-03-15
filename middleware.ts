import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const locales = ["ko", "en"] as const;
const defaultLocale = "ko";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
});

const PROTECTED_ROUTES = ["/dashboard", "/sell/new"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_ROUTES = ["/auth/login", "/auth/signup"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip locale prefix for protected/auth route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(en)/, "") || "/";

  // Run intl middleware first (sets NEXT_LOCALE cookie, handles /en/ prefix)
  const intlResponse = intlMiddleware(req);

  // If intl middleware issued a redirect, respect it
  if (
    intlResponse.status === 307 ||
    intlResponse.status === 308 ||
    intlResponse.status === 302
  ) {
    return intlResponse;
  }

  // Use the intl response as base (carries NEXT_LOCALE cookie)
  const res = intlResponse;

  // Refresh Supabase session on the same response object
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: object }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Determine current locale from cookie or URL
  const currentLocale = req.cookies.get("NEXT_LOCALE")?.value ?? defaultLocale;
  const localePath = currentLocale === defaultLocale ? "" : `/${currentLocale}`;

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_ROUTES.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  );
  if (isProtected && !user) {
    const loginUrl = new URL(`${localePath}/auth/login`, req.url);
    loginUrl.searchParams.set("redirectTo", pathnameWithoutLocale);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route: require authentication + admin role
  const isAdminRoute = ADMIN_ROUTES.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  );
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = new URL(`${localePath}/auth/login`, req.url);
      loginUrl.searchParams.set("redirectTo", pathnameWithoutLocale);
      return NextResponse.redirect(loginUrl);
    }
    // Check admin role in profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL(`${localePath}/dashboard`, req.url));
    }
  }

  // Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((r) =>
    pathnameWithoutLocale.startsWith(r)
  );
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`${localePath}/dashboard`, req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api/|auth/callback|.*\\.html).*)",
  ],
};
