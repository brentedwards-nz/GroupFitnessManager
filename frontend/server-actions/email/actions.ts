import { ActionResult } from "@/types/server-action-results";
import { Email } from "./types";

export async function readEmail(
  user_id: string
): Promise<ActionResult<Email[]>> {
  console.log("Fetching email");

  if (typeof user_id !== "string" || user_id.trim() === "") {
    console.error("Invalid auth_id provided to getProfile Server Action.");
    return {
      success: false,
      message: `Invalid authentication ID provided`,
    };
  }

  try {
    const emailResult: Email = {
      from: "Dummy From",
      subject: "Dummy Subject",
      body: "Dummy Body",
    };

    console.log("Fetching email:");
    console.log(JSON.stringify(emailResult, null, 2));

    return {
      success: true,
      data: [emailResult, emailResult, emailResult],
    };
  } catch (err: any) {
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
