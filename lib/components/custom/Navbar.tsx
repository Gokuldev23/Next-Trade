import Image from "next/image";
import UserProfileMenu from "./UserProfileMenu";
import type { UserType } from "@/lib/types/user.type";

export default function Navbar({ user }: { user: UserType | null }) {
	return (
		<div className="px-4 py-2  flex justify-between items-center">
			<div className="flex items-center">
				<Image
					className="w-20"
					width={80}
					height={80}
					src={"/NT-Brand-logo.png"}
					alt="Brand Logo"
				/>
				<p className="font-rock text-primary">Next Trade</p>
			</div>
			<div className="">
				<UserProfileMenu user={user} />
			</div>
		</div>
	);
}
