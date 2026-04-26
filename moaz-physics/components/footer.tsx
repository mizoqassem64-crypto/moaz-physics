"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Atom, Github, Twitter, Youtube, Mail, Heart } from "lucide-react";

const footerLinks = {
  learn: [
    { label: "Relativity", href: "/relativity" },
    { label: "Quantum Mechanics", href: "/quantum" },
    { label: "Video Courses", href: "/user/dashboard" },
    { label: "3D Simulations", href: "/#simulations" },
  ],
  account: [
    { label: "Dashboard", href: "/user/dashboard" },
    { label: "My Library", href: "/user/dashboard?tab=library" },
    { label: "Subscription", href: "/user/dashboard?tab=billing" },
    { label: "Settings", href: "/user/dashboard?tab=settings" },
  ],
  admin: [
    { label: "Admin Panel", href: "/admin/dashboard" },
    { label: "Videos", href: "/admin/videos" },
    { label: "Payments", href: "/admin/payments" },
    { label: "Withdrawals", href: "/admin/payments?tab=withdrawals" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-space-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-purple rounded-xl rotate-45" />
                <div className="absolute inset-1 bg-space-900 rounded-lg flex items-center justify-center">
                  <span className="font-space font-bold text-2xl gradient-text">M</span>
                </div>
              </div>
              <div>
                <span className="font-space font-bold text-2xl text-white">MOAZ</span>
                <span className="font-space text-sm text-neon-blue block -mt-1 tracking-widest">PHYSICS</span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Professional physics education platform by Moaz Qassem. 
              Explore quantum mechanics and relativity through immersive 3D experiences.
            </p>
            <div className="flex gap-4">
              {[Github, Twitter, Youtube, Mail].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, scale: 1.1 }}
                  className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-neon-blue/50 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-space font-bold text-white mb-4">Learn</h4>
            <ul className="space-y-3">
              {footerLinks.learn.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-neon-blue transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-space font-bold text-white mb-4">Account</h4>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-neon-blue transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-space font-bold text-white mb-4">Admin</h4>
            <ul className="space-y-3">
              {footerLinks.admin.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-neon-purple transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 MOAZ Physics. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Designed with <Heart className="w-4 h-4 text-red-500 fill-current" /> by{" "}
            <span className="text-neon-blue font-space font-bold">Moaz Qassem</span>
          </p>
        </div>
      </div>
    </footer>
  );
}