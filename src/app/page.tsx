"use client";

import { useEffect, useState } from "react";

type StatusResponse = {
  ok: boolean;
  app: string;
  version: string;
  env: string;
  serverTime: string;
};

export default function Home() {
  // UI state
  const [statusText, setStatusText] = useState<string>("");
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<string>("");

  // “Money mode” state
  const [statusObj, setStatusObj] = useState<StatusResponse | null>(null);

  // Lead capture state
  const [email, setEmail] = useState<string>("");
  const [leadMsg, setLeadMsg] = useState<string>("");
  async function submitLead() {
    setLeadMsg("Submitting...");
  
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json().catch(() => ({} as any));
  
      if (res.ok && (data as any).ok) {
        setLeadMsg("You're on the waitlist 🚀");
        setEmail("");
      } else {
        setLeadMsg((data as any).error || "Something went wrong");
      }
    } catch {
      setLeadMsg("Network error. Try again.");
    }
  }
  
  
  
  async function checkHealth() {
    setStatusText("Checking...");
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data: StatusResponse = await res.json();
  
      setStatusObj(data);
      setStatusText(data.ok ? "Galaxy API route is alive" : "Galaxy API is offline");
      setIsOnline(Boolean(data.ok));
      setLastChecked(new Date().toLocaleTimeString());
    } catch {
      setStatusObj(null);
      setStatusText("Error: could not reach /api/health");
      setIsOnline(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  }

  

    setLeadMsg("Saving...");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setLeadMsg("Saved. You’re on the list.");
      setEmail("");
    } catch (e: any) {
      setLeadMsg(`Error: ${e?.message ?? "Could not save"}`);
    }
  }

  useEffect(() => {
    checkHealth();
  }, []);
  

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Galaxy background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/galaxy.png)" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-8">
        <div className="mb-3 text-xs tracking-[0.35em] text-emerald-300/70">
          DIGGA GALAXY
        </div>

        <h1 className="text-5xl font-semibold leading-[1.05] md:text-7xl">
          Hello Digga Galaxy
        </h1>

        <p className="mt-6 max-w-2xl text-base text-white/80 md:text-lg">
          Front-end is live. Next step: connect to the Galaxy API and show live status.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90">
            Enter
          </button>

          <button
            onClick={checkHealth}
            className="rounded-full border border-white/25 px-6 py-3 text-sm font-medium text-white hover:border-white/50"
          >
            Status
          </button>

          {statusText ? (
            <div className="flex items-center gap-3 text-sm text-white/80">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  isOnline === null ? "bg-white/40" : isOnline ? "bg-emerald-400" : "bg-red-400"
                }`}
                title={isOnline === null ? "Unknown" : isOnline ? "Online" : "Offline"}
              />
              <span>{statusText}</span>
              {lastChecked ? <span className="text-white/50">({lastChecked})</span> : null}
            </div>
          ) : null}
        </div>

        {/* MONEY MODE */}
        <div className="mt-10 text-xs tracking-[0.25em] text-emerald-300/70">
          MONEY MODE
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            onClick={loadStatus}
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-300"
          >
            Refresh Status
          </button>

          {statusObj ? (
            <div className="rounded-2xl border border-white/15 bg-black/40 p-4 text-sm text-white/85">
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                <div>
                  <span className="text-white/50">app:</span> {statusObj.app}
                </div>
                <div>
                  <span className="text-white/50">env:</span> {statusObj.env}
                </div>
                <div>
                  <span className="text-white/50">version:</span> {statusObj.version}
                </div>
                <div>
                  <span className="text-white/50">server:</span> {statusObj.serverTime}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Lead capture */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-64 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white outline-none placeholder:text-white/40"
          />
          <button
            onClick={submitLead}
            className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-medium text-black hover:bg-emerald-300"
          >
            Join
          </button>
          {leadMsg ? <div className="text-sm text-white/80">{leadMsg}</div> : null}
        </div>
      </main>
    </div>
  );
}
