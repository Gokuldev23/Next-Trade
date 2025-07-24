// src/app/page.tsx
import { getCurrentUser } from "../lib/auth";
import ClientAuthForm from "./ClientAuthForm";
import LogoutButton from "./LogoutButton";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <main className="p-10">
      {user ? (
        <div>
          <h1 className="text-2xl font-bold">👋 Welcome, {user.email}</h1>
          <LogoutButton />
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
          <ClientAuthForm />
        </>
      )}
    </main>
  );
}
