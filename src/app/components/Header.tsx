'use client'
import { useState } from 'react'
import { Settings, HelpCircle, LogOut, Sun, Moon, ShieldCheck, LogIn } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { useTheme } from '../../lib/theme'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '../../../public/images/App-Snap-Logo-Small.png'
import useLogin from '../hooks/useLogin'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const { logout } = useLogin()


    return (
        <Card className="text-card-foreground shadow-md p-4 flex rounded-none">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold flex items-center">
                    <Image src={Logo} alt="App Snap Logo" width={26} height={26} style={{ marginRight: 10 }} />
                    App Snap POS
                </h1>
            </div>
            <div className="container mx-auto flex justify-end items-center">
                <div className="container mx-auto flex justify-end items-center">
                    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/placeholder.svg" alt="User avatar" />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem onClick={toggleTheme}>
                                {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                                <span>{theme === 'light' ? 'Dark' : 'Light'} mode</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                <span>Help</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/admin">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    <span>Admin Panel</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        </Card>
    )
}

