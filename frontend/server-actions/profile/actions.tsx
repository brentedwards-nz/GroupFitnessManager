// frontend/server-actions/profile/actions.ts
"use server";

import { ActionResult } from "@/types/server-action-results";
import prisma from "@/utils/prisma/client";

console.log(
  "⚡ Server Action (actions.tsx): 'prisma' variable state after import:",
  prisma ? "DEFINED" : "UNDEFINED"
);

import { Profile, ContactInfoItem } from "./types";

export async function getProfile(
  user_id: string
): Promise<ActionResult<Profile>> {
  console.log("Fetching profile for auth_id:", user_id);

  if (typeof user_id !== "string" || user_id.trim() === "") {
    console.error("Invalid auth_id provided to getProfile Server Action.");
    return {
      success: false,
      message: `Invalid authentication ID provided`,
    };
  }

  try {
    const profile = await prisma.profiles.findUnique({
      where: {
        auth_id: user_id,
      },
      select: {
        auth_id: true,
        first_name: true,
        last_name: true,
        birth_date: true,
        current: true,
        disabled: true,
        avatar_url: true,
        contact_info: true,
        created_at: true,
      },
    });

    if (!profile) {
      return {
        success: false,
        message: `Profile not found.`,
        code: "USER_NOT_FOUND",
      };
    }

    const profileResult: Profile = {
      auth_id: profile.auth_id,
      first_name: profile?.first_name ?? "** First name required **",
      last_name: profile?.last_name ?? "** Last name required **",
      full_name:
        `${profile.first_name || ""} ${profile.last_name || ""}`.trim() ||
        "Name required",
      birth_date: profile.birth_date,
      current: profile.current,
      disabled: profile.disabled,
      avatar_url: profile.avatar_url,
      contact_info: Array.isArray(profile.contact_info)
        ? (profile.contact_info as ContactInfoItem[])
        : typeof profile.contact_info === "string"
        ? (JSON.parse(profile.contact_info) as ContactInfoItem[])
        : profile.contact_info === null
        ? null
        : [],
      DateTime: profile.created_at,
    };

    return {
      success: true,
      data: profileResult,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `An unexpected server error occurred: ${
        err.message || "Unknown error"
      }`,
      code: "UNEXPECTED_SERVER_ERROR",
      details:
        process.env.NODE_ENV === "development"
          ? { stack: err.stack }
          : undefined,
    };
  }
}
