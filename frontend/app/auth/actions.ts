// app/auth/actions.ts (This file needs 'use server' at the top!)
"use server";
// Update the import path if the file is located elsewhere, for example:
import { createServerSupabaseClientForMutations } from "../../lib/superbase/server"; // Adjust the path as necessary
// Or, if the file does not exist, create it at '../../lib/supabase/server.ts' and export the function there.
import { redirect } from "next/navigation";

export async function signInWithEmailAndPassword(
  formData: FormData,
  context: { req: Request; res: NextApiResponse }
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createServerSupabaseClientForMutations(
    context.req,
    context.res
  ); // Use the client that can write cookies
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error("Sign-in error:", error.message);
    return { error: error.message }; // Send error back to client component
  }

  redirect("/admin/dashboard"); // Redirect after successful login
}

import type { NextApiResponse } from "next";

export async function signOutAction(context: {
  req: Request;
  res: NextApiResponse;
}) {
  "use server";
  const supabase = await createServerSupabaseClientForMutations(
    context.req,
    context.res
  );
  await supabase.auth.signOut();
  redirect("/auth/signin");
}
