export default function CategoriesLoading() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Skeleton - Left aligned like home page */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 bg-muted rounded w-48 mb-1 animate-pulse" />
            <div className="h-5 bg-muted rounded w-96 animate-pulse" />
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="max-w-md mb-8">
          <div className="h-10 bg-muted rounded animate-pulse" />
        </div>

        {/* Categories Section Skeleton */}
        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6">
              {/* Category Header */}
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                {/* Category Title Area */}
                <div className="bg-muted/20 p-6 border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                      <div>
                        <div className="h-6 bg-muted rounded w-32 mb-2 animate-pulse" />
                        <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                      </div>
                    </div>
                    <div className="h-8 bg-muted rounded w-20 animate-pulse" />
                  </div>
                  <div className="mt-4 h-4 bg-muted rounded w-64 animate-pulse" />
                </div>

                {/* Articles Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, articleIndex) => (
                      <div key={articleIndex} className="border rounded-xl overflow-hidden bg-card animate-pulse">
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
          ))}
        </div>
      </div>
    </div>
  )
}
