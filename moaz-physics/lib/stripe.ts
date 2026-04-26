import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-18.acacia",
  typescript: true,
});

export async function createCheckoutSession({
  priceId,
  userId,
  mode = "payment",
}: {
  priceId: string;
  userId: string;
  mode?: "payment" | "subscription";
}) {
  const session = await stripe.checkout.sessions.create({
    mode,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    client_reference_id: userId,
    metadata: { userId },
    allow_promotion_codes: true,
  });

  return session;
}

export async function createWithdrawalSession({
  amount,
  userId,
}: {
  amount: number;
  userId: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Wallet Top-up",
            description: `Add $${amount} to your account`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/dashboard?topup=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/user/dashboard?topup=canceled`,
    metadata: { userId, type: "topup" },
  });

  return session;
}