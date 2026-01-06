import { NextResponse } from "next/server";

export async function GET() {
  // Build your JSON response
  const response = NextResponse.json({
    ok: true,
    app: "digga-galaxy-ui",
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0",
    env: process.env.NODE_ENV ?? "unknown",
    serverTime: new Date().toISOString(),
  });

  // ✅ Add CORS headers so browsers can connect
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

// ✅ Handle preflight (OPTIONS) requests too
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
