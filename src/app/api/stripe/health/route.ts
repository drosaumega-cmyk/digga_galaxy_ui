import { NextResponse } from "next/server";

export async function GET() {
  const hasSecret = Boolean(process.env.STRIPE_SECRET_KEY);

  return NextResponse.json({
    ok: true,
    stripeKeyLoaded: hasSecret,
    env: process.env.NODE_ENV,
    serverTime: new Date().toISOString(),
  });
}
