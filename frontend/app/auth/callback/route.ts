// app/auth/callback/route.ts
// This is a Next.js Route Handler (API route)
import { createServerSupabaseClientForMutations } from "../../../lib/superbase/server"; // This client is allowed to write cookies!
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code"); // The special code from Supabase
  // 'next' is an optional URL parameter you can add to tell it where to go after login
  const next = searchParams.get("next") || "/admin/dashboard";

  if (code) {
    // Create a minimal mock response object with required properties for compatibility
    const mockRes = {
      setHeader: () => {},
      getHeader: () => undefined,
      removeHeader: () => {},
      statusCode: 200,
      end: () => {},
    } as unknown as import("next").NextApiResponse;

    const supabase = await createServerSupabaseClientForMutations(
      request,
      mockRes
    );
    // Exchange the code for a user session (this sets the login cookies!)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // If successful, redirect to the intended page.
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to login with an error.
  return NextResponse.redirect(`${origin}/auth/signin?error=auth_failed`);
}
