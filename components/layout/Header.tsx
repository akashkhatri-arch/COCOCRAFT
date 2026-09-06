"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, Search, ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { siteConfig } from "@/config/site";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { CartDrawer } from "@/components/cart/CartDrawer";

const navLinks = [
  { label: "Shop", href: "/products" },
  { label: "Customize", href: "/customize" },
  { label: "Gifts", href: "/products?category=gift-boxes" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

interface HeaderProps {
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount: cartCountOverride }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = React.useState("");
  const [scrolled, setScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const desktopSearchInputRef = React.useRef<HTMLInputElement>(null);

  const getCartCount = useCartStore((state) => state.getCartCount);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const wishlistCount = useWishlistStore((state) => state.itemIds.length);
  const dynamicCartCount = getCartCount();
  const cartCount = mounted
    ? cartCountOverride !== undefined
      ? cartCountOverride
      : dynamicCartCount
    : 0;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  React.useEffect(() => {
    if (searchOpen && desktopSearchInputRef.current) {
      desktopSearchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileOpen(false);
      setMobileSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled || searchOpen
            ? "bg-white/95 backdrop-blur-sm border-b border-cream-200 shadow-sm py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
              aria-label={`${siteConfig.brandName} – Home`}
            >
              <span className="font-serif text-2xl tracking-tight text-choco-900 select-none">
                {siteConfig.brandName}
              </span>
              <span className="hidden sm:inline-block text-[9px] font-montserrat font-bold tracking-[0.25em] uppercase text-gold-600 self-end mb-0.5 select-none">
                {siteConfig.brandSubtitle}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-montserrat font-bold text-choco-700 hover:text-choco-950 tracking-wide transition-colors relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-gold-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Actions: Search, Account, Cart, Mobile Toggle */}
            <div className="flex items-center gap-1.5">
              {/* Desktop Search Toggle Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search chocolates"
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-choco-700 hover:bg-cream-100 hover:text-choco-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <Search className="h-4.5 w-4.5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                aria-label={`Wishlist (${wishlistCount} items)`}
                className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-full text-choco-700 hover:bg-cream-100 hover:text-choco-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <Heart className="h-4.5 w-4.5" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 text-[9px] font-montserrat font-bold text-choco-950">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Account Link */}
              <Link
                href="/account"
                aria-label="My account"
                className="hidden md:flex items-center justify-center w-10 h-10 rounded-full text-choco-700 hover:bg-cream-100 hover:text-choco-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* Shopping Cart Link / Drawer Trigger */}
              <Link
                href="/cart"
                onClick={(e) => {
                  if (pathname !== "/cart") {
                    e.preventDefault();
                    openDrawer();
                  }
                }}
                aria-label={`Shopping cart (${cartCount} items)`}
                className="relative flex items-center justify-center w-10 h-10 rounded-full text-choco-700 hover:bg-cream-100 hover:text-choco-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[9px] font-montserrat font-bold text-choco-950"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </motion.span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-choco-700 hover:bg-cream-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Desktop Expandable Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden pt-3 border-t border-cream-200 mt-3 hidden md:block"
              >
                <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-xl mx-auto pb-1">
                  <Search className="absolute left-3.5 h-4 w-4 text-choco-400 pointer-events-none" />
                  <input
                    ref={desktopSearchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search chocolates by flavor, ingredient, or occasion..."
                    className="w-full pl-10 pr-12 py-2.5 rounded-full border border-cream-300 bg-cream-50 text-sm font-sans text-choco-950 focus:outline-none focus:border-gold-500 focus:bg-white transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="absolute right-1.5 p-1.5 bg-choco-900 text-cream-50 rounded-full hover:bg-choco-800 transition-colors"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-choco-950/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col md:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              aria-label="Mobile navigation"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-cream-100">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 font-serif text-xl text-choco-900"
                >
                  <span>{siteConfig.brandName}</span>
                  <span className="text-[9px] font-montserrat font-bold tracking-[0.2em] uppercase text-gold-600 self-end mb-0.5">
                    {siteConfig.brandSubtitle}
                  </span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-100 text-choco-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Search Bar */}
              <form onSubmit={handleMobileSearchSubmit} className="p-4 border-b border-cream-100 bg-cream-50/50">
                <div className="relative flex items-center">
                  <Search className="absolute left-3.5 h-4 w-4 text-choco-400 pointer-events-none" />
                  <input
                    type="text"
                    value={mobileSearchQuery}
                    onChange={(e) => setMobileSearchQuery(e.target.value)}
                    placeholder="Search chocolates..."
                    className="w-full pl-10 pr-10 py-2 text-sm font-sans rounded-xl border border-cream-200 bg-white text-choco-950 focus:outline-none focus:border-gold-500"
                  />
                  {mobileSearchQuery && (
                    <button
                      type="submit"
                      aria-label="Search"
                      className="absolute right-2 p-1 text-choco-600 hover:text-choco-900"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>

              {/* Nav Links */}
              <div className="flex flex-col gap-1 p-4 flex-1 overflow-y-auto">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center px-4 py-3 rounded-xl text-base font-montserrat font-bold text-choco-800 hover:bg-cream-50 hover:text-choco-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile Wishlist Link */}
                <Link
                  href="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-montserrat font-bold text-choco-800 hover:bg-cream-50 hover:text-choco-950 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-gold-600" />
                    <span>Wishlist</span>
                  </span>
                  {mounted && wishlistCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-300 text-choco-950 text-xs font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-cream-100 flex gap-3 bg-cream-50/30">
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border border-cream-200 rounded-xl font-montserrat font-bold text-sm text-choco-800 hover:bg-cream-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    if (pathname !== "/cart") {
                      openDrawer();
                    } else {
                      router.push("/cart");
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-choco-900 text-cream-50 rounded-xl font-montserrat font-bold text-sm hover:bg-choco-800 transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Cart {cartCount > 0 && `(${cartCount})`}
                </button>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer />
    </>
  );
};
