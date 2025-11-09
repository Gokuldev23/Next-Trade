// app/profile/page.tsx
import { getSession } from "@/lib/auth/session";
import ProfileCard from "@/lib/components/custom/ProfileCard";
import ProfileCardSkeleton from "@/lib/components/custom/ProfileCardSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { UserType } from "@/lib/types/user.type";
import { Suspense } from "react";

export default async function Profile() {
	const user = getSession();

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<Card className="w-full max-w-md mx-4">
					<CardHeader>
						<CardTitle>Authentication Required</CardTitle>
						<CardDescription>Please log in to view your profile.</CardDescription>
					</CardHeader>
					<CardContent>
						<button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700">
							Sign In
						</button>
					</CardContent>
				</Card>
			</div>
		);
	}


	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-slate-800 mb-2">Profile</h1>
					<p className="text-lg text-slate-600">Manage your account information</p>
				</div>
				<Suspense fallback={ProfileCardSkeleton()}>
					<ProfileCard userPromise={user} />
				</Suspense>
			</div>
		</div>
	);
}