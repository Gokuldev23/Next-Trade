import Image from "next/image";
import type { UserType } from "@/lib/types/user.type";
import UserProfileMenu from "./UserProfileMenu";

export default function Navbar({ user }: { user: UserType | null }) {
	return (
		<div className="flex justify-end items-center gap-4">
			<UserProfileMenu user={user} />
		</div>
	);
}
