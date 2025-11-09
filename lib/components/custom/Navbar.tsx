import Image from 'next/image'
import React from 'react'
import UserProfileMenu from './UserProfileMenu'
import { getSession } from '@/lib/auth/session'

export default async function Navbar() {

    const userPromise = getSession()
    return (
        <div className='px-4 py-2 border flex justify-between items-center'>
            <div className='flex items-center'>
                <Image className='w-20' width={80} height={80} src={'/NT-Brand-logo.png'} alt='Brand Logo' />
                <p className="font-rock text-primary">Next Trade</p>
            </div>
            <div className=''>
                <UserProfileMenu userPromise={userPromise}/>
            </div>
        </div>
    )
}
