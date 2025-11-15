import React, { useState } from 'react';
import type { Issue, IssueStatus, User } from '@/types';
import StatusBadge from '@components/StatusBadge';
import { getFullImageUrl } from '@utils/helpers';

interface IssueCardProps {
  issue: Issue;
  currentUser: User;
  onStatusChange?: (issueId: string, newStatus: IssueStatus) => void;
  onAddComment?: (issueId: string, comment: string) => void;
  className?: string;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  currentUser,
  onStatusChange,
  onAddComment,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const isAuthority = currentUser.role === 'authority';
  const isOwner = currentUser.id === issue.reporterId;

  const handleStatusChange = async (newStatus: IssueStatus) => {
    if (onStatusChange) {
      try {
        await onStatusChange(issue.id, newStatus);
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !onAddComment) return;
    
    setIsSubmittingComment(true);
    try {
      await onAddComment(issue.id, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      maintenance: 'text-orange-600 bg-orange-50',
      canteen: 'text-green-600 bg-green-50',
      classroom: 'text-blue-600 bg-blue-50',
      hostel: 'text-purple-600 bg-purple-50',
      transport: 'text-indigo-600 bg-indigo-50',
      other: 'text-gray-600 bg-gray-50'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  return (
    <div className={`bg-white rounded-xl shadow-soft border border-gray-200 p-4 sm:p-6 transition-all duration-300 hover:shadow-strong hover:border-primary-200 hover:-translate-y-1 animate-fade-in-up ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
            {issue.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(issue.category)}`}>
              {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
            </span>
            <StatusBadge status={issue.status} size="sm" />
          </div>
        </div>
        
        {/* Authority Actions */}
        {isAuthority && onStatusChange && (
          <div className="flex flex-col sm:ml-4 space-y-2 w-full sm:w-auto">
            <select
              value={issue.status}
              onChange={(e) => handleStatusChange(e.target.value as IssueStatus)}
              className="text-sm border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-full sm:w-auto min-h-[2.75rem] touch-manipulation transition-all duration-200 hover:border-gray-300 bg-white"
              aria-label="Change issue status"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <div className="text-xs text-gray-500 text-center sm:text-right">
              ID: {issue.id}
            </div>
          </div>
        )}
      </div>

      {/* Reporter Info (for authorities) */}
      {isAuthority && (
        <div className="bg-gray-50 rounded-md p-3 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="min-w-0">
              <div className="text-sm text-gray-600 break-words">
                <span className="font-medium">Reported by:</span> {issue.reporterName}
              </div>
              <div className="text-sm text-gray-500 break-words">
                Department: {issue.reporterDepartment}
              </div>
            </div>
            <div className="text-left sm:text-right flex-shrink-0">
              <div className="text-xs text-gray-500">Reporter ID</div>
              <div className="text-sm font-mono text-gray-700 break-all">{issue.reporterId}</div>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div className="mb-4">
        <p className={`text-gray-700 ${isExpanded ? '' : 'line-clamp-3'}`}>
          {issue.description}
        </p>
        {issue.description.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 transition-all duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded px-1"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Image Preview */}
      {issue.imageUrl && (
        <div className="mb-4">
          <img
            src={getFullImageUrl(issue.imageUrl)}
            alt="Issue attachment"
            className="w-full h-32 sm:h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 hover:shadow-md"
            onClick={() => window.open(getFullImageUrl(issue.imageUrl), '_blank')}
          />
        </div>
      )}

      {/* Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 space-y-2 sm:space-y-0">
        <div className="flex flex-col xs:flex-row xs:items-center space-y-1 xs:space-y-0 xs:space-x-4">
          <span className="text-xs sm:text-sm">Created: {formatDate(issue.createdAt)}</span>
          {issue.updatedAt.getTime() !== issue.createdAt.getTime() && (
            <span className="text-xs sm:text-sm">Updated: {formatDate(issue.updatedAt)}</span>
          )}
        </div>
        {isAuthority && (
          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {issue.comments.length} comment{issue.comments.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 mb-3 keyboard-nav transition-all duration-200 hover:bg-gray-50 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-expanded={showComments}
          aria-controls={`comments-${issue.id}`}
          aria-label={`${showComments ? 'Hide' : 'Show'} ${issue.comments.length} comments for issue: ${issue.title}`}
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
          Comments ({issue.comments.length})
          <svg className={`w-4 h-4 ml-1 transform transition-transform dropdown-indicator ${showComments ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showComments && (
          <div className="space-y-3" id={`comments-${issue.id}`} role="region" aria-label="Comments section">
            {/* Existing Comments */}
            {issue.comments.length === 0 ? (
              <div className="text-center py-4 text-gray-500 text-sm">
                No comments yet. {isAuthority ? 'Be the first to respond!' : 'Authority will respond soon.'}
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {issue.comments.map((comment) => (
                  <div key={comment.id} className={`rounded-md p-3 ${
                    comment.authorRole === 'authority' ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            {comment.authorName}
                          </span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            comment.authorRole === 'authority' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {comment.authorRole}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 ml-8">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment (for authorities or issue owners) */}
            {(isAuthority || isOwner) && onAddComment && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3">
                  <div className="flex-shrink-0 self-start">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={isAuthority ? "Add an official response..." : "Add a comment..."}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm resize-none min-h-[3rem] touch-manipulation input-mobile transition-all duration-200 hover:border-gray-300"
                      rows={3}
                      aria-label={isAuthority ? "Add an official response to this issue" : "Add a comment to this issue"}
                      aria-describedby={`comment-help-${issue.id}`}
                    />
                    <div id={`comment-help-${issue.id}`} className="sr-only">
                      {isAuthority ? "Your response will be visible to the issue reporter and other authorities" : "Your comment will be visible to authorities handling this issue"}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 space-y-2 sm:space-y-0">
                      <div className="text-xs text-gray-500 break-words">
                        Commenting as {currentUser.name} ({currentUser.role})
                      </div>
                      <div className="flex space-x-2 justify-end">
                        {newComment.trim() && (
                          <button
                            onClick={() => setNewComment('')}
                            className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800 min-h-[2rem] touch-manipulation"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          onClick={handleAddComment}
                          disabled={!newComment.trim() || isSubmittingComment}
                          className="px-6 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[2.5rem] touch-manipulation keyboard-nav transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm hover:shadow-md"
                          aria-label={isSubmittingComment ? 'Adding comment...' : (isAuthority ? 'Post official response' : 'Add comment')}
                          aria-describedby={isSubmittingComment ? `loading-${issue.id}` : undefined}
                        >
                          {isSubmittingComment ? (
                            <>
                              <span aria-hidden="true">Adding...</span>
                              <span id={`loading-${issue.id}`} className="sr-only">Please wait, your comment is being added</span>
                            </>
                          ) : (
                            isAuthority ? 'Post Response' : 'Add Comment'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCard;
