// src/app/page.tsx (or any layout)

import { auth } from "../lib/auth"; // we added this earlier
import { SignInButton, SignOutButton } from "./auth-buttons";

export default async function HomePage() {
  const session = await auth();

  console.log({session})

  return (
    <main className="p-4">
      {session?.user ? (
        <>
          <h1>Welcome, {session.user.name}</h1>
          <p>Your email: {session.user.email}</p>
          <img className="w-10 h-10" src={session.user.image} alt="users-profile"/>
          <SignOutButton />
        </>
      ) : (
        <>
          <h1>You are not logged in</h1>
          <SignInButton />
        </>
      )}
    </main>
  );
}
