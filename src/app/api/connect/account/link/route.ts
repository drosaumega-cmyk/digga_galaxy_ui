import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request body
    const body = await req.json();
    const { accountId } = body;

    if (!accountId) {
      throw new Error("Missing accountId");
    }

    // 2️⃣ Load Stripe secret key
    const sk = process.env.STRIPE_SECRET_KEY;
    if (!sk) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    const stripe = new Stripe(sk);


    // 3️⃣ Create onboarding Account Link
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      refresh_url: "http://localhost:3000/connect/refresh",
      return_url: "http://localhost:3000/connect/return",
    });

    // 4️⃣ Send URL back to frontend
    return NextResponse.json({
      url: accountLink.url,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message ?? "Failed to create account link",
      },
      { status: 500 }
    );
  }
}
