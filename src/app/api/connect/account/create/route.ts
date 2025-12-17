import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) throw new Error("Missing STRIPE_SECRET_KEY");

    const stripe = new Stripe(sk, {});


    // CREATE A CONNECTED ACCOUNT (THIS IS THE KEY)
    const account = await stripe.accounts.create({
      type: "express", // <-- IMPORTANT
      country: "US",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    return NextResponse.json({
      ok: true,
      connectedAccountId: account.id,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
