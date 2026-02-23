"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/actions/auth.action";
import type { UserType } from "@/lib/types/user.type";
import { getInitials } from "@/lib/utils";
import { Menu, MenuItem, MenuItems, Trigger } from "./Menu";

export default function UserProfileMenu({ user }: { user: UserType | null }) {
	const router = useRouter();

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
				<MenuItem onClick={() => router.push("/dashboard/profile")}>Profile</MenuItem>
				<MenuItem onClick={logout}>Logout</MenuItem>
			</MenuItems>
		</Menu>
	);
}
