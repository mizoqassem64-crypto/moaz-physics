import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { amount, method, accountInfo } = body;

    if (user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Deduct from admin balance
    await prisma.user.update({
      where: { id: user.id },
      data: { balance: { decrement: amount } },
    });

    const withdrawal = await prisma.withdrawal.create({
      data: {
        userId: user.id,
        amount,
        method,
        accountInfo,
        status: "PENDING",
      },
    });

    return NextResponse.json({ withdrawal });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

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

    const withdrawals = await prisma.withdrawal.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json({ withdrawals });
  } catch (error) {
    console.error("Withdrawals fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}