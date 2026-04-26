"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PhysicsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
  image: string;
}

export function PhysicsCard({ title, description, icon, href, color, image }: PhysicsCardProps) {
  const colorMap: Record<string, string> = {
    "neon-blue": "from-neon-blue/20 to-cyan-500/20 border-neon-blue/30",
    "neon-purple": "from-neon-purple/20 to-pink-500/20 border-neon-purple/30",
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative group overflow-hidden rounded-2xl border bg-gradient-to-br ${colorMap[color]} p-8 cursor-pointer transition-all duration-500`}
      >
        <div className="absolute inset-0 opacity-30">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/80 to-transparent" />
        </div>

        <div className="relative z-10">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${colorMap[color]} mb-6 text-white`}>
            {icon}
          </div>

          <h3 className="text-2xl font-space font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
            {title}
          </h3>

          <p className="text-gray-400 leading-relaxed mb-6">
            {description}
          </p>

          <div className="flex items-center gap-2 text-neon-cyan font-medium group-hover:gap-4 transition-all">
            <span>Explore</span>
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        {/* Animated corner accent */}
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-white/5 to-transparent"
          whileHover={{ scale: 2 }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </Link>
  );
}