import type { Issue, IssueCategory, IssueStatus, IssueFilters, Comment } from '../types';

// Mock data for development
const mockDepartments = [
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Mathematics',
  'Physics',
  'Chemistry',
];

const mockUsers = [
  { id: '1', name: 'John Doe', department: 'Computer Science', role: 'student' },
  { id: '2', name: 'Jane Smith', department: 'Electrical Engineering', role: 'faculty' },
  { id: '3', name: 'Mike Johnson', department: 'Mechanical Engineering', role: 'student' },
  { id: '4', name: 'Sarah Wilson', department: 'Civil Engineering', role: 'authority' },
  { id: '5', name: 'David Brown', department: 'Business Administration', role: 'student' },
];

const mockComments: Comment[] = [
  {
    id: 'c1',
    issueId: '1',
    authorId: '4',
    authorName: 'Sarah Wilson',
    authorRole: 'authority',
    content: 'We have received your report and are investigating the issue.',
    createdAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: 'c2',
    issueId: '1',
    authorId: '4',
    authorName: 'Sarah Wilson',
    authorRole: 'authority',
    content: 'The maintenance team has been notified and will fix this by tomorrow.',
    createdAt: new Date('2024-01-15T14:20:00Z'),
  },
];

// Generate mock issues for development
export const generateMockIssues = (count: number = 20): Issue[] => {
  const categories: IssueCategory[] = ['maintenance', 'canteen', 'classroom', 'hostel', 'transport', 'other'];
  const statuses: IssueStatus[] = ['pending', 'in-progress', 'resolved'];
  
  const sampleTitles = [
    'Broken projector in classroom',
    'Air conditioning not working',
    'Leaking pipe in hostel bathroom',
    'Poor food quality in canteen',
    'WiFi connectivity issues',
    'Damaged furniture in library',
    'Parking space shortage',
    'Elevator out of order',
    'Dirty washrooms',
    'Insufficient lighting in corridor',
    'Noisy construction work',
    'Overflowing garbage bins',
    'Faulty electrical outlets',
    'Cracked walls in dormitory',
    'Slow internet connection',
  ];

  const sampleDescriptions = [
    'The issue has been persisting for several days and needs immediate attention.',
    'This problem is affecting multiple students and faculty members.',
    'The situation is getting worse and requires urgent maintenance.',
    'Students are facing difficulties due to this ongoing issue.',
    'This needs to be resolved as soon as possible for safety reasons.',
    'The problem is impacting daily activities and learning environment.',
    'Multiple complaints have been received regarding this matter.',
    'This issue is causing inconvenience to the entire department.',
  ];

  return Array.from({ length: count }, (_, index) => {
    const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)];
    const description = sampleDescriptions[Math.floor(Math.random() * sampleDescriptions.length)];
    
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));
    
    const updatedDate = new Date(createdDate);
    updatedDate.setHours(updatedDate.getHours() + Math.floor(Math.random() * 48));

    const issueComments = mockComments.filter(comment => comment.issueId === (index + 1).toString());

    return {
      id: (index + 1).toString(),
      title: `${title} - ${category}`,
      description,
      category,
      status,
      reporterId: randomUser.id,
      reporterName: randomUser.name,
      reporterDepartment: randomUser.department,
      imageUrl: Math.random() > 0.7 ? `https://picsum.photos/400/300?random=${index}` : undefined,
      comments: issueComments,
      createdAt: createdDate,
      updatedAt: updatedDate,
    };
  });
};

// Filter issues based on provided filters
export const filterIssues = (issues: Issue[], filters: IssueFilters): Issue[] => {
  return issues.filter(issue => {
    // Filter by category
    if (filters.category && issue.category !== filters.category) {
      return false;
    }

    // Filter by status
    if (filters.status && issue.status !== filters.status) {
      return false;
    }

    // Filter by department
    if (filters.department && issue.reporterDepartment !== filters.department) {
      return false;
    }

    // Filter by search term (title and description)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const titleMatch = issue.title.toLowerCase().includes(searchTerm);
      const descriptionMatch = issue.description.toLowerCase().includes(searchTerm);
      const reporterMatch = issue.reporterName.toLowerCase().includes(searchTerm);
      
      if (!titleMatch && !descriptionMatch && !reporterMatch) {
        return false;
      }
    }

    return true;
  });
};

// Sort issues based on different criteria
export const sortIssues = (issues: Issue[], sortBy: 'date' | 'status' | 'category' = 'date', order: 'asc' | 'desc' = 'desc'): Issue[] => {
  return [...issues].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'status':
        const statusOrder = { 'pending': 0, 'in-progress': 1, 'resolved': 2 };
        comparison = statusOrder[a.status] - statusOrder[b.status];
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });
};

// Get issues for a specific user
export const getUserIssues = (issues: Issue[], userId: string): Issue[] => {
  return issues.filter(issue => issue.reporterId === userId);
};

// Create a new issue with mock data
export const createMockIssue = (issueData: any, userId: string): Issue => {
  const user = mockUsers.find(u => u.id === userId) || mockUsers[0];
  const now = new Date();

  return {
    id: Date.now().toString(), // Simple ID generation for mock
    title: issueData.title,
    description: issueData.description,
    category: issueData.category,
    status: 'pending' as IssueStatus,
    reporterId: userId,
    reporterName: user.name,
    reporterDepartment: user.department,
    imageUrl: issueData.imageFile ? URL.createObjectURL(issueData.imageFile) : undefined,
    comments: [],
    createdAt: now,
    updatedAt: now,
  };
};

// Update issue status
export const updateMockIssueStatus = (issue: Issue, newStatus: IssueStatus): Issue => {
  return {
    ...issue,
    status: newStatus,
    updatedAt: new Date(),
  };
};

// Add comment to issue
export const addMockComment = (issueId: string, content: string, authorId: string): Comment => {
  const author = mockUsers.find(u => u.id === authorId) || mockUsers[0];
  
  return {
    id: Date.now().toString(),
    issueId,
    authorId,
    authorName: author.name,
    authorRole: author.role,
    content,
    createdAt: new Date(),
  };
};

// Export mock departments for use in forms
export const getMockDepartments = (): string[] => {
  return mockDepartments;
};

// Export mock users for testing
export const getMockUsers = () => {
  return mockUsers;
};