// src/app/ClientAuthForm.tsx
'use client'

import { useState } from 'react'

export default function ClientAuthForm() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState('')

    const signIn = async () => {
        const res = await fetch('/api/signin', {
            method: 'POST',
            body: JSON.stringify({ email }),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        const data = await res.json()
        setStatus(data.message || data.error)

        if (res.ok) {
            location.reload() // refresh to trigger session check
        }
    }

    return (
        <div>
            <input
                className="border p-2 mr-2"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <button
                className="bg-blue-500 text-white px-4 py-2"
                onClick={signIn}
            >
                Sign In
            </button>
            {status && <p className="mt-4">{status}</p>}
        </div>
    )
}
