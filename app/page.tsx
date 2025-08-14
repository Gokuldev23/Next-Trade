import { redirect, RedirectType } from 'next/navigation'

export default async function AuthCheck() {

  const user = await fetch("http://localhost:3000/api/auth",{cache:"no-cache"})
  if(user.status === 401) {
      redirect('/auth/login',RedirectType.replace)
  }
}
