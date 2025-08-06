import React from "react"
import { Button } from "@/components/ui/button"
import GamificationDisplay from "@/components/GamificationDisplay"
import NavbarDropdownLinks from "@/components/NavbarDropdownLinks"
import { NavbarProps } from "@/interfaces/components"

const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const Navbar: React.FC<NavbarProps> = ({ username, onSignOut, userId }) => {
    return (
        <nav className='w-full bg-gray-900 border-b border-primary/20 px-4 py-3 flex items-center justify-between'>
            <div className='flex flex-col gap-1'>
                <span className='text-3xl font-bold text-primary'>
                    PrepYatra
                </span>
                <span className='text-xs text-black'>
                    By The Boring Education
                </span>
            </div>
            <div className='flex items-center gap-4'>
                <NavbarDropdownLinks />
                {userId && <GamificationDisplay userId={userId} />}
                <span className='text-black font-medium hidden sm:inline'>
                    Hello {capitalize(username)}
                </span>
                <Button
                    onClick={onSignOut}
                    variant='outline'
                    className='border-gray-300 text-gray-900 hover:bg-gray-100'>
                    Sign Out
                </Button>
            </div>
        </nav>
    )
}

export default Navbar
