"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { DialogTitle } from "@radix-ui/react-dialog"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "../ui/button"

const MobileNav = () => {
    const pathname = usePathname();

  return (
    <header className="header">
        <Link href={"/"} className="flex items-center gap-2 md:py-2">
        <Image
            src="/assets/images/logo-text.svg"
            alt="logo"
            width={"180"}
            height={"28"}
        />
        </Link>

        <nav className="flex gap-2">
            <SignedIn>
                <UserButton afterSignOutUrl="/"/>

                <Sheet>
                    <SheetTrigger>
                        <Image 
                        src="/assets/icons/menu.svg"
                        alt="Menu"
                        width="30"
                        height="30"
                        className="cursor-pointer"
                        />
                    </SheetTrigger>
                    <SheetContent className="sheet-content sm:w-64">
                        <DialogTitle>
                            <Image 
                            src="/assets/images/logo-text.svg"
                            alt="logo"
                            width="152"
                            height="23"
                            />
                        </DialogTitle>
                        <ul className='header-nav_elements'>
                            {navLinks.map((link) => {
                                const isActive = link.route === pathname

                                return (
                                <li key={link.route} 
                                className={`${isActive && 'gradient-text'}`}
                                >
                                    <Link className='sidebar-link' href={link.route}>
                                    <Image 
                                        src={link.icon}
                                        alt='Logo'
                                        width={24}
                                        height={24}
                                        />
                                        {link.label}
                                    </Link>
                                </li>
                                )
                            })}
                        </ul>
                    </SheetContent>
                </Sheet>
            </SignedIn>
            <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </nav>
    </header>
  )
}

export default MobileNav
