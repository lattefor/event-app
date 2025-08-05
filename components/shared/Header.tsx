import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from "../ui/button"
import { AnimatedGradient } from "../ui/animated-gradient-with-svg"
import NavItems from "./NavItems"
import MobileNav from "./MobileNav"

const Header = () => {
  return (
    <header className="relative w-full border-b">
      <AnimatedGradient
        colors={["#3B82F6", "#93C5FD", "#c12fde" ]}
        speed={0.1}
        blur="light"
      />
      <div className="wrapper flex items-center justify-between relative z-10">
        <Link href="/" className="w-36">
          <Image 
            src="/assets/images/logo.png" width={128} height={38}
            alt="Evently logo" 
          />
        </Link>

        <nav className="md:flex-between hidden w-full max-w-xs">
          <NavItems />
        </nav>

        <div className="flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className="rounded-full" size="lg">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header