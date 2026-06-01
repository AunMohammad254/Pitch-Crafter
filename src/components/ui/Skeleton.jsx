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
