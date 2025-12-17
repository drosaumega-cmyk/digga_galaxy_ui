import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const email = String(body?.email || "").trim().toLowerCase();
    const source = String(body?.source || "digga-galaxy-ui");
    const userAgent = req.headers.get("user-agent") || "";

    if (!email.includes("@") || email.length < 6) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    // 1) Read webhook from .env.local
    const webhook = process.env.GALAXY_SHEETS_WEBHOOK_URL;
    if (!webhook) {
      return NextResponse.json(
        { ok: false, error: "Missing GALAXY_SHEETS_WEBHOOK_URL in .env.local" },
        { status: 500 }
      );
    }

    // 2) Forward lead to Google Apps Script
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source, userAgent }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        { ok: false, error: "Sheets webhook failed", status: res.status, detail: text },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, saved: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
}
