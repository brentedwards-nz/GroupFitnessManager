"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconBrandGoogle, IconBrandFacebook } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { magicSignIn } from "@/app/auth/signin/actions";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface MagicSignInState {
  success: boolean;
  message: string;
}

export function LoginCard() {
  const router = useRouter();

  const initialState: MagicSignInState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useFormState(magicSignIn, initialState);

  const { pending } = useFormStatus();

  const isDisabled = pending;

  type OAuthProvider = "google" | "facebook";

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      console.error(`Error with ${provider} sign-in:`, error.message);
      alert(`${provider} sign-in error: ${error.message}`);
    }
  };

  useEffect(() => {
    if (state.message) {
      console.log("Magic Link Status:", state.message);
    }
  }, [state.message, state.success, router]);

  return (
    <Card className="w-full max-w-sm shadow-lg gap-1">
      <CardHeader className="">
        <CardTitle className="text-xl">Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction hidden={true}>
          <Button variant="link">Sign Up</Button>
        </CardAction>
      </CardHeader>

      <CardContent className="p-6 pb-0 pt-2">
        <form action={formAction}>
          <div className="flex flex-col">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <Button type="submit" className="w-full" disabled={isDisabled}>
                {pending ? "Sending Magic Link..." : "Login with Magic Link"}
              </Button>
            </div>
          </div>
          <div>
            {state.message && (
              <p
                className={`text-sm mt-2 ${
                  state.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {state.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-0">
        <div className="flex items-center my-4 w-full">
          <div className="flex-grow h-px bg-gray-300"></div>{" "}
          <span className="flex-shrink-0 mx-4 text-gray-500 text-sm uppercase">
            Or continue with
          </span>
          <div className="flex-grow h-px bg-gray-300"></div>{" "}
        </div>
        <div className="space-x-2 flex justify-center w-full">
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleOAuthSignIn.bind(null, "google")}
            disabled={isDisabled}
          >
            <IconBrandGoogle />
            Google
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleOAuthSignIn.bind(null, "facebook")}
            disabled={isDisabled}
          >
            <IconBrandFacebook />
            Facebook
          </Button>
        </div>
        <div className="space-x-2 flex justify-center mt-4">
          <Link href={"/"}>Home</Link>
        </div>
      </CardFooter>
    </Card>
  );
}
