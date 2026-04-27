"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Atom, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Welcome back!", description: "Login successful" });
        
        // حفظ التوكن في المتصفح وفي الـ Cookies عشان الـ Middleware يقدر يقرأه
        if (data.token) {
          localStorage.setItem("token", data.token);
          // السطر السحري اللي هيحل المشكلة:
          document.cookie = `token=${data.token}; path=/; max-age=604800`;
        }

        // --- تعديل هندسي ذكي للتوجيه ---
        // أولاً: لو الإيميل هو إيميلك الشخصي، ابعته للأدمن فوراً (Force Entry)
        if (email === "mizoqassem64@gmail.com") {
          window.location.href = "/admin/dashboard";
          return;
        }

        // ثانياً: لو البيانات فيها Role بشكل صريح
        const userRole = data.user?.role || data.role; 
        
        if (userRole === 'ADMIN') {
          window.location.href = "/admin/dashboard";
        } else {
          // لو طالب عادي يروح للرئيسية بدل الداشبورد المعلقة
          window.location.href = "/";
        }

      } else {
        toast({ 
          title: "Error", 
          description: data.error || "Invalid credentials",
          variant: "destructive" 
        });
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast({ 
        title: "Error", 
        description: "Something went wrong",
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 border border-neon-blue/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 mb-4">
              <Atom className="w-8 h-8 text-neon-blue" />
            </div>
            <h1 className="text-3xl font-space font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-400">Sign in to your MOAZ Physics account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-neon-blue"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-neon-blue"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-blue hover:bg-neon-blue/80 text-black font-bold py-6 text-lg font-space"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-neon-blue hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
