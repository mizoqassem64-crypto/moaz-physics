"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Wallet,
  DollarSign,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Banknote,
} from "lucide-react";

interface Withdrawal {
  id: string;
  amount: number;
  method: string;
  accountInfo: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  createdAt: string;
  user: { name: string };
}

export default function AdminPayments() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "withdrawals" | "history">("overview");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("BANK_TRANSFER");
  const [accountInfo, setAccountInfo] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const [withdrawalsRes, paymentsRes, meRes] = await Promise.all([
        fetch("/api/admin/withdrawals", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/payments", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (withdrawalsRes.ok) {
        const data = await withdrawalsRes.json();
        setWithdrawals(data.withdrawals);
      }
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments);
      }
      if (meRes.ok) {
        const data = await meRes.json();
        setBalance(data.user.balance);
      }
    } catch {
      toast({ title: "Error", description: "Failed to load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod,
          accountInfo,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Withdrawal failed");
      }

      toast({ title: "Success", description: "Withdrawal request submitted" });
      setWithdrawAmount("");
      setAccountInfo("");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-neon-green" />;
      case "REJECTED":
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "BANK_TRANSFER":
        return <Building2 className="w-5 h-5" />;
      case "VODAFONE_CASH":
        return <Smartphone className="w-5 h-5" />;
      case "INSTAPAY":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Banknote className="w-5 h-5" />;
    }
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

  const totalRevenue = payments
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/admin/dashboard")}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-space font-bold text-white">
                Payment <span className="gradient-text">Center</span>
              </h1>
              <p className="text-gray-400">Manage revenue and withdrawals</p>
            </div>
          </div>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass border-neon-green/20 bg-gradient-to-br from-neon-green/10 to-emerald-900/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                  <p className="text-gray-400 mb-1">Available Balance</p>
                  <h2 className="text-5xl font-space font-bold text-white">
                    ${balance.toLocaleString()}
                  </h2>
                  <p className="text-neon-green text-sm mt-1">
                    Total Revenue: ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center mb-2">
                      <TrendingUp className="w-6 h-6 text-neon-blue" />
                    </div>
                    <p className="text-2xl font-bold text-white">{payments.length}</p>
                    <p className="text-xs text-gray-400">Payments</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center mb-2">
                      <Users className="w-6 h-6 text-neon-purple" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {new Set(payments.map((p) => p.user?.name)).size}
                    </p>
                    <p className="text-xs text-gray-400">Customers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {(["overview", "withdrawals", "history"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-space font-medium transition-all ${
                activeTab === tab
                  ? "bg-neon-blue/20 text-neon-blue border border-neon-blue/50"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Withdrawal Form */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-space flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-neon-green" />
                  Withdraw Funds
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWithdraw} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Amount ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="0.00"
                      required
                      max={balance}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Withdrawal Method</Label>
                    <select
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                      className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-white px-3"
                    >
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="VODAFONE_CASH">Vodafone Cash</option>
                      <option value="INSTAPAY">InstaPay</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">
                      {withdrawMethod === "BANK_TRANSFER" ? "IBAN / Account Number" : 
                       withdrawMethod === "VODAFONE_CASH" ? "Phone Number" : "Account Details"}
                    </Label>
                    <Input
                      value={accountInfo}
                      onChange={(e) => setAccountInfo(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Enter account details..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-neon-green hover:bg-neon-green/80 text-black font-bold"
                    disabled={!withdrawAmount || parseFloat(withdrawAmount) > balance}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Request Withdrawal
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-space flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-neon-blue" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.slice(0, 5).map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(payment.status)}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {payment.type === "TOP_UP" ? "Wallet Top-up" : 
                             payment.type === "ONE_TIME" ? "Video Purchase" : "Subscription"}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold ${
                        payment.status === "COMPLETED" ? "text-neon-green" : "text-yellow-400"
                      }`}>
                        ${payment.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === "withdrawals" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-space">Withdrawal History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {withdrawals.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center text-neon-purple">
                          {getMethodIcon(withdrawal.method)}
                        </div>
                        <div>
                          <p className="text-white font-medium">${withdrawal.amount.toFixed(2)}</p>
                          <p className="text-gray-500 text-sm">{withdrawal.accountInfo}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          withdrawal.status === "COMPLETED"
                            ? "bg-neon-green/20 text-neon-green"
                            : withdrawal.status === "PENDING"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {withdrawal.status}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {withdrawals.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No withdrawals yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-white font-space">All Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(payment.status)}
                        <div>
                          <p className="text-white font-medium">
                            {payment.type === "TOP_UP" ? "Wallet Top-up" : 
                             payment.type === "ONE_TIME" ? "Video Purchase" : "Subscription"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {payment.user?.name || "Unknown"} • {new Date(payment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-bold text-lg ${
                        payment.status === "COMPLETED" ? "text-neon-green" : "text-yellow-400"
                      }`}>
                        ${payment.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}