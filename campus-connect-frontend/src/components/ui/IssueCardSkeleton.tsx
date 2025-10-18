import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface IssueCardSkeletonProps {
  count?: number;
}

const IssueCardSkeleton: React.FC<IssueCardSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4"
        >
          {/* Header with title and status */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <SkeletonLoader variant="text" className="w-3/4 h-6 mb-2" />
              <SkeletonLoader variant="text" className="w-1/2 h-4" />
            </div>
            <SkeletonLoader variant="rectangular" className="w-20 h-6 rounded-full" />
          </div>

          {/* Description */}
          <div className="mb-4">
            <SkeletonLoader variant="text" lines={3} />
          </div>

          {/* Meta information */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
            <SkeletonLoader variant="text" className="w-32 h-4" />
            <SkeletonLoader variant="text" className="w-24 h-4" />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <SkeletonLoader variant="rectangular" className="w-24 h-8 rounded" />
            <SkeletonLoader variant="rectangular" className="w-20 h-8 rounded" />
          </div>
        </div>
      ))}
    </>
  );
};

export default IssueCardSkeleton;