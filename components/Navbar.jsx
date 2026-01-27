'use client'
import { Package2Icon, Search, ShoppingCart, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";

const Navbar = () => {

    const router = useRouter();
    const { user } = useUser();
    const { signOut, openSignIn } = useClerk();

    // Logic State
    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)

    // UI State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="relative text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                            <span className="text-green-600">g</span>store<span className="text-green-600">.</span>
                            <Protect plan={"plus"}>
                                <span className="absolute -top-2 -right-6 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                                    PLUS
                                </span>
                            </Protect>
                        </Link>
                    </div>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
                        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-green-600 transition-colors">Shop</Link>
                        <Link href="/" className="hover:text-green-600 transition-colors">About</Link>
                        <Link href="/" className="hover:text-green-600 transition-colors">Contact</Link>
                    </div>

                    {/* Desktop Search & Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <form onSubmit={handleSearch} className="relative hidden lg:block">
                            <input
                                className="w-64 bg-slate-100 text-sm rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-green-100 transition-all text-slate-700"
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </form>

                        <Link href="/cart" className="relative text-slate-700 hover:text-green-600 transition-colors">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="flex items-center">
                            {!user ? (
                                <button
                                    onClick={openSignIn}
                                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-full transition-all shadow-md">
                                    Login
                                </button>
                            ) : (
                                <UserButton afterSignOutUrl="/">
                                    <UserButton.MenuItems>
                                        <UserButton.Action
                                            label="My orders"
                                            labelIcon={<Package2Icon size={16} />}
                                            onClick={() => { router.push('/orders') }}
                                        />
                                    </UserButton.MenuItems>
                                </UserButton>
                            )}
                        </div>
                    </div>

                    {/* Mobile Icons & Toggle (Modified) */}
                    <div className="flex md:hidden items-center gap-3">

                        {/* 1. Mobile Cart */}
                        <Link href="/cart" className="relative text-slate-700 p-1">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* 2. Mobile User Element (Moved Here) */}
                        <div className="flex items-center">
                            {user ? (
                                <UserButton afterSignOutUrl="/" />
                            ) : (
                                <button
                                    onClick={openSignIn}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-full">
                                    {/* Show Icon on very small screens, text on larger phones if needed, or just text */}
                                    <span>Login</span>
                                </button>
                            )}
                        </div>

                        {/* 3. Hamburger Menu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-700 focus:outline-none ml-1"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 top-16 px-4 py-6 flex flex-col gap-4 z-40 animate-in slide-in-from-top-2">

                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative w-full">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 outline-none focus:border-green-500 transition-all"
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            required
                        />
                    </form>

                    {/* Mobile Links */}
                    <div className="flex flex-col space-y-2 text-base font-medium text-slate-700">
                        <Link href="/" className="py-2 border-b border-gray-50 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link href="/shop" className="py-2 border-b border-gray-50 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                        <Link href="/" className="py-2 border-b border-gray-50 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
                        <Link href="/" className="py-2 border-b border-gray-50 hover:text-green-600" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar;