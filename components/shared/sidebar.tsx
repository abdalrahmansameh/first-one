"use client";

import { navLinks } from '@/constans'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button';

const Sidebar = () => {
  const pathname = usePathname()
  return (
    <aside className='sidebar'>
      <div className='flex size-full flex-col gap-4'>
        <Link href={"/"}  className='sidebar-logo'>
        <Image src="/assets/images/logo-text.svg" width={"230"} height={"50"} alt='Logo' className='h-auto w-auto'></Image>
        </Link>

        <nav className='sidebar-nav'>
          <SignedIn>
            <ul className='sidebar-nav_elements'>
              {navLinks.slice(0 ,6 ).map((link) => {
                const isActive = link.route === pathname

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${
                  isActive ? 'bg-gradient-to-l to-[#4318FF] rounded-full w-full from-[#7857FF] text-white' : "text-gray-700"
                  }`}>
                    <Link className='sidebar-link' href={link.route}>
                      <Image 
                        src={link.icon}
                        alt='Logo'
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                        />
                        {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <ul className='sidebar-nav_elements'>
            {navLinks.slice(6 ).map((link) => {
                const isActive = link.route === pathname

                return (
                  <li key={link.route} className={`sidebar-nav_element group ${
                  isActive ? 'bg-gradient-to-l to-[#4318FF] rounded-full w-full from-[#7857FF] text-white' : "text-gray-700"
                  }`}>
                    <Link className='sidebar-link' href={link.route}>
                      <Image 
                        src={link.icon}
                        alt='Logo'
                        width={24}
                        height={24}
                        className={`${isActive && 'brightness-200'}`}
                        />
                        {link.label}
                    </Link>
                  </li>
                )
              })}
              <li className='sidebar-nav_element flex justify-center items-center cursor-pointer gap-2 p-4 '>
              <UserButton afterSwitchSessionUrl='/' showName/>
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover text-gray-700 !shadow-3xl">
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
