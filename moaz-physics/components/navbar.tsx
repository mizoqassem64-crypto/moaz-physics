"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Atom,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Wallet,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/relativity", label: "Relativity" },
  { href: "/quantum", label: "Quantum" },
  { href: "/#pricing", label: "Pricing" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock auth state - replace with real auth
  const isAuthenticated = false;
  const isAdmin = false;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-strong border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <div className="absolute inset-1 bg-space-900 rounded-lg flex items-center justify-center">
                <span className="font-space font-bold text-lg gradient-text">M</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-space font-bold text-xl text-white">MOAZ</span>
              <span className="font-space text-xs text-neon-blue block -mt-1 tracking-widest">PHYSICS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`font-space tracking-wider ${
                    pathname === link.href
                      ? "text-neon-blue bg-neon-blue/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin/dashboard">
                    <Button variant="ghost" className="text-neon-purple hover:bg-neon-purple/10">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  </Link>
                )}
                <Link href="/user/dashboard">
                  <Button variant="ghost" className="text-neon-blue hover:bg-neon-blue/10">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" className="text-gray-400 hover:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-white">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue border border-neon-blue/50 font-space">
                    <Atom className="w-4 h-4 mr-2" />
                    Join Free
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 font-space ${
                    pathname === link.href ? "text-neon-blue" : "text-gray-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/20 text-white">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-neon-blue/20 text-neon-blue border border-neon-blue/50">
                    Join Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}