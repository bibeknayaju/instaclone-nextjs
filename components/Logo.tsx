// import { calSans } from "@/app/fonts";
import { SwitchCamera } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { calSans } from "@/app/fonts";

function Logo() {
  return (
    <Link
      className={buttonVariants({
        className:
          "hidden md:flex navLink !mb-10 lg:hover:bg-transparent lg:!p-0",
        variant: "ghost",
        size: "lg",
      })}
      href="/dashboard">
      <SwitchCamera className="h-6 w-6 shrink-0 lg:hidden" />

      <p
        className={`font-semibold text-xl hidden lg:block ${calSans.className}`}>
        Pixelgram
      </p>
    </Link>
  );
}

export default Logo;
