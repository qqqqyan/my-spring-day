export default function BoardDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header skeleton */}
      <header className="sticky top-0 z-30 shadow-md bg-slate-200 animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-slate-300" />
          <div className="h-6 w-32 rounded-lg bg-slate-300" />
        </div>
      </header>

      {/* Timeline skeleton */}
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0">
        <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative pl-8 sm:pl-12 animate-pulse">
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-slate-300" />
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 space-y-3">
                <div className="flex gap-4">
                  <div className="h-4 w-24 rounded bg-slate-200" />
                  <div className="h-4 w-16 rounded bg-slate-200" />
                </div>
                <div className="h-4 w-full rounded bg-slate-200" />
                <div className="h-4 w-4/5 rounded bg-slate-200" />
                <div className="h-4 w-3/5 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
