import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const [
      totalUsers,
      totalVideos,
      totalPayments,
      totalRevenue,
      recentUsers,
      recentPayments,
      pendingWithdrawals,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.video.count(),
      prisma.payment.count(),
      prisma.payment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      }),
      prisma.withdrawal.count({
        where: { status: "PENDING" },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalVideos,
        totalPayments,
        totalRevenue: totalRevenue._sum.amount || 0,
        pendingWithdrawals,
      },
      recentUsers,
      recentPayments,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}