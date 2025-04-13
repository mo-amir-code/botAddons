import { cn } from "@/lib/utils";
import logo from "@/assests/logo.png";
import Image from "next/image";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <>
      <Image alt="logo" className={cn("size-7 w-7 rounded-full", className)} src={logo} />
    </>
  );
};
