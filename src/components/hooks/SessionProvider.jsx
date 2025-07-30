// components/SessionProvider.tsx
"use client";

import { createContext, useContext } from "react";

const SessionContext = createContext(null);

export function SessionProvider({ value, children }) {
  return (
    <SessionContext value={value}>{children}</SessionContext>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
