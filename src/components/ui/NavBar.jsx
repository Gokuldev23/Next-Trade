import Image from "next/image";
import React from "react";
import UserProfile from "../ui/UserProfile"
import { AlignRight } from "lucide-react";

export default async function NavBar() {
  return (
    <div className="p-4 bg-neutral-800 rounded-lg flex justify-between pr-8 items-center">
      <div className="flex gap-x-4 items-center">
        <button popoverTarget="side-bar" popoverTargetAction="toggle">
          <AlignRight />
        </button>
        <Image
          className="w-12 rounded-full"
          src={"/NextTradeLogo.png"}
          width={100}
          height={100}
          alt="Next Trade Branding Logo"
        />
      </div>
      <UserProfile/>
    </div>
  );
}
