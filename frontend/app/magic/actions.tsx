// File: src/app/actions.ts (or wherever your magicSignIn is located)
"use server";

import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation"; // <-- REMOVE or comment out redirect here
import { createClient } from "@/utils/supabase/server";

// Define a type for the return value for better type safety
type MagicSignInResult = {
  loading: boolean;
  success: boolean;
  message: string;
};

export async function magicSignIn(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  console.log("magicSignIn called");
  const supabase = await createClient();
  console.log("Supabase client created");

  const email = formData.get("email") as string;

  // --- IMPORTANT: Add input validation here ---
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }
  // You might want more robust validation using libraries like Zod

  console.log("Data prepared for sign-in:", { email });

  // Define the base redirect URL for the callback
  const baseRedirectToUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;

  // --- IMPORTANT CHANGE HERE ---
  // Append the 'next' query parameter to redirect to /dashboard
  const emailRedirectToUrl = `${baseRedirectToUrl}?next=/dashboard`;
  // --- END IMPORTANT CHANGE ---

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: emailRedirectToUrl,
    },
  });

  if (error) {
    console.error("Supabase sign-in error:", error.message);
    let userFriendlyMessage = "An unexpected error occurred during sign-in.";

    // Provide more specific messages for common errors
    if (error.message.includes("rate limit")) {
      userFriendlyMessage =
        "Too many sign-in attempts. Please try again in a few minutes.";
    } else if (error.message.includes("Email not confirmed")) {
      userFriendlyMessage =
        "Your email is not confirmed. Please check your inbox for the confirmation link.";
    } else if (error.message.includes("invalid email")) {
      userFriendlyMessage = "The email address is invalid.";
    }
    // You can add more specific error mappings as needed

    return {
      success: false,
      message: userFriendlyMessage,
    };
  }

  return {
    success: true,
    message: "Success! Please check your email for the magic link to sign in.",
  };
}
