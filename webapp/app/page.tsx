'use client';

import { useState } from "react";

type ResultPayload = {
  clipId: number;
  containerId: string;
  mediaId: string;
  sourceUrl: string;
};

export default function Home() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ResultPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (line: string) =>
    setLog((prev) => [...prev, `${new Date().toISOString()} - ${line}`]);

  const triggerAutomation = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);
    setLog([]);

    try {
      addLog("Dispatching automation request…");
      const response = await fetch("/api/run-automation", {
        method: "POST",
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.message ?? "Automation failed");
      }

      addLog("Instagram upload completed.");
      setResult(payload.result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      addLog(`Error: ${message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-zinc-900 py-16 px-4 text-white">
      <div className="w-full max-w-3xl space-y-12">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Luxury Reel Automation
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Launch a daily workflow that sources a luxury lifestyle clip from
            Pexels and uploads it to Instagram automatically.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={triggerAutomation}
              disabled={isRunning}
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-base font-semibold text-black transition hover:bg-white/80 disabled:cursor-not-allowed disabled:bg-white/30"
            >
              {isRunning ? "Running…" : "Run Now"}
            </button>
            <div className="flex flex-1 flex-col justify-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/70">
              <span className="font-medium text-white/90">Environment</span>
              <p>
                Provide <code className="rounded bg-white/10 px-2 py-0.5">PEXELS_API_KEY</code>,{" "}
                <code className="rounded bg-white/10 px-2 py-0.5">IG_USER_ID</code>, and{" "}
                <code className="rounded bg-white/10 px-2 py-0.5">IG_ACCESS_TOKEN</code>{" "}
                as environment variables before deploying.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <h2 className="text-xl font-semibold text-white/90">Latest Result</h2>
            {result ? (
              <dl className="mt-4 space-y-2 text-sm text-white/80">
                <div>
                  <dt className="font-medium text-white/70">Pexels clip ID</dt>
                  <dd className="font-mono">{result.clipId}</dd>
                </div>
                <div>
                  <dt className="font-medium text-white/70">Instagram container</dt>
                  <dd className="font-mono break-all">{result.containerId}</dd>
                </div>
                <div>
                  <dt className="font-medium text-white/70">Published media</dt>
                  <dd className="font-mono break-all">{result.mediaId}</dd>
                </div>
                <div>
                  <dt className="font-medium text-white/70">Source URL</dt>
                  <dd>
                    <a
                      href={result.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-300 underline decoration-dotted"
                    >
                      View clip
                    </a>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-4 text-sm text-white/60">
                Trigger the automation to see the latest Instagram result summary.
              </p>
            )}
            {error && (
              <p className="mt-4 rounded-2xl bg-red-500/20 p-3 text-sm text-red-200">
                {error}
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <h2 className="text-xl font-semibold text-white/90">Activity Log</h2>
            <div className="mt-4 h-48 overflow-y-auto rounded-2xl bg-black/30 p-4 text-xs font-mono text-white/70">
              {log.length ? (
                <ul className="space-y-2">
                  {log.map((entry, index) => (
                    <li key={index}>{entry}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/50">Logs appear after each automation run.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
