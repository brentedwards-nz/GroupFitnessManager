"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

type MagicSignInResult = {
  loading: boolean;
  success: boolean;
  message: string;
};

export async function signInWithMagicLink(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  const baseRedirectToUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;
  const emailRedirectToUrl = `${baseRedirectToUrl}?next=/dashboard`;

  const otpOptions = {
    emailRedirectTo: emailRedirectToUrl,
  };

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: otpOptions,
  });

  if (error) {
    let userFriendlyMessage = "An unexpected error occurred during sign-in.";

    if (error.message.includes("rate limit")) {
      userFriendlyMessage =
        "Too many sign-in attempts. Please try again in a few minutes.";
    } else if (error.message.includes("Email not confirmed")) {
      userFriendlyMessage =
        "Your email is not confirmed. Please check your inbox for the confirmation link.";
    } else if (error.message.includes("invalid email")) {
      userFriendlyMessage = "The email address is invalid.";
    }

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
