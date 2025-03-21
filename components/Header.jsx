import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { PenBox } from 'lucide-react'
import { Button } from './ui/button'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import UserMenu from './user-menu'
import { CheckUser } from '@/lib/checkUser'

const Header = async() => {

  await CheckUser();

  return (
    <nav className="mx-auto py-2 px-4 flex justify-between shadow-md items-center border-b-2">
        <Link href="/" className='flex items-center'>
            <Image src="/logo.png" alt="logo" width={180} height={80} />
        </Link>

        <div className='flex items-center gap-4'>
            <Link href="/events?create=true" className='mx-2'><Button><PenBox/>Create Events</Button></Link>
            <SignedOut>
              <SignInButton forceRedirectUrl='/dashboard'>
                <Button variant="outline">Login</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserMenu/>
            </SignedIn>
        </div>
    </nav>
  )
}

export default Header