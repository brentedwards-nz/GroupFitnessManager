// frontend/server-actions/profile/actions.ts
"use server";

import { createClient } from "@/utils/supabase/server";
import { ActionResult } from "@/types/server-action-results";
import prisma from "@/utils/prisma/client";
import { revalidatePath } from "next/cache";

import { Club, ClubSchema } from "./types";

export async function readClubs(): Promise<ActionResult<Club[]>> {
  console.log("Fetching clubs...");
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const clubs = await prisma.club.findMany({
      select: {
        club_id: true,
        club_name: true,
        club_address: true,
        club_phone: true,
        current: true,
        disabled: true,
        created_at: true,
      },
    });

    if (!clubs) {
      console.warn(`ReadClubs: Could not find clubs`);
      throw new Error(`ReadClubs: Could not find clubs`);
    }

    const clubsResult: Club[] = clubs.map((club) => ({
      club_id: club.club_id,
      club_name: club.club_name,
      club_address: club.club_address,
      club_phone: club.club_phone,
      current: club.current,
      disabled: club.disabled,
      created_at: club.created_at,
    }));

    return {
      success: true,
      data: clubsResult,
    };
  } catch (err: any) {
    console.error("Error:");
    console.error(` - Function: readClubs`);
    console.error(err);

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

export async function readClub(club_id: string): Promise<ActionResult<Club>> {
  console.log("Fetching club club_id:", club_id);
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const club = await prisma.club.findUnique({
      where: {
        club_id: club_id,
      },
      select: {
        club_id: true,
        club_name: true,
        club_address: true,
        club_phone: true,
        current: true,
        disabled: true,
        created_at: true,
      },
    });

    if (!club) {
      console.warn(`Club not found for club_id: ${club_id}.`);
      return {
        success: false,
        message: `Club not found.`,
        code: "CLUB_NOT_FOUND",
      };
    }

    const clubResult: Club = {
      club_id: club.club_id,
      club_name: club.club_name,
      club_address: club.club_address,
      club_phone: club.club_phone,
      current: club.current,
      disabled: club.disabled,
      created_at: club.created_at,
    };

    return {
      success: true,
      data: clubResult,
    };
  } catch (err: any) {
    console.error("Error:");
    console.error(` - Function: readClub`);
    console.error(` - Club Id : ${club_id}`);
    console.error(err);

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

export async function updateClub(clubData: Club): Promise<ActionResult<Club>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized: You must be logged in.");
    }

    const validationResult = ClubSchema.safeParse({
      clubData,
    });
    if (!validationResult.success) {
      throw new Error("Invalid club data.");
    }

    const validatedData = validationResult.data;

    const updatedOrCreatedRecord = await prisma.club.upsert({
      where: {
        club_id: validatedData.club_id,
      },
      update: {
        club_name: validatedData.club_name,
        club_address: clubData.club_address,
        club_phone: clubData.club_phone,
        current: validatedData.current,
        disabled: validatedData.disabled,
      },
      create: {
        club_name: validatedData.club_name,
        club_address: clubData.club_address,
        club_phone: clubData.club_phone,
        current: validatedData.current,
        disabled: validatedData.disabled,
      },
      select: {
        club_id: true,
        club_name: true,
        club_address: true,
        club_phone: true,
        current: true,
        disabled: true,
        created_at: true,
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    const clubResult: Club = {
      club_id: updatedOrCreatedRecord.club_id,
      club_name: updatedOrCreatedRecord.club_name,
      club_address: updatedOrCreatedRecord.club_address,
      club_phone: updatedOrCreatedRecord.club_phone,
      current: updatedOrCreatedRecord.current,
      disabled: updatedOrCreatedRecord.disabled,
      created_at: updatedOrCreatedRecord.created_at,
    };

    return {
      success: true,
      data: clubResult,
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
          ? { stack: err.stack, prismaError: err.code || "N/A" }
          : undefined,
    };
  }
}
