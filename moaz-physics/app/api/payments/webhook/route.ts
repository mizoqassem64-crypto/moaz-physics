import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, videoId, type } = session.metadata || {};

    if (type === "topup" && userId) {
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
      });

      await prisma.payment.create({
        data: {
          userId,
          amount,
          currency: "USD",
          status: "COMPLETED",
          type: "TOP_UP",
          stripePaymentId: session.id,
        },
      });
    }

    if (type === "purchase" && userId && videoId) {
      const amount = session.amount_total ? session.amount_total / 100 : 0;

      await prisma.purchase.create({
        data: {
          userId,
          videoId,
          price: amount,
        },
      });

      await prisma.payment.create({
        data: {
          userId,
          amount,
          currency: "USD",
          status: "COMPLETED",
          type: "ONE_TIME",
          stripePaymentId: session.id,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}