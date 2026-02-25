"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/actions/auth.action";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/lib/components/ui/dropdown-menu";
import type { UserType } from "@/lib/types/user.type";
import { getInitials } from "@/lib/utils";

export default function UserProfileMenu({ user }: { user: UserType | null }) {
	const router = useRouter();

	if (!user) return <h1>Something went wrong</h1>;

	const userName = getInitials(user.name);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex items-center gap-4 border rounded-full px-2 py-2 corner-bevel cursor-pointer">
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
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="min-w-48">
				<DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
					Profile
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					variant="destructive"
					onClick={logout}
				>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
