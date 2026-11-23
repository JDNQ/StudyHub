import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  // Sanitize next to prevent redirect loops back to login or auth routes
  let safeNext = "/";
  if (
    next &&
    next.startsWith("/") &&
    !next.startsWith("/login") &&
    !next.startsWith("/auth")
  ) {
    safeNext = next;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const redirectBase = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;
  const redirectUrl = `${redirectBase}${safeNext}`;

  if (code) {
    const response = NextResponse.redirect(redirectUrl);
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return response;
    }

    console.error("Supabase exchangeCodeForSession error:", error);
  }

  // Something went wrong — redirect to login with error hint
  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
