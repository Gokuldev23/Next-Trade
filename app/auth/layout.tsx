import React from 'react'

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='place-content-center bg-primary'>{children}</div>
    )
}
