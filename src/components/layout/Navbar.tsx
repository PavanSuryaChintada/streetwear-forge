import { Link, useLocation } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { user } = useAuth();
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navUseSolidBar = !isHomeRoute || scrollY > 12 || mobileNavOpen;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-[100] flex flex-col transition-[background,backdrop-filter] duration-300 ${
          navUseSolidBar ? "bg-[rgba(10,10,10,0.82)] backdrop-blur-md mix-blend-normal border-b border-white/[0.06]" : "mix-blend-difference"
        }`}
      >
        <div className="flex w-full items-center justify-between px-4 sm:px-8 lg:px-16 py-4 sm:py-6 text-white">
          <Link
            to="/"
            onClick={() => setMobileNavOpen(false)}
            className="tracking-[-0.02em] hover:opacity-80 transition-opacity text-display"
          >
            <span className="text-[1.65rem] sm:text-[2.5rem] leading-none">STUDIO DENY</span>
          </Link>
          <div className="hidden sm:flex gap-6 lg:gap-8 items-center font-body">
            <Link to="/shop" className="text-sm tracking-wide hover:opacity-60 transition-opacity">SHOP</Link>
            <Link to="/lookbook" className="text-sm tracking-wide hover:opacity-60 transition-opacity">LOOKBOOK</Link>
            <Link to="/about" className="text-sm tracking-wide hover:opacity-60 transition-opacity">ABOUT</Link>
            <Link to="/cart" className="text-sm tracking-wide hover:opacity-60 transition-opacity">CART</Link>
            <div className="w-[1px] h-4 bg-white/20 mx-2 hidden lg:block"></div>
            {user ? (
              <Link to="/account" className="text-sm tracking-wide hover:opacity-60 transition-opacity uppercase">ACCOUNT</Link>
            ) : (
              <Link to="/login" className="text-sm tracking-wide hover:opacity-60 transition-opacity uppercase">LOGIN</Link>
            )}
          </div>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-sm sm:hidden -mr-1 hover:bg-white/10 transition-colors"
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            {mobileNavOpen ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col gap-1 border-t border-white/[0.08] px-4 pb-5 pt-2 sm:hidden overflow-hidden text-white bg-background"
            >
              <Link to="/shop" onClick={() => setMobileNavOpen(false)} className="py-3 text-sm tracking-wide">SHOP</Link>
              <Link to="/lookbook" onClick={() => setMobileNavOpen(false)} className="py-3 text-sm tracking-wide">LOOKBOOK</Link>
              <Link to="/about" onClick={() => setMobileNavOpen(false)} className="py-3 text-sm tracking-wide">ABOUT</Link>
              <Link to="/cart" onClick={() => setMobileNavOpen(false)} className="py-3 text-sm tracking-wide border-b border-white/[0.08]">CART</Link>
              {user ? (
                <Link to="/account" onClick={() => setMobileNavOpen(false)} className="py-3 text-sm tracking-wide text-gray-400 hover:text-white transition-colors uppercase">ACCOUNT</Link>
              ) : (
                <Link to="/login" onClick={() => setMobileNavOpen(false)} className="py-3 text-sm tracking-wide text-gray-400 hover:text-white transition-colors uppercase">LOGIN</Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}
