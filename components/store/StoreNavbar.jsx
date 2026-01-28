'use client'
import { useUser, UserButton } from "@clerk/nextjs"
import Link from "next/link"

const StoreNavbar = () => {

    const { user } = useUser();

    return (
        <div className="flex items-center justify-between px-12 py-4 border-b border-secondary/10 bg-surface/50 transition-all">
            <Link href="/" className="relative text-4xl font-semibold text-text-main font-serif">
                <span className="text-secondary">go</span>cart<span className="text-secondary text-5xl leading-0">.</span>
                <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-1 rounded-full flex items-center gap-2 text-primary-foreground bg-primary border border-white/20 shadow-sm">
                    Store
                </p>
            </Link>
            <div className="flex items-center gap-3 text-text-muted">
                <p>Hi, {user?.firstName}</p>
                <UserButton />
            </div>
        </div>
    )
}

export default StoreNavbar