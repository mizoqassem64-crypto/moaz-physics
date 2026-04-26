"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Play,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  Lock,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Wallet,
  Search,
  Filter,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  category: string;
  price: number;
  isFree: boolean;
  progress?: number;
  purchased?: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  role: string;
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [myVideos, setMyVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "my" | "billing">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const [meRes, videosRes] = await Promise.all([
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/videos", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!meRes.ok) {
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }

      const meData = await meRes.json();
      setUser(meData.user);

      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData.videos);

        // Filter purchased videos
        const purchased = videosData.videos.filter((v: Video) => v.purchased || v.isFree);
        setMyVideos(purchased);
      }
    } catch {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (videoId: string, price: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "purchase",
          videoId,
          amount: price,
        }),
      });

      const data = await res.json();

      if (data.url) {
        // Stripe checkout
        window.location.href = data.url;
      } else if (data.success) {
        toast({ title: "Success", description: "Purchase successful!" });
        fetchUserData();
      }
    } catch {
      toast({ title: "Error", description: "Purchase failed", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || video.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", "Relativity", "Quantum", "Classical", "Advanced"];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse delay-100" />
          <div className="w-3 h-3 rounded-full bg-neon-pink animate-pulse delay-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-space font-bold text-white mb-2">
              My <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-gray-400">Welcome back, {user?.name || "Explorer"}</p>
          </div>
          <div className="flex gap-3">
            <div className="glass px-4 py-2 rounded-xl flex items-center gap-2">
              <Wallet className="w-5 h-5 text-neon-green" />
              <span className="text-white font-bold">${user?.balance?.toFixed(2) || "0.00"}</span>
            </div>
            <Button
              variant="outline"
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "My Courses", value: myVideos.length, icon: <BookOpen className="w-5 h-5" />, color: "text-neon-blue" },
            { label: "Completed", value: myVideos.filter((v) => v.progress === 100).length, icon: <CheckCircle className="w-5 h-5" />, color: "text-neon-green" },
            { label: "In Progress", value: myVideos.filter((v) => v.progress && v.progress > 0 && v.progress < 100).length, icon: <Clock className="w-5 h-5" />, color: "text-yellow-400" },
            { label: "Total Spent", value: `$${myVideos.filter((v) => !v.isFree).reduce((sum, v) => sum + v.price, 0).toFixed(2)}`, icon: <CreditCard className="w-5 h-5" />, color: "text-neon-purple" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="glass border-white/10">
                <CardContent className="p-4">
                  <div className={`${stat.color} mb-2`}>{stat.icon}</div>
                  <p className="text-2xl font-space font-bold text-white">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {(["all", "my", "billing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-space font-medium transition-all ${
                activeTab === tab
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/50"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab === "all" ? "All Courses" : tab === "my" ? "My Library" : "Billing"}
            </button>
          ))}
        </div>

        {/* All Courses Tab */}
        {activeTab === "all" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      categoryFilter === cat
                        ? "bg-neon-purple/20 text-neon-purple border border-neon-purple/50"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl overflow-hidden group"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-space-700 to-space-800">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        video.isFree
                          ? "bg-neon-green/20 text-neon-green"
                          : "bg-neon-blue/20 text-neon-blue"
                      }`}>
                        {video.isFree ? "FREE" : `$${video.price}`}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple">
                        {video.category}
                      </span>
                      <span className="text-xs text-gray-500">{Math.floor(video.duration / 60)}m</span>
                    </div>
                    <h3 className="font-space font-bold text-white mb-2 line-clamp-1">{video.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{video.description}</p>

                    {video.purchased || video.isFree ? (
                      <Button className="w-full bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/50">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePurchase(video.id, video.price)}
                        className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock for ${video.price}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* My Library Tab */}
        {activeTab === "my" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-video">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-space-700 to-space-800">
                        <Play className="w-12 h-12 text-gray-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent" />

                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div
                        className="h-full bg-neon-blue transition-all"
                        style={{ width: `${video.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-space font-bold text-white mb-2">{video.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">
                        {video.progress === 100 ? (
                          <span className="text-neon-green flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Completed
                          </span>
                        ) : (
                          <span>{video.progress || 0}% watched</span>
                        )}
                      </span>
                      <Button size="sm" className="bg-neon-blue/20 hover:bg-neon-blue/30 text-neon-blue">
                        <Play className="w-4 h-4 mr-1" />
                        {video.progress && video.progress > 0 ? "Resume" : "Start"}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {myVideos.length === 0 && (
                <div className="col-span-full text-center py-16">
                  <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No courses yet</p>
                  <Button
                    onClick={() => setActiveTab("all")}
                    className="mt-4 bg-neon-blue hover:bg-neon-blue/80 text-black"
                  >
                    Browse Courses
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
            <Card className="glass border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white font-space flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-neon-green" />
                  Wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-5xl font-space font-bold text-white mb-2">
                    ${user?.balance?.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-gray-400 mb-6">Available for purchases</p>
                  <Button
                    onClick={() => {
                      // Stripe top-up redirect
                      window.location.href = "/api/payments?type=topup&amount=50";
                    }}
                    className="bg-neon-green hover:bg-neon-green/80 text-black font-bold"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Add Funds
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-space">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Mock payment history */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-neon-green" />
                      <div>
                        <p className="text-white text-sm">Wallet Top-up</p>
                        <p className="text-gray-500 text-xs">Apr 26, 2026</p>
                      </div>
                    </div>
                    <span className="text-neon-green font-bold">+$50.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}