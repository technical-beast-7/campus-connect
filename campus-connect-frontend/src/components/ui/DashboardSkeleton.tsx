import React from 'react';
import SkeletonLoader from './SkeletonLoader';

const DashboardSkeleton: React.FC = () => {
  return (
    <div className="p-6">
      {/* Page title */}
      <div className="mb-6">
        <SkeletonLoader variant="text" className="w-48 h-8 mb-2" />
        <SkeletonLoader variant="text" className="w-64 h-4" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <SkeletonLoader variant="text" className="w-20 h-4 mb-2" />
                <SkeletonLoader variant="text" className="w-12 h-8" />
              </div>
              <SkeletonLoader variant="circular" width={40} height={40} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <SkeletonLoader variant="text" className="w-40 h-6 mb-4" />
        
        {/* Activity items */}
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
            <SkeletonLoader variant="circular" width={32} height={32} className="mr-3" />
            <div className="flex-1">
              <SkeletonLoader variant="text" className="w-3/4 h-4 mb-1" />
              <SkeletonLoader variant="text" className="w-1/2 h-3" />
            </div>
            <SkeletonLoader variant="text" className="w-16 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;