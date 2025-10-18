import React, { useEffect } from 'react';
import { useIssues } from '../../context/IssuesContext';
import type { IssueStatus, IssueCategory } from '../../types';

/**
 * Example component demonstrating how to use the IssuesContext
 * This shows all the available functionality including:
 * - Fetching issues
 * - Creating new issues
 * - Updating issue status
 * - Adding comments
 * - Filtering and sorting
 */
const IssuesContextExample: React.FC = () => {
  const {
    state,
    fetchIssues,
    fetchMyIssues,
    createIssue,
    updateIssueStatus,
    addComment,
    setFilters,
    clearError,
    getFilteredIssues,
  } = useIssues();

  useEffect(() => {
    // Fetch all issues when component mounts
    fetchIssues();
  }, []);

  const handleCreateIssue = async () => {
    await createIssue({
      title: 'Test Issue from Context',
      description: 'This is a test issue created using the IssuesContext',
      category: 'maintenance' as IssueCategory,
    });
  };

  const handleUpdateStatus = async (issueId: string) => {
    await updateIssueStatus(issueId, 'in-progress' as IssueStatus);
  };

  const handleAddComment = async (issueId: string) => {
    await addComment(issueId, 'This is a test comment from the context example');
  };

  const handleFilterByCategory = (category: IssueCategory) => {
    setFilters({ category });
  };

  const handleFilterByStatus = (status: IssueStatus) => {
    setFilters({ status });
  };

  const handleSearch = (searchTerm: string) => {
    setFilters({ search: searchTerm });
  };

  const handleClearFilters = () => {
    setFilters({
      category: undefined,
      status: undefined,
      department: undefined,
      search: undefined,
    });
  };

  const filteredIssues = getFilteredIssues();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Issues Context Example</h1>
      
      {/* Loading State */}
      {state.isLoading && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Loading...
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {state.error}
          <button 
            onClick={clearError}
            className="ml-2 underline hover:no-underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6 space-y-2">
        <h2 className="text-lg font-semibold">Actions</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateIssue}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Test Issue
          </button>
          <button
            onClick={() => fetchMyIssues('1')}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Fetch My Issues
          </button>
          <button
            onClick={fetchIssues}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Refresh All Issues
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-2">
        <h2 className="text-lg font-semibold">Filters</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterByCategory('maintenance')}
            className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
          >
            Maintenance
          </button>
          <button
            onClick={() => handleFilterByCategory('canteen')}
            className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded"
          >
            Canteen
          </button>
          <button
            onClick={() => handleFilterByStatus('pending')}
            className="bg-yellow-500 hover:bg-yellow-700 text-white py-1 px-3 rounded"
          >
            Pending
          </button>
          <button
            onClick={() => handleFilterByStatus('in-progress')}
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
          >
            In Progress
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded"
          >
            Clear Filters
          </button>
        </div>
        <input
          type="text"
          placeholder="Search issues..."
          onChange={(e) => handleSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
        />
      </div>

      {/* Current Filters Display */}
      <div className="mb-4">
        <h3 className="font-semibold">Active Filters:</h3>
        <pre className="bg-gray-100 p-2 rounded text-sm">
          {JSON.stringify(state.filters, null, 2)}
        </pre>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          Issues ({filteredIssues.length} of {state.issues.length})
        </h2>
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="border border-gray-300 rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{issue.title}</h3>
              <span className={`px-2 py-1 rounded text-sm ${
                issue.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                issue.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                'bg-green-200 text-green-800'
              }`}>
                {issue.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{issue.description}</p>
            <div className="text-sm text-gray-500 mb-2">
              Category: {issue.category} | Reporter: {issue.reporterName} ({issue.reporterDepartment})
            </div>
            <div className="text-sm text-gray-500 mb-3">
              Created: {issue.createdAt.toLocaleDateString()} | 
              Comments: {issue.comments.length}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateStatus(issue.id)}
                className="bg-orange-500 hover:bg-orange-700 text-white py-1 px-3 rounded text-sm"
              >
                Update Status
              </button>
              <button
                onClick={() => handleAddComment(issue.id)}
                className="bg-indigo-500 hover:bg-indigo-700 text-white py-1 px-3 rounded text-sm"
              >
                Add Comment
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* My Issues Section */}
      {state.myIssues.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">My Issues ({state.myIssues.length})</h2>
          <div className="space-y-2">
            {state.myIssues.map((issue) => (
              <div key={issue.id} className="border border-gray-200 rounded p-3 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{issue.title}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    issue.status === 'pending' ? 'bg-yellow-200 text-yellow-800' :
                    issue.status === 'in-progress' ? 'bg-blue-200 text-blue-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {issue.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IssuesContextExample;