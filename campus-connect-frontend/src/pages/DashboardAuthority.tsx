import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useIssues } from '../context/IssuesContext';
import Loader from '../components/ui/Loader';

interface StatCard {
  title: string;
  count: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}

const DashboardAuthority: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: issuesState, fetchIssues } = useIssues();
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    if (issuesState.issues.length > 0) {
      calculateStats();
    }
  }, [issuesState.issues]);

  const calculateStats = () => {
    const issues = issuesState.issues;
    
    const pendingCount = issues.filter(issue => issue.status === 'pending').length;
    const inProgressCount = issues.filter(issue => issue.status === 'in-progress').length;
    const resolvedCount = issues.filter(issue => issue.status === 'resolved').length;
    const totalCount = issues.length;

    const statsData: StatCard[] = [
      {
        title: 'Total Issues',
        count: totalCount,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      },
      {
        title: 'Pending',
        count: pendingCount,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      },
      {
        title: 'In Progress',
        count: inProgressCount,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      },
      {
        title: 'Resolved',
        count: resolvedCount,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      }
    ];

    setStats(statsData);
  };

  if (issuesState.isLoading && issuesState.issues.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Authority Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {authState.user?.name}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {authState.user?.department} Department
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/all-issues"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">View All Issues</h3>
                <p className="text-sm text-gray-600">Manage and track all reported issues</p>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-50 text-green-600 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View reports and statistics</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg mr-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Profile Settings</h3>
                <p className="text-sm text-gray-600">Update your profile information</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Issues</h2>
            <Link
              to="/all-issues"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          
          {issuesState.issues.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No issues reported yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issuesState.issues.slice(0, 5).map((issue) => (
                <div
                  key={issue.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Reported by {issue.reporterName} • {issue.reporterDepartment}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      issue.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {issue.status === 'in-progress' ? 'In Progress' : 
                       issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardAuthority;