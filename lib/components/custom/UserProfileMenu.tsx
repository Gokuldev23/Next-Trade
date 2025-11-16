"use client"
import {Menu,MenuItem,MenuItems,Trigger} from "./ProfileMenu";
import Image from "next/image";
import { use } from "react";
import { useRouter } from 'next/navigation'
import type { UserType } from "@/lib/types/user.type";
import { getInitials } from "@/lib/utils";

export default function UserProfileMenu({ userPromise }: { userPromise: Promise<UserType | null> }) {

	const router = useRouter()
	const user = use(userPromise);
	if (!user) return <h1>Something went wrong</h1>;

	const userName = getInitials(user.name);

	return (
		<Menu>
			<Trigger>
				<div className="flex items-center gap-4 border rounded-full px-2 py-2 corner-bevel">
					{user.profile_image_url && (
						<Image
							className="size-10 object-cover rounded-full"
							src={user.profile_image_url}
							width={80}
							height={80}
							alt="Profile"
						/>
					)}
					<p>{userName}</p>
				</div>
			</Trigger>

			<MenuItems className="mt-2">
				<MenuItem onClick={()=>router.push('/profile')}>Profile</MenuItem>
				<MenuItem onClick={() => console.log("Logout clicked")}>Logout</MenuItem>
			</MenuItems>
		</Menu>
	);
}
