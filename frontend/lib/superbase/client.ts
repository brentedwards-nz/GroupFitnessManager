// lib/supabase/client.ts
"use client"; // This directive is essential for client-side code

import { createBrowserClient } from "@supabase/ssr"; // Use createBrowserClient

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
