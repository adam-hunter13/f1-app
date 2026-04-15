import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p
        className="font-display text-[12rem] font-900 italic leading-none opacity-10 select-none"
        style={{ color: "var(--team-secondary)" }}
      >
        404
      </p>
      <h1 className="font-display text-3xl font-900 italic uppercase -mt-12 mb-3">
        Page Not Found
      </h1>
      <p className="text-white/40 mb-8">This lap doesn't exist on the circuit.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded font-display font-700 uppercase tracking-widest text-sm transition-opacity hover:opacity-80"
        style={{ backgroundColor: "var(--team-secondary)", color: "var(--team-primary)" }}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
