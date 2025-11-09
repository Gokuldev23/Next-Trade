import { getSession } from '@/lib/auth/session';
import Navbar from '@/lib/components/custom/Navbar';
import { redirect, RedirectType } from 'next/navigation';
import React from 'react'

export default async function layout({ children }: {
    children: React.ReactNode;
}) {

    const user = await getSession();
    console.log({user})
    if(!user) {
        redirect('/',RedirectType.replace)
    }
    return (

        <div>
            <Navbar />
            {children}
        </div>
    )
}
