// lib/supabase/server.ts
// This file runs only on the server, so no "use client" directive is needed.

import {
  createServerClient,
  type CookieOptions,
  CookieMethodsServer,
} from "@supabase/ssr";
import { cookies } from "next/headers"; // This is a server-only API
import type { NextApiResponse } from "next";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // Access server-side cookies

  const cookieMethodsServer: CookieMethodsServer = {
    getAll: () => {
      return cookieStore.getAll();
    },
    setAll(
      cookiesToSet: { name: string; value: string; options: CookieOptions }[]
    ) {
      try {
        // Iterate and set each cookie. This will throw in a Server Component.
        for (const { name, value, options } of cookiesToSet) {
          console.log("name:", name);
          console.log("value:", value);
          console.log("options:", options);
          cookieStore.set({ name, value, ...options });
        }
      } catch (error) {
        // This warning is expected if this client is used in a Server Component
        // and Supabase attempts to refresh/update the session cookie.
        console.warn(
          "Warning: Attempted to set cookies from a Server Component outside of a Server Action or Route Handler. This is disallowed by Next.js:",
          error
        );
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethodsServer,
    }
  );
}

// Optional: For Route Handlers where you specifically need to interact with `NextResponse`
export async function createServerSupabaseClientForMutations(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  res: NextApiResponse
) {
  const cookieStore = await cookies();
  const cookieMethodsServer: CookieMethodsServer = {
    getAll: () => {
      return cookieStore.getAll();
    },
    setAll(
      cookiesToSet: { name: string; value: string; options: CookieOptions }[]
    ) {
      try {
        // Iterate and set each cookie. This will throw in a Server Component.
        for (const { name, value, options } of cookiesToSet) {
          console.log("name:", name);
          console.log("value:", value);
          console.log("options:", options);
          cookieStore.set({ name, value, ...options });
        }
      } catch (error) {
        // This warning is expected if this client is used in a Server Component
        // and Supabase attempts to refresh/update the session cookie.
        console.warn(
          "Warning: Attempted to set cookies from a Server Component outside of a Server Action or Route Handler. This is disallowed by Next.js:",
          error
        );
      }
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: cookieMethodsServer,
    }
  );
}
