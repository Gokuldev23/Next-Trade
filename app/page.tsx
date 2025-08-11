import { redirect, RedirectType } from 'next/navigation'
import React from 'react'

export default async function AuthCheck() {

  const user = await fetch("http://localhost:3000/api/auth")
  if(user.status === 401) {
      redirect('/auth/login',RedirectType.replace)
  }
}
