// src/app/LogoutButton.tsx
"use client";

export default function LogoutButton() {
  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    location.reload();
  };

  return (
    <button className="mt-4 bg-red-500 text-white px-4 py-2" onClick={logout}>
      Logout
    </button>
  );
}
