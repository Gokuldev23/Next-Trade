// src/app/auth-buttons.tsx (client component)


import { signIn, signOut } from "../lib/auth";


export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        const user = await signIn("github");
        console.log({user})
      }}
    >
      <button type="submit" className="text-white font-medium px-4 py-1 rounded-2xl bg-green-400">SignIn</button>
    </form>
  );
} 

export function SignOutButton() {
    return (
      <form
        action={async () => {
          "use server";
          await signOut("github");
        }}
      >
        <button
          type="submit"
          className="border p-4 text-white px-4 py-1 rounded-2xl bg-red-400"
        >
          SignOut
        </button>
      </form>
    );
}
