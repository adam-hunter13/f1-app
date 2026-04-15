"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="font-mono-f1 text-xs tracking-widest uppercase text-white/30 mb-4">
        API Error
      </p>
      <h2 className="font-display text-4xl font-900 italic uppercase text-white/60 mb-2">
        Something went wrong
      </h2>
      <p className="text-white/30 text-sm mb-8 max-w-md">
        Could not load data from the F1 API. This may be a temporary issue.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded font-display font-700 uppercase tracking-widest text-sm transition-opacity hover:opacity-80"
        style={{ backgroundColor: "var(--team-secondary)", color: "var(--team-primary)" }}
      >
        Try Again
      </button>
    </div>
  );
}
