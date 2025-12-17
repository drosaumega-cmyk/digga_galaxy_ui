import { NextResponse } from "next/server";

export async function GET() {
  // Safe, public diagnostic response
  return NextResponse.json({
    ok: true,
    app: "digga-galaxy-ui",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
    env: process.env.NODE_ENV ?? "unknown",
    serverTime: new Date().toISOString(),
  });
}
