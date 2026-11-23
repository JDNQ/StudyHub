export default function AppLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-40 w-full rounded-2xl bg-surface-container-high/60" />

      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-surface-container-low p-4 shadow-sm"
          >
            <div className="h-4 w-20 rounded bg-surface-container-highest" />
            <div className="mt-3 h-8 w-16 rounded bg-surface-container-high" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="h-80 rounded-2xl bg-surface-container-low p-6 shadow-sm xl:col-span-7">
          <div className="h-6 w-36 rounded bg-surface-container-highest" />
          <div className="mt-6 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-full rounded-xl bg-surface-container-high/40"
              />
            ))}
          </div>
        </div>

        <div className="h-80 rounded-2xl bg-surface-container-low p-6 shadow-sm xl:col-span-5">
          <div className="h-6 w-44 rounded bg-surface-container-highest" />
          <div className="mt-6 flex flex-col gap-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 w-full rounded-xl bg-surface-container-high/40"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
