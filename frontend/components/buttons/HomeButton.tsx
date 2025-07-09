// components/HomeButton.jsx
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

const HomeButton = () => {
  return (
    <Button variant="ghost" size="icon" asChild>
      {/* This is the *only* direct child of Button when asChild is true */}
      <Link href="/">
        <HomeIcon />
      </Link>
    </Button>
  );
};
export default HomeButton;
