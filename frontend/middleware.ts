// middleware.ts - CORRECTED to properly handle 'response' object
import {
  createServerClient,
  type CookieOptions,
  CookieMethodsServer,
} from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Create a response object that can be modified.
  // This is the single response object we will return at the end.
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const cookieMethodsServer: CookieMethodsServer = {
    getAll(...names: string[]) {
      const result: { name: string; value: string }[] = [];
      for (const name of names) {
        const cookie = request.cookies.get(name);
        if (cookie) {
          result.push({ name: cookie.name, value: cookie.value });
        }
      }
      return result;
    },
    setAll(
      cookiesToSet: {
        name: string;
        value: string;
        options: CookieOptions;
      }[]
    ) {
      // Crucially, modify the `response` object created at the start of the middleware.
      // DO NOT create new NextResponse instances here unless you intend to return them immediately.
      for (const { name, value, options } of cookiesToSet) {
        response.cookies.set({ name, value, ...options });
      }
    },
  };

  // Create a Supabase client configured for middleware.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethodsServer,
    }
  );

  // This will attempt to refresh the session and use the `setAll` (or `set`/`remove`)
  // methods provided above to modify the `response` object's cookies.
  await supabase.auth.getSession();

  // Return the single, modified response object.
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
