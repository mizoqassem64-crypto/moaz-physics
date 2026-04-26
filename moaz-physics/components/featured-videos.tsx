"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, Star, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const videos = [
  {
    id: "1",
    title: "Einstein's Spacetime Curvature",
    thumbnail: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=600&h=340&fit=crop",
    duration: "18:45",
    category: "Relativity",
    price: 0,
    isFree: true,
    rating: 4.9,
  },
  {
    id: "2",
    title: "Quantum Superposition Explained",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=340&fit=crop",
    duration: "24:30",
    category: "Quantum",
    price: 9.99,
    isFree: false,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Black Hole Information Paradox",
    thumbnail: "https://images.unsplash.com/photo-1614730341194-75c60740a2d3?w=600&h=340&fit=crop",
    duration: "32:15",
    category: "Advanced",
    price: 14.99,
    isFree: false,
    rating: 5.0,
  },
  {
    id: "4",
    title: "The Standard Model of Physics",
    thumbnail: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&h=340&fit=crop",
    duration: "28:00",
    category: "Quantum",
    price: 0,
    isFree: true,
    rating: 4.7,
  },
];

export function FeaturedVideos() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-space font-bold mb-4">
              <span className="gradient-text">Featured Courses</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Hand-picked lessons from Moaz Qassem's physics collection
            </p>
          </div>
          <Link href="/user/dashboard">
            <Button variant="outline" className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/20">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link href={`/user/dashboard?video=${video.id}`}>
                <div className="glass rounded-2xl overflow-hidden hover-lift">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 rounded-full bg-neon-blue/90 flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/80 text-xs font-medium text-white flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </div>

                    {/* Free/Paid badge */}
                    <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                      video.isFree 
                        ? "bg-neon-green/20 text-neon-green border border-neon-green/30" 
                        : "bg-neon-blue/20 text-neon-blue border border-neon-blue/30"
                    }`}>
                      {video.isFree ? "FREE" : `$${video.price}`}
                    </div>

                    {!video.isFree && (
                      <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm">
                        <Lock className="w-4 h-4 text-neon-blue" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple">
                        {video.category}
                      </span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">{video.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-space font-bold text-white group-hover:text-neon-cyan transition-colors line-clamp-2">
                      {video.title}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}