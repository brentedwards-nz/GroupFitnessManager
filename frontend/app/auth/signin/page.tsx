"use client";

import { LoginCard } from "@/components/cards/login-card";
import { magicSignIn } from "./actions"; // Your modified server action
import { useFormState } from "react-dom"; // Import the useFormState hook

const SignIn = () => {
  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useFormState(magicSignIn, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginCard />
    </div>
  );
};

export default SignIn;
