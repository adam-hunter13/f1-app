export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="shimmer h-36 rounded-xl" />
        <div className="shimmer h-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="shimmer h-8 w-48 rounded-lg mb-4" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="shimmer h-16 rounded-xl" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="shimmer h-8 w-48 rounded-lg mb-4" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="shimmer h-16 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
