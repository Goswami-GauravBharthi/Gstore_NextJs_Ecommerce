'use client'

import { usePathname } from "next/navigation"
import { HomeIcon, ShieldCheckIcon, StoreIcon, TicketPercentIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { assets } from "@/assets/assets"
import { useUser } from "@clerk/nextjs"

const AdminSidebar = () => {

    const pathname = usePathname()

    const { user } = useUser();

    const sidebarLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Stores', href: '/admin/stores', icon: StoreIcon },
        { name: 'Approve Store', href: '/admin/approve', icon: ShieldCheckIcon },
        { name: 'Coupons', href: '/admin/coupons', icon: TicketPercentIcon },
    ]

    return user && (
        <div className="inline-flex h-full flex-col gap-5 border-r border-secondary/10 bg-surface/50 sm:min-w-60">
            <div className="flex flex-col gap-3 justify-center items-center pt-8 max-sm:hidden">
                <Image className="w-14 h-14 rounded-full border-2 border-secondary/20 p-0.5" src={user?.imageUrl} alt="user image" width={80} height={80} />
                <p className="text-text-main font-medium">Hi, {user?.fullName}</p>
            </div>

            <div className="max-sm:mt-6 px-3">
                {
                    sidebarLinks.map((link, index) => (
                        <Link key={index} href={link.href} className={`relative flex items-center gap-3 text-text-muted hover:bg-secondary/10 hover:text-primary p-3 rounded-lg transition mb-1 ${pathname === link.href && 'bg-secondary/10 text-primary font-medium'}`}>
                            <link.icon size={18} className="sm:ml-2" />
                            <p className="max-sm:hidden">{link.name}</p>
                            {pathname === link.href && <span className="absolute bg-primary right-0 top-1.5 bottom-1.5 w-1 sm:w-1.5 rounded-l-full h-auto my-auto"></span>}
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default AdminSidebar