"use client";
import React from "react";
import { useSession } from "../hooks/SessionProvider";
import Image from "next/image";

export default function UserProfile() {
  let session = useSession();
  let image = session?.user?.image
  return (
    <div>
      <button className="cursor-pointer">
        <Image
          className="w-12 rounded-full"
          src={image || '/defaultProfile.png'}
          width={100}
          height={100}
          alt="Your Profile Image"
        />
      </button>
    </div>
  );
}
