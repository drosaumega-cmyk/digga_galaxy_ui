import { NextResponse } from "next/server";

export const runtime = "nodejs"; // safer for process.env access

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: "digga-galaxy-ui",
    version: process.env.npm_package_version ?? "unknown",
    env: process.env.NODE_ENV ?? "unknown",
    serverTime: new Date().toISOString(),
  });
}
