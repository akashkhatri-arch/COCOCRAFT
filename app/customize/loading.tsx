import { Skeleton } from "@/components/ui/LoadingStates";
import { Header } from "@/components/layout/Header";

export default function CustomizeLoading() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-cream-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-8">
            {/* Left controls skeleton */}
            <div className="space-y-6">
              {/* Progress */}
              <Skeleton className="h-24 w-full rounded-2xl" />
              {/* Step content */}
              <div className="bg-white rounded-2xl border border-cream-200 p-6 space-y-5">
                <Skeleton variant="text" className="w-2/5 h-7" />
                <Skeleton variant="text" className="w-3/5 h-4" />
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-40 rounded-2xl" />
                  ))}
                </div>
                <div className="flex justify-between pt-6 border-t border-cream-100">
                  <Skeleton className="h-10 w-24 rounded-full" />
                  <Skeleton className="h-10 w-32 rounded-full" />
                </div>
              </div>
            </div>
            {/* Right preview skeleton */}
            <div className="hidden md:flex flex-col gap-5">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-56 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
