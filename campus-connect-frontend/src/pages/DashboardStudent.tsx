import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import Loader from '../components/ui/Loader';
import StatusBadge from '../components/ui/StatusBadge';
import type { Issue } from '../types';

const DashboardStudent: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: issuesState, fetchMyIssues } = useIssues();
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);

  useEffect(() => {
    if (authState.user) {
      fetchMyIssues(authState.user.id);
    }
  }, [authState.user, fetchMyIssues]);

  useEffect(() => {
    // Get the 3 most recent issues for the activity feed
    const sortedIssues = [...issuesState.myIssues]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    setRecentIssues(sortedIssues);
  }, [issuesState.myIssues]);

  const getIssueStats = () => {
    const total = issuesState.myIssues.length;
    const pending = issuesState.myIssues.filter(issue => issue.status === 'pending').length;
    const inProgress = issuesState.myIssues.filter(issue => issue.status === 'in-progress').length;
    const resolved = issuesState.myIssues.filter(issue => issue.status === 'resolved').length;
    
    return { total, pending, inProgress, resolved };
  };

  const stats = getIssueStats();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (issuesState.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                Welcome back, {authState.user?.name}!
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base break-words">
                {authState.user?.department} • {authState.user?.role}
              </p>
            </div>
            <Link
              to="/report-issue"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 text-center min-h-[2.5rem] touch-manipulation"
            >
              Report New Issue
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8">
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Issues</p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Pending</p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">In Progress</p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-2 sm:ml-3 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">Resolved</p>
                    <p className="text-lg sm:text-2xl font-semibold text-gray-900">{stats.resolved}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                {recentIssues.length > 0 ? (
                  <div className="space-y-4">
                    {recentIssues.map((issue) => (
                      <div key={issue.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {issue.title}
                            </p>
                            <StatusBadge status={issue.status} size="sm" />
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {issue.category} • {formatDate(issue.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm">No issues reported yet</p>
                    <Link
                      to="/report-issue"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 inline-block"
                    >
                      Report your first issue
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2 sm:space-y-3">
                <Link
                  to="/report-issue"
                  className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors min-h-[2.5rem] touch-manipulation"
                >
                  <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="truncate">Report New Issue</span>
                </Link>
                <Link
                  to="/my-issues"
                  className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors min-h-[2.5rem] touch-manipulation"
                >
                  <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="truncate">View My Issues</span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center p-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 transition-colors min-h-[2.5rem] touch-manipulation"
                >
                  <svg className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="truncate">Edit Profile</span>
                </Link>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Help & Support</h3>
              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Need help reporting an issue?</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Be specific in your description</li>
                    <li>• Include photos when possible</li>
                    <li>• Select the correct category</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    For urgent issues, contact campus security directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStudent;