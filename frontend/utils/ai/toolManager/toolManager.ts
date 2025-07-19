import { calculatorAdd, calculatorSubtract } from "./tools/utility/calculator";
import { sendEmail } from "./tools/utility/email";
import {
  createUser,
  readUser,
  updateUser,
  deleteUser,
} from "./tools/supabase/user";

export type ToolType =
  | "utility.calculator.add"
  | "utility.calculator.subtract"
  | "supabase.user.create"
  | "supabase.user.read"
  | "supabase.user.update"
  | "supabase.user.delete"
  | "utility.email.send";

// Define a recursive type for the nested tool map
type NestedToolMap = {
  [key: string]: unknown;
};

// The toolFunctionMap needs to be a nested object
const toolFunctionMap: NestedToolMap = {
  utility: {
    calculator: {
      add: calculatorAdd,
      subtract: calculatorSubtract,
    },
    emails: {
      send: sendEmail,
    },
  },
  supabase: {
    user: {
      create: createUser,
      read: readUser,
      update: updateUser,
      delete: deleteUser,
    },
  },
};

export const getTool = (type: ToolType): Function => {
  const parts = type.split(".");
  let currentLevel: Function | NestedToolMap = toolFunctionMap;

  for (const part of parts) {
    if (
      typeof currentLevel === "object" &&
      currentLevel !== null &&
      part in currentLevel
    ) {
      currentLevel = (currentLevel as NestedToolMap)[part] as
        | Function
        | NestedToolMap;
    } else {
      throw new Error(
        `Tool of type "${type}" not found. Path segment "${part}" is missing.`
      );
    }
  }

  if (typeof currentLevel === "function") {
    return currentLevel;
  } else {
    throw new Error(
      `Tool of type "${type}" is not a direct function. It's an intermediate object.`
    );
  }
};
