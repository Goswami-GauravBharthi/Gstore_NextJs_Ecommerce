'use client'
import { Package2Icon, Search, ShoppingCart, Menu, X, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useUser, useClerk, UserButton, Protect } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/lib/framermotionAnimation";

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
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="sticky top-0 z-50 w-full glass-panel border-b border-secondary/20 transition-all"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="relative text-2xl sm:text-3xl font-bold text-primary tracking-tight group select-none">
                            <span className="text-secondary group-hover:text-primary transition-colors">G</span>store<span className="text-secondary">.</span>
                            <Protect plan={"plus"}>
                                <span className="absolute -top-2 -right-6 bg-surface text-secondary text-[10px] font-bold px-2 py-0.5 rounded-full border border-secondary/20">
                                    PLUS
                                </span>
                            </Protect>
                        </Link>
                    </div>

                    {/* Desktop Navigation (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-text-muted">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    </div>

                    {/* Desktop Search & Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <form onSubmit={handleSearch} className="relative hidden lg:block">
                            <input
                                className="w-64 bg-background/50 text-sm rounded-full pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-secondary/20 border border-transparent focus:border-secondary/30 transition-all text-text-main placeholder:text-text-muted/60"
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                        </form>

                        <Link href="/cart" className="relative text-text-main hover:text-primary transition-colors">
                            <ShoppingCart size={22} />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        <div className="flex items-center">
                            {!user ? (
                                <button
                                    onClick={openSignIn}
                                    className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-full transition-all shadow-md">
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
                        <Link href="/cart" className="relative text-text-main p-1">
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>

                        {/* 2. Mobile User Element (Moved Here) */}
                        <div className="flex items-center">
                            {user ? (
                                <UserButton afterSignOutUrl="/" />
                            ) : (
                                <button
                                    onClick={openSignIn}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                    <span>Login</span>
                                </button>
                            )}
                        </div>

                        {/* 3. Hamburger Menu */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-text-main focus:outline-none ml-1"
                        >
                            <motion.div
                                key={isMobileMenuOpen ? "close" : "open"}
                                initial={{ opacity: 0, rotate: -90 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </motion.div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden bg-surface border-t border-secondary/10 shadow-xl overflow-hidden"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {/* Mobile Search */}
                            <form onSubmit={handleSearch} className="relative w-full">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                                <input
                                    className="w-full bg-background border border-secondary/10 text-sm rounded-lg pl-10 pr-4 py-3 outline-none focus:border-secondary transition-all text-text-main"
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    required
                                />
                            </form>

                            {/* Mobile Links */}
                            <div className="flex flex-col space-y-4 text-base font-medium text-text-main">
                                <Link href="/" className="py-2 border-b border-secondary/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                                <Link href="/shop" className="py-2 border-b border-secondary/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Shop</Link>
                                <Link href="/orders" className="py-2 border-b border-secondary/10 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}

export default Navbar;