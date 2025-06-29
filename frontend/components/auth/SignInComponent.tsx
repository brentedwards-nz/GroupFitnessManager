"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/superbase/client";

import { Loader2 } from "lucide-react";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconBrandGoogle,
  IconBrandFacebook,
  IconMail,
} from "@tabler/icons-react";

export default function SignInComponent() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setSuccess(true);

    const redirectToUrl = `${window.location.origin}/auth/callback?next=/admin/dashboard`;

    const supabase = await createSupabaseBrowserClient();

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectToUrl },
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
        setSuccess(false);
      } else {
        setMessage("Check your email for the sign-in link.");
        setSuccess(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An unexpected error occurred. Please try again.");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setMessage("");
    setSuccess(true); // Assuming success until an error occurs

    const redirectToUrl = `${window.location.origin}/auth/callback?next=/admin/dashboard`;
    const supabase = await createSupabaseBrowserClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectToUrl,
        },
      });

      if (error) {
        setMessage(`Error signing in with Google: ${error.message}`);
        setSuccess(false);
      } else {
        // No direct message here, as the user will be redirected to Google for authentication
        // and then back to your redirect URL.
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setMessage(
        "An unexpected error occurred during Google Sign-In. Please try again."
      );
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setMessage("");
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br to-primary-100 flex items-center justify-center p-4 ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8  space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter">Welcome</h1>
            <p className="text-muted-foreground">
              Enter your email to access your profile
            </p>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.net"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Button type="submit" className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <IconMail />
                  )}
                  Login With Email
                </Button>
                {message && success && (
                  <p className="mt-2 text-green-500">{message}</p>
                )}
                {message && !success && (
                  <p className="mt-2 text-red-500">{message}</p>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <hr className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center uppercase">
                  <span className="bg-white px-2 text-sm text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>
            </form>
            <div className="space-x-2 flex justify-center">
              <Button
                className="w-1/2"
                variant="outline"
                onClick={handleGoogleSignIn}
              >
                <IconBrandGoogle />
                Google
              </Button>
              <Button
                className="w-1/2"
                variant="outline"
                onClick={handleFacebookSignIn}
              >
                <IconBrandFacebook />
                Facebook
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
