import { Suspense } from "react";
import { getSession } from "@/lib/auth/session";
import ProfileCard from "@/lib/components/custom/ProfileCard";
import ProfileCardSkeleton from "@/lib/components/custom/ProfileCardSkeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Button } from "@/lib/components/ui/button";
import Link from "next/link";

export default async function Profile() {
	const userPromise = getSession();
    const user = await userPromise;

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
				<Card className="w-full max-w-md glass-card">
					<CardHeader>
						<CardTitle>Authentication Required</CardTitle>
						<CardDescription>
							Please log in to view your profile.
						</CardDescription>
					</CardHeader>
					<CardContent>
                        <Link href="/auth/login">
						    <Button className="w-full">Sign In</Button>
                        </Link>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                    <p className="text-muted-foreground">Manage your account information</p>
                </div>
            </div>
			
			<Suspense fallback={<ProfileCardSkeleton />}>
				<ProfileCard userPromise={userPromise} />
			</Suspense>
		</div>
	);
}
