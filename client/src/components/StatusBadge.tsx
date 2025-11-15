import React from 'react';
import type { IssueStatus } from '@/types';

interface StatusBadgeProps {
  status: IssueStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  className = '' 
}) => {
  const getStatusStyles = (status: IssueStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getStatusText = (status: IssueStatus) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const statusStyles = getStatusStyles(status);
  const sizeStyles = getSizeStyles(size);

  return (
    <span
      className={`
        inline-flex items-center font-semibold rounded-full border status-indicator status-${status}
        transition-all duration-200 hover:scale-105 hover:shadow-md
        ${statusStyles} ${sizeStyles} ${className}
      `.trim()}
      role="status"
      aria-label={`Issue status: ${getStatusText(status)}`}
    >
      <span className="sr-only">Status: </span>
      <span className="relative z-10">{getStatusText(status)}</span>
    </span>
  );
};

export default StatusBadge;
