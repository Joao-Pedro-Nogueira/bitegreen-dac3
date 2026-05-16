// ============================================================
// ByteGreen — Skeleton Loader (loading placeholder)
// ============================================================

export default function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-8 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded-lg bg-white/10" />
        <div className="h-10 w-36 rounded-lg bg-white/10" />
      </div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/5 p-6 space-y-4">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-10 w-40 rounded bg-white/10" />
            <div className="h-3 w-32 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="rounded-2xl bg-white/5 p-6">
        <div className="h-5 w-56 rounded bg-white/10 mb-6" />
        <div className="h-72 w-full rounded-xl bg-white/10" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl bg-white/5 p-6 space-y-3">
        <div className="h-5 w-48 rounded bg-white/10 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-full rounded bg-white/10" />
        ))}
      </div>
    </div>
  );
}
