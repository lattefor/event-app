import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AnimatedGradient } from '../ui/animated-gradient-with-svg'

const Footer = () => {
  return (
    <footer className="relative border-t">
      <AnimatedGradient
        colors={["#EC4899", "#F472B6", "#3B82F6"]}
        speed={0.08}
        blur="light"
      />
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row relative z-10 backdrop-blur-sm">
        <Link href='/'>
          <Image 
            src="/assets/images/logo.png"
            alt="logo"
            width={128}
            height={38}
          />
        </Link>

        <p>{new Date().getFullYear()} Events. All Rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer