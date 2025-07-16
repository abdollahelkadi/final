export default function CategoryLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>

        {/* Category Header Skeleton */}
        <div className="mb-8">
          <div className="h-64 bg-muted rounded-xl mb-6 animate-pulse" />
          <div className="text-center space-y-4">
            <div className="h-10 bg-muted rounded w-64 mx-auto animate-pulse" />
            <div className="h-6 bg-muted rounded w-96 mx-auto animate-pulse" />
            <div className="flex items-center justify-center space-x-6">
              <div className="h-5 bg-muted rounded w-24 animate-pulse" />
              <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Articles Section Skeleton */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="h-8 bg-muted rounded w-48 mx-auto animate-pulse" />
            <div className="h-5 bg-muted rounded w-64 mx-auto animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-xl overflow-hidden bg-card animate-pulse">
                <div className="aspect-[16/10] bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-5/6" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <div className="h-3 w-1/4 bg-muted rounded" />
                    <div className="h-3 w-1/6 bg-muted rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
