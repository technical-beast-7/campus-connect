# Design Document

## Overview

The Campus Connect frontend is a React.js application with Tailwind CSS styling that provides a responsive, role-based interface for campus issue management. The application follows a component-based architecture with clear separation of concerns, utilizing React Router for navigation and Context API for state management.

## Architecture

### Application Structure

```
Campus Connect Frontend
├── Authentication Layer (Context API)
├── Routing Layer (React Router DOM)
├── UI Components (Reusable)
├── Pages (Route Components)
├── State Management (Context + Reducers)
└── Utilities (API helpers, constants)
```

### Technology Stack

- **Framework:** React.js 18+ with functional components and hooks
- **Styling:** Tailwind CSS with custom theme configuration
- **Routing:** React Router DOM v6 for client-side navigation
- **State Management:** React Context API with useReducer for complex state
- **Build Tool:** Create React App or Vite for development and bundling
- **Icons:** Heroicons or Lucide React for consistent iconography

### Design Principles

1. **Mobile-First Responsive Design:** All components designed for mobile and scaled up
2. **Role-Based UI:** Different interfaces for students/faculty vs authorities
3. **Component Reusability:** Shared components across different user roles
4. **Accessibility:** WCAG 2.1 AA compliance with proper ARIA labels
5. **Performance:** Code splitting and lazy loading for optimal bundle size

## Components and Interfaces

### Core Layout Components

#### Navbar Component
```jsx
// Props interface
interface NavbarProps {
  user?: User;
  onLogout: () => void;
}

// Features:
- Campus Connect logo and branding
- User avatar/name when authenticated
- Logout functionality
- Responsive hamburger menu for mobile
- Role-based navigation items
```

#### Footer Component
```jsx
// Features:
- Copyright information
- Quick links (About, Contact, Privacy)
- Social media links (optional)
- Responsive layout with proper spacing
```

#### Sidebar Component
```jsx
// Props interface
interface SidebarProps {
  userRole: 'student' | 'faculty' | 'authority';
  currentPath: string;
  onNavigate: (path: string) => void;
}

// Features:
- Role-based navigation menu
- Active state highlighting
- Collapsible on mobile devices
- Logout option at bottom
```

### UI Components

#### IssueCard Component
```jsx
// Props interface
interface IssueCardProps {
  issue: Issue;
  userRole: 'student' | 'faculty' | 'authority';
  onStatusChange?: (issueId: string, newStatus: IssueStatus) => void;
  onAddComment?: (issueId: string, comment: string) => void;
}

// Features:
- Issue title, category, and description display
- Status badge with color coding
- Reporter information (for authorities)
- Action buttons based on user role
- Image preview if attached
- Comments section (expandable)
```

#### StatusBadge Component
```jsx
// Props interface
interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'resolved';
  size?: 'sm' | 'md' | 'lg';
}

// Features:
- Color-coded status indicators
- Consistent styling across application
- Multiple size variants
- Accessible text and contrast ratios
```

#### Loader Component
```jsx
// Props interface
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

// Features:
- Spinning animation with Campus Connect branding
- Multiple size options
- Optional loading text
- Full-screen overlay option
```

### Form Components

#### LoginModal & RegisterModal
```jsx
// Shared form validation logic
// Role selection for registration
// Error handling and display
// Loading states during submission
// Responsive modal design
```

### Page Components Architecture

#### Landing Page
- Hero section with value proposition
- Feature highlights with icons
- Call-to-action buttons
- Responsive grid layout
- Smooth scroll navigation

#### Dashboard Pages
- Consistent layout with sidebar navigation
- Role-specific content areas
- Quick action buttons
- Statistics cards (for authorities)
- Recent activity feeds

## Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'authority';
  department: string;
  avatar?: string;
  createdAt: Date;
}
```

### Issue Model
```typescript
interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  reporterId: string;
  reporterName: string;
  reporterDepartment: string;
  imageUrl?: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

type IssueCategory = 'maintenance' | 'canteen' | 'classroom' | 'hostel' | 'transport' | 'other';
type IssueStatus = 'pending' | 'in-progress' | 'resolved';
```

### Comment Model
```typescript
interface Comment {
  id: string;
  issueId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: Date;
}
```

## State Management

### Authentication Context
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
```

### Issues Context
```typescript
interface IssuesState {
  issues: Issue[];
  myIssues: Issue[];
  isLoading: boolean;
  error: string | null;
  filters: IssueFilters;
}

interface IssuesContextType {
  state: IssuesState;
  fetchIssues: () => Promise<void>;
  fetchMyIssues: () => Promise<void>;
  createIssue: (issueData: CreateIssueData) => Promise<void>;
  updateIssueStatus: (issueId: string, status: IssueStatus) => Promise<void>;
  addComment: (issueId: string, comment: string) => Promise<void>;
  setFilters: (filters: Partial<IssueFilters>) => void;
}
```

## Routing Structure

```typescript
// Route configuration
const routes = [
  { path: '/', component: LandingPage, public: true },
  { path: '/login', component: LoginPage, public: true },
  { path: '/register', component: RegisterPage, public: true },
  { path: '/dashboard', component: Dashboard, protected: true },
  { path: '/report-issue', component: ReportIssue, protected: true, roles: ['student', 'faculty'] },
  { path: '/my-issues', component: MyIssues, protected: true, roles: ['student', 'faculty'] },
  { path: '/all-issues', component: AllIssues, protected: true, roles: ['authority'] },
  { path: '/analytics', component: Analytics, protected: true, roles: ['authority'] },
  { path: '/profile', component: Profile, protected: true },
];
```

### Protected Route Component
```jsx
// Handles authentication checks
// Role-based access control
// Redirects for unauthorized access
// Loading states during auth verification
```

## Styling and Theme

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          500: '#6b7280',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
}
```

### Component Styling Patterns
- **Cards:** `bg-white rounded-lg shadow-sm border border-gray-200 p-6`
- **Buttons:** `bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors`
- **Form Inputs:** `border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500`
- **Status Badges:** Color-coded with consistent padding and rounded corners

## Error Handling

### Error Boundary Component
```jsx
// Catches JavaScript errors in component tree
// Displays fallback UI for crashed components
// Logs errors for debugging
// Provides retry mechanisms where appropriate
```

### Form Validation
- Client-side validation using custom hooks
- Real-time validation feedback
- Server error handling and display
- Accessibility-compliant error messages

### Network Error Handling
- Retry mechanisms for failed requests
- Offline state detection and messaging
- Loading states during API calls
- User-friendly error messages

## Testing Strategy

### Unit Testing
- **Components:** Test rendering, props handling, and user interactions
- **Hooks:** Test custom hooks with React Testing Library
- **Utilities:** Test helper functions and API utilities
- **Coverage Target:** 80% code coverage minimum

### Integration Testing
- **User Flows:** Test complete user journeys (login → report issue → view status)
- **API Integration:** Mock API responses and test error scenarios
- **Routing:** Test navigation and protected routes
- **State Management:** Test context providers and state updates

### E2E Testing (Future)
- **Critical Paths:** User registration, issue reporting, status updates
- **Cross-Browser:** Chrome, Firefox, Safari compatibility
- **Mobile Testing:** Responsive design validation
- **Accessibility:** Screen reader and keyboard navigation testing

## Performance Optimization

### Code Splitting
```jsx
// Lazy load pages for better initial load time
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
```

### Image Optimization
- Lazy loading for issue images
- WebP format with fallbacks
- Responsive image sizing
- Compression for uploaded images

### Bundle Optimization
- Tree shaking for unused code elimination
- Webpack bundle analysis
- CDN delivery for static assets
- Service worker for caching (future enhancement)

## Accessibility Features

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast ratios (4.5:1 minimum)
- Screen reader compatibility
- Focus management and indicators

### Responsive Design Breakpoints
- **Mobile:** 320px - 768px
- **Tablet:** 768px - 1024px  
- **Desktop:** 1024px+
- **Large Desktop:** 1440px+

## Security Considerations

### Client-Side Security
- Input sanitization for user-generated content
- XSS prevention in dynamic content rendering
- Secure token storage (httpOnly cookies preferred)
- CSRF protection for form submissions
- Content Security Policy headers

### Authentication Flow
- JWT token validation
- Automatic token refresh
- Secure logout (token invalidation)
- Session timeout handling
- Role-based access control enforcement