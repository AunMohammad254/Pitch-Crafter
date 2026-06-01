import { motion } from 'framer-motion';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-white/5 border border-white/10 ${className}`}
      {...props}
    />
  );
};

export const PitchCardSkeleton = () => {
  return (
    <div className="card-glass p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <Skeleton className="w-20 h-6 rounded-lg" />
      </div>
      <Skeleton className="w-3/4 h-8 mb-3" />
      <Skeleton className="w-full h-4 mb-2" />
      <Skeleton className="w-full h-4 mb-6" />
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
};

export const PitchDetailsSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="p-6 rounded-xl border border-white/10 bg-white/5">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-3 w-1/2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>

      {/* Problem/Solution Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>

      {/* Identity Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
};
