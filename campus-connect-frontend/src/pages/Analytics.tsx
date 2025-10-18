import React, { useEffect, useState } from 'react';
import { useIssues } from '../context/IssuesContext';
import Loader from '../components/ui/Loader';
import type { IssueCategory, IssueStatus } from '../types';

interface CategoryStats {
  category: IssueCategory;
  count: number;
  percentage: number;
  color: string;
}

interface StatusStats {
  status: IssueStatus;
  count: number;
  percentage: number;
  color: string;
}

interface DepartmentStats {
  department: string;
  count: number;
  resolved: number;
  resolutionRate: number;
}

const Analytics: React.FC = () => {
  const { state: issuesState, fetchIssues } = useIssues();
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    if (issuesState.issues.length > 0) {
      calculateAnalytics();
    }
  }, [issuesState.issues, timeRange]);

  const filterIssuesByTimeRange = () => {
    if (timeRange === 'all') return issuesState.issues;
    
    const now = new Date();
    const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return issuesState.issues.filter(issue => new Date(issue.createdAt) >= cutoffDate);
  };

  const calculateAnalytics = () => {
    const filteredIssues = filterIssuesByTimeRange();
    const totalIssues = filteredIssues.length;

    if (totalIssues === 0) {
      setCategoryStats([]);
      setStatusStats([]);
      setDepartmentStats([]);
      return;
    }

    // Category Statistics
    const categoryColors = {
      maintenance: '#f59e0b',
      canteen: '#10b981',
      classroom: '#3b82f6',
      hostel: '#8b5cf6',
      transport: '#6366f1',
      other: '#6b7280'
    };

    const categoryCounts = filteredIssues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<IssueCategory, number>);

    const categoryStatsData: CategoryStats[] = Object.entries(categoryCounts).map(([category, count]) => ({
      category: category as IssueCategory,
      count,
      percentage: (count / totalIssues) * 100,
      color: categoryColors[category as IssueCategory]
    })).sort((a, b) => b.count - a.count);

    setCategoryStats(categoryStatsData);

    // Status Statistics
    const statusColors = {
      pending: '#f59e0b',
      'in-progress': '#f97316',
      resolved: '#10b981'
    };

    const statusCounts = filteredIssues.reduce((acc, issue) => {
      acc[issue.status] = (acc[issue.status] || 0) + 1;
      return acc;
    }, {} as Record<IssueStatus, number>);

    const statusStatsData: StatusStats[] = Object.entries(statusCounts).map(([status, count]) => ({
      status: status as IssueStatus,
      count,
      percentage: (count / totalIssues) * 100,
      color: statusColors[status as IssueStatus]
    }));

    setStatusStats(statusStatsData);

    // Department Statistics
    const departmentCounts = filteredIssues.reduce((acc, issue) => {
      if (!acc[issue.reporterDepartment]) {
        acc[issue.reporterDepartment] = { total: 0, resolved: 0 };
      }
      acc[issue.reporterDepartment].total++;
      if (issue.status === 'resolved') {
        acc[issue.reporterDepartment].resolved++;
      }
      return acc;
    }, {} as Record<string, { total: number; resolved: number }>);

    const departmentStatsData: DepartmentStats[] = Object.entries(departmentCounts)
      .map(([department, stats]) => ({
        department,
        count: stats.total,
        resolved: stats.resolved,
        resolutionRate: stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);

    setDepartmentStats(departmentStatsData);
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      case 'all': return 'All time';
    }
  };

  if (issuesState.isLoading && issuesState.issues.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" text="Loading analytics..." />
      </div>
    );
  }

  const filteredIssues = filterIssuesByTimeRange();
  const totalIssues = filteredIssues.length;
  const resolvedIssues = filteredIssues.filter(issue => issue.status === 'resolved').length;
  const overallResolutionRate = totalIssues > 0 ? (resolvedIssues / totalIssues) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Issue reports and resolution statistics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Issues</p>
                <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
                <p className="text-xs text-gray-500">{getTimeRangeLabel()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedIssues}</p>
                <p className="text-xs text-gray-500">{overallResolutionRate.toFixed(1)}% resolution rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredIssues.filter(issue => issue.status === 'in-progress').length}
                </p>
                <p className="text-xs text-gray-500">Active issues</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredIssues.filter(issue => issue.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-500">Awaiting action</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Issues by Category Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Issues by Category</h2>
            {categoryStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data available for the selected time range
              </div>
            ) : (
              <div className="space-y-4">
                {categoryStats.map((stat) => (
                  <div key={stat.category} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {stat.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {stat.count} ({stat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h2>
            {statusStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data available for the selected time range
              </div>
            ) : (
              <div className="space-y-4">
                {statusStats.map((stat) => (
                  <div key={stat.status} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {stat.status === 'in-progress' ? 'In Progress' : stat.status}
                        </span>
                        <span className="text-sm text-gray-600">
                          {stat.count} ({stat.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${stat.percentage}%`,
                            backgroundColor: stat.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Department Statistics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Statistics</h2>
          {departmentStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available for the selected time range
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Issues
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolved
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resolution Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentStats.map((dept) => (
                    <tr key={dept.department} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.resolved}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dept.resolutionRate.toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              dept.resolutionRate >= 80 ? 'bg-green-500' :
                              dept.resolutionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${dept.resolutionRate}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Error Display */}
        {issuesState.error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{issuesState.error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;