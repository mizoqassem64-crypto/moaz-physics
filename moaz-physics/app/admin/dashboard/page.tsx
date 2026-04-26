"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Video,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  Activity,
  LogOut,
  LayoutDashboard,
  Film,
  FileText,
  Settings,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalVideos: number;
  totalPayments: number;
  totalRevenue: number;
  pendingWithdrawals: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 403) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch stats");
      }

      const data = await res.json();
      setStats(data.stats);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load admin stats",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

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

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <Users className="w-6 h-6" />,
      trend: "+12%",
      color: "from-neon-blue/20 to-cyan-500/20",
      iconColor: "text-neon-blue",
    },
    {
      title: "Total Videos",
      value: stats?.totalVideos || 0,
      icon: <Video className="w-6 h-6" />,
      trend: "+8%",
      color: "from-neon-purple/20 to-pink-500/20",
      iconColor: "text-neon-purple",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      trend: "+24%",
      color: "from-neon-green/20 to-emerald-500/20",
      iconColor: "text-neon-green",
    },
    {
      title: "Pending Withdrawals",
      value: stats?.pendingWithdrawals || 0,
      icon: <Wallet className="w-6 h-6" />,
      trend: "-3%",
      color: "from-neon-pink/20 to-rose-500/20",
      iconColor: "text-neon-pink",
    },
  ];

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
              Admin <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-gray-400">Manage your physics empire</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/payments">
              <Button variant="outline" className="border-neon-green/50 text-neon-green hover:bg-neon-green/20">
                <Wallet className="w-4 h-4 mr-2" />
                Withdrawals
              </Button>
            </Link>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`glass border-white/10 bg-gradient-to-br ${stat.color}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.iconColor} bg-white/5`}>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-space font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-sm">
                    {stat.trend.startsWith("+") ? (
                      <ArrowUpRight className="w-4 h-4 text-neon-green mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-neon-pink mr-1" />
                    )}
                    <span className={stat.trend.startsWith("+") ? "text-neon-green" : "text-neon-pink"}>
                      {stat.trend}
                    </span>
                    <span className="text-gray-500 ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-space font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/videos">
              <div className="glass rounded-xl p-6 hover-lift group cursor-pointer border border-neon-blue/20 hover:border-neon-blue/50">
                <Film className="w-8 h-8 text-neon-blue mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-space font-bold text-white mb-1">Manage Videos</h3>
                <p className="text-gray-400 text-sm">Add, edit, or remove video content</p>
              </div>
            </Link>
            <Link href="/admin/files">
              <div className="glass rounded-xl p-6 hover-lift group cursor-pointer border border-neon-purple/20 hover:border-neon-purple/50">
                <FileText className="w-8 h-8 text-neon-purple mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-space font-bold text-white mb-1">File Manager</h3>
                <p className="text-gray-400 text-sm">Upload and manage course files</p>
              </div>
            </Link>
            <Link href="/admin/payments">
              <div className="glass rounded-xl p-6 hover-lift group cursor-pointer border border-neon-green/20 hover:border-neon-green/50">
                <CreditCard className="w-8 h-8 text-neon-green mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-space font-bold text-white mb-1">Payments</h3>
                <p className="text-gray-400 text-sm">View revenue and manage withdrawals</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-white font-space flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neon-green" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-around gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="w-full bg-gradient-to-t from-neon-blue/50 to-neon-purple/50 rounded-t-sm hover:from-neon-blue hover:to-neon-purple transition-all cursor-pointer"
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-500">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}