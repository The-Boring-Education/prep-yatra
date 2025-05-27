import React from "react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
    username: string
    onSignOut: () => void
}

const Navbar: React.FC<NavbarProps> = ({ username, onSignOut }) => {
    return (
        <nav className='w-full bg-gray-900 border-b border-primary/20 px-4 py-3 flex items-center justify-between'>
            <div className='flex flex-col gap-1'>
                <span className='text-3xl font-bold text-primary'>
                    PrepYatra
                </span>
                <span className='text-xs text-white'>
                    By The Boring Education
                </span>
            </div>
            <div className='flex items-center gap-4'>
                <span className='text-white font-medium hidden sm:inline'>
                    {username}
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
