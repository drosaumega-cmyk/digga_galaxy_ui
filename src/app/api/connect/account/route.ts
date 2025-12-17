import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) throw new Error("Missing STRIPE_SECRET_KEY");

    const stripe = new Stripe(sk);


    // Safest start: Express connected accounts (Stripe-hosted onboarding)
    const account = await stripe.accounts.create({
      type: "express",
    });

    return NextResponse.json({ accountId: account.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Create connected account failed" },
      { status: 500 }
    );
  }
}
