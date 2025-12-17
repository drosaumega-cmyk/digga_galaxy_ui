import Stripe from "stripe";
import { NextResponse } from "next/server";



export async function POST(request: Request) {

  try {
    const sk = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    console.log("[stripe] sk prefix:", sk?.slice(0, 8));
    console.log("[stripe] sk length:", sk?.length);

    if (!sk) {
      throw new Error("Missing STRIPE_SECRET_KEY");
    }

    if (!priceId) {
      throw new Error("Missing STRIPE_PRICE_ID");
    }

    const stripe = new Stripe(sk, {
      apiVersion: "2024-06-20",
    });

    const origin =
      request.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,

          quantity: 1,
        },
      ],
      success_url: `${origin}/success`,

      cancel_url: `${origin}/cancel`,

    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Stripe checkout error" },
      { status: 500 }
    );
  }
}
