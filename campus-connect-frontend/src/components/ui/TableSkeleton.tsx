import React from 'react';
import SkeletonLoader from './SkeletonLoader';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: columns }).map((_, index) => (
            <SkeletonLoader
              key={index}
              variant="text"
              className="h-4 w-20"
            />
          ))}
        </div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex}>
                  {colIndex === 0 ? (
                    // First column - title-like content
                    <SkeletonLoader variant="text" className="w-32 h-4" />
                  ) : colIndex === columns - 1 ? (
                    // Last column - action buttons
                    <div className="flex gap-2">
                      <SkeletonLoader variant="rectangular" className="w-16 h-6 rounded" />
                      <SkeletonLoader variant="rectangular" className="w-16 h-6 rounded" />
                    </div>
                  ) : (
                    // Middle columns - various content
                    <SkeletonLoader 
                      variant="text" 
                      className={colIndex === 1 ? "w-20 h-4" : "w-24 h-4"} 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;