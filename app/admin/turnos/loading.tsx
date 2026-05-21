export default function TurnosLoading() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar placeholder — matches real sidebar dimensions */}
      <div
        className="fixed left-0 top-0 w-64 h-screen border-r border-white/5"
        style={{ background: 'linear-gradient(180deg, #0A2463 0%, #061840 100%)' }}
        aria-hidden="true"
      />

      <main className="flex-1 ml-64 overflow-auto p-8">
        <div style={{ maxWidth: '1400px' }}>
          {/* Header skeleton */}
          <div className="mb-8 space-y-2">
            <div className="h-8 w-32 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-4 w-56 bg-gray-200 rounded-xl animate-pulse" />
          </div>

          {/* Metric cards skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-white rounded-xl border border-gray-100 shadow-sm animate-pulse"
              />
            ))}
          </div>

          {/* Filter toolbar skeleton */}
          <div className="h-20 bg-white rounded-2xl border border-gray-100 shadow-sm animate-pulse mb-4" />

          {/* Table skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-12 bg-gray-50 border-b border-gray-100" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="px-5 py-4 border-b border-gray-50 flex gap-4 items-center">
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
