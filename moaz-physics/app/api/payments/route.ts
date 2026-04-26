import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe, createCheckoutSession } from "@/lib/stripe";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const user = await getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, amount, videoId, plan } = body;

    if (type === "topup") {
      // Wallet top-up via Stripe
      const session = await createCheckoutSession({
        priceId: "price_custom",
        userId: user.id,
      });

      await prisma.payment.create({
        data: {
          userId: user.id,
          amount: amount,
          currency: "USD",
          status: "PENDING",
          type: "TOP_UP",
          stripePaymentId: session.id,
        },
      });

      return NextResponse.json({ sessionId: session.id, url: session.url });
    }

    if (type === "purchase" && videoId) {
      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        return NextResponse.json(
          { error: "Video not found" },
          { status: 404 }
        );
      }

      // Check if user has enough balance
      if (user.balance >= video.price) {
        // Deduct from balance
        await prisma.user.update({
          where: { id: user.id },
          data: { balance: { decrement: video.price } },
        });

        // Create purchase record
        await prisma.purchase.create({
          data: {
            userId: user.id,
            videoId: video.id,
            price: video.price,
          },
        });

        // Create payment record
        await prisma.payment.create({
          data: {
            userId: user.id,
            amount: video.price,
            currency: "USD",
            status: "COMPLETED",
            type: "ONE_TIME",
          },
        });

        return NextResponse.json({ success: true, message: "Purchase successful" });
      } else {
        // Not enough balance - redirect to Stripe
        const session = await stripe.checkout.sessions.create({
          mode: "payment",
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: video.title,
                  description: video.description || undefined,
                },
                unit_amount: Math.round(video.price * 100),
              },
              quantity: 1,
            },
          ],
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/dashboard?purchase=success&video=${videoId}`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/dashboard?purchase=canceled`,
          metadata: { userId: user.id, videoId, type: "purchase" },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
      }
    }

    return NextResponse.json(
      { error: "Invalid payment type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Payment error:", error);
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

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("Payments fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}