"use client";

import Form from "next/form";
import { redirect } from "next/navigation";
import { use, useActionState, useState } from "react";
import { editProfileAction } from "@/lib/actions/profile.action";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/lib/components/ui/avatar";
import { Badge } from "@/lib/components/ui/badge";
import { Button } from "@/lib/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/lib/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/lib/components/ui/dialog";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import type { UserType } from "@/lib/types/user.type";
import { getInitials } from "@/lib/utils";

interface ProfileCardProps {
	userPromise: Promise<Record<string, any> | null>;
}

export default function ProfileCard({ userPromise }: ProfileCardProps) {
	const user = use(userPromise);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [_state, action, isSaving] = useActionState(editProfileAction, null);

	if (!user) {
		redirect("/");
	}
	const [formData, setFormData] = useState({
		name: user.name,
		email: user.email,
	});

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<>
			<Card className="w-full max-w-2xl mx-auto shadow-lg">
				<CardHeader className="text-center pb-6">
					<div className="flex justify-center mb-4">
						<Avatar className="h-24 w-24 border-4 border-white shadow-md">
							<AvatarImage
								width={100}
								height={100}
								className=" object-cover"
								src={user.profile_image_url || ""}
								alt={user.name}
							/>
							<AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
								{getInitials(user.name)}
							</AvatarFallback>
						</Avatar>
					</div>
					<CardTitle className="text-2xl">{user.name}</CardTitle>
					<CardDescription className="text-md">{user.email}</CardDescription>
					<div className="mt-2">
						<Badge
							variant={user.is_active ? "default" : "secondary"}
							className="text-sm"
						>
							{user.is_active ? "Active" : "Inactive"} Account
						</Badge>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<h3 className="font-semibold text-slate-700">User ID</h3>
							<p className="text-sm text-slate-600 p-2 bg-slate-50 rounded-md">
								{user.id}
							</p>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-slate-700">Member Since</h3>
							<p className="text-sm text-slate-600 p-2 bg-slate-50 rounded-md">
								{new Date(user.created_at).toLocaleDateString("en-US", {
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
					</div>

					<div className="space-y-2">
						<h3 className="font-semibold text-slate-700">Last Updated</h3>
						<p className="text-sm text-slate-600 p-2 bg-slate-50 rounded-md">
							{new Date(user.updated_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</p>
					</div>

					<div className="pt-4 border-t border-slate-200">
						<h3 className="font-semibold text-slate-700 mb-3">
							Account Actions
						</h3>
						<div className="flex flex-wrap gap-3">
							<Button
								onClick={() => setIsEditModalOpen(true)}
								className="bg-blue-600 hover:bg-blue-700"
							>
								Edit Profile
							</Button>
							<Button variant="outline" className="text-slate-800">
								Change Password
							</Button>
							<Button
								variant="outline"
								className="text-rose-700 border-rose-200 hover:bg-rose-50"
							>
								Deactivate Account
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>Edit Profile</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>
					<Form action={action} className="grid gap-4 pt-4">
						<div>
							<input
								type="text"
								name="userId"
								readOnly
								value={user.id}
								hidden
							/>
						</div>
						<div className="">
							<Label htmlFor="profile_image_file" className="relative w-full">
								<Avatar className="h-24 w-24 border-4 mx-auto border-white shadow-md">
									<AvatarImage
										width={100}
										height={100}
										className="object-cover"
										src={user.profile_image_url || ""}
										alt={user.name}
									/>
									<AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
										{getInitials(user.name)}
									</AvatarFallback>
								</Avatar>
							</Label>
							<Input
								name="profile_image_file"
								id="profile_image_file"
								type="file"
								hidden
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Name
							</Label>
							<Input
								id="name"
								name="name"
								value={formData.name}
								onChange={handleInputChange}
								className="col-span-3"
							/>
						</div>

						<DialogFooter className="mt-2">
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditModalOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSaving}>
								{isSaving ? "Saving..." : "Save changes"}
							</Button>
						</DialogFooter>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
}
