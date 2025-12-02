"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { use } from "react";
import { logout } from "@/lib/actions/auth.action";
import { getInitials } from "@/lib/utils";
import { Menu, MenuItem, MenuItems, Trigger } from "./ProfileMenu";

export default function UserProfileMenu({
	userPromise,
}: {
	userPromise: Promise<Record<string, any> | null>;
}) {
	const router = useRouter();
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
				<MenuItem onClick={() => router.push("/profile")}>Profile</MenuItem>
				<MenuItem onClick={logout}>Logout</MenuItem>
			</MenuItems>
		</Menu>
	);
}
