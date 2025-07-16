export default function CategoryLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <div className="h-10 bg-muted rounded w-32 animate-pul
          
          
          se" />
        </div>

        {/* Category Header Skeleton */}
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-8 animate-pulse">
          {/* Cover Image */}
          <div className="aspect-video bg-muted w-full" />
          
          {/* Title and Description */}
          <div className="p-6 text-center">
            <div className="h-10 bg-muted rounded w-64 mx-auto mb-4 animate-pulse" />
            <div className="h-6 bg-muted rounded w-3/4 max-w-xl mx-auto mb-6 animate-pulse" />
            <div className="flex items-center justify-center space-x-6">
              <div className="h-5 bg-muted rounded w-24 animate-pulse" />
              <div className="h-5 bg-muted rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Articles Section Skeleton */}
        <div className="bg-card rounded-xl border border-border overflow-hidden animate-pulse">
          <div className="p-6 border-b border-border">
            <div className="h-8 bg-muted rounded w-48 mx-auto animate-pulse" />
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-xl overflow-hidden bg-background animate-pulse">
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
    </div>
  )
}
