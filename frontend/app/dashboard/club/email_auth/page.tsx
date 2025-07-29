// src/app/admin/settings/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner"; // Import toast directly from sonner
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui button component (add if you haven't)

export default function AdminSettingsPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const details = searchParams.get("details");

    if (success === "gmail_connected") {
      toast.success("Gmail Account Connected!", {
        description: "Your system Gmail account has been successfully linked.",
      });
    } else if (error) {
      let errorMessage = "An unknown error occurred.";
      if (error === "gmail_auth_denied") {
        errorMessage = "Gmail access denied by user.";
      } else if (error === "no_auth_code") {
        errorMessage = "Authentication failed: No code received from Google.";
      } else if (error === "no_refresh_token_issued") {
        errorMessage =
          "Authentication failed: No refresh token issued. Check OAuth client settings (access_type=offline, prompt=consent).";
      } else if (error === "vault_store_failed") {
        errorMessage =
          "Failed to store Gmail refresh token securely. Check server logs.";
      } else if (error === "vault_id_missing") {
        errorMessage = "Internal error: Vault secret ID missing.";
      } else if (error === "db_config_failed") {
        errorMessage = "Failed to save Gmail configuration in the database.";
      } else if (error === "gmail_auth_failed") {
        errorMessage = "Gmail authentication process failed.";
      } else if (error === "server_config_error") {
        errorMessage =
          "Server configuration missing for Google Gmail connector.";
      }

      toast.error("Gmail Connection Failed!", {
        description: details
          ? `${errorMessage} Details: ${details}`
          : errorMessage,
      });
    }
  }, [searchParams]); // No 'toast' in dependency array for sonner

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Gmail Account Integration
        </h2>
        <p className="mb-4">
          Connect a dedicated Gmail account for your application to send and
          receive emails. This is separate from user logins.
        </p>
        <Link href="/api/admin/connect-gmail" passHref>
          <Button>Connect Gmail Account</Button>
        </Link>
      </section>
    </div>
  );
}
