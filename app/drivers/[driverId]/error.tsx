"use client";

export default function DriverError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
      <p className="font-display font-900 italic uppercase text-2xl text-white/60">
        Failed to load driver
      </p>
      <p className="text-white/30 text-sm font-body">The F1 API may be rate-limited. Try again in a moment.</p>
      <button
        onClick={reset}
        className="mt-2 px-5 py-2 rounded-lg text-sm font-display font-800 uppercase tracking-wide"
        style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" }}
      >
        Retry
      </button>
    </div>
  );
}
