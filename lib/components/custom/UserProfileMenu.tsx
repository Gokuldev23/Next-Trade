import Image from "next/image";
import { use } from "react";
import type { UserType } from "@/lib/types/user.type";
import { getInitials } from "@/lib/utils";

interface UserProfileMenuProps {
	userPromise: Promise<UserType | null>;
}

export default function UserProfileMenu({ userPromise }: UserProfileMenuProps) {
	const user = use(userPromise);
	if (!user) {
		return <h1>Something went wrong</h1>;
	}
	const userName = getInitials(user.name);
	console.log({ userName, name: user.name });
	return (
		<div className="flex items-center gap-4">
			{user?.profile_image_url && (
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
	);
}
