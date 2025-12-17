import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) throw new Error("Missing STRIPE_SECRET_KEY");

    const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });

    const acct = await stripe.accounts.retrieve();

    return NextResponse.json({
      ok: true,
      stripeAccountId: acct.id,
      country: acct.country,
      charges_enabled: acct.charges_enabled,
      payouts_enabled: acct.payouts_enabled,
      type: acct.type,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "stripe whoami failed" },
      { status: 500 }
    );
  }
}
