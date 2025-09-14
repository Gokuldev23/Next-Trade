"use client"
import React, { useContext, useState } from 'react'
import { UserType } from '@/lib/types/user.type'
import { createContext } from 'react'


type AuthContextType = {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
    children: React.ReactNode;
    initialUser: UserType | null;
}

export default function AuthProvider({ children, initialUser }: AuthProviderProps) {

    const [user, setUser] = useState<UserType | null>(initialUser);

    return (
        <AuthContext value={{ user, setUser }}>
            {children}
        </AuthContext>
    )
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
    return context;
}