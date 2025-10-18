# Campus Connect Frontend

A React.js application for campus issue management built with TypeScript, Tailwind CSS, and React Router.

## Features

- **Role-based Authentication**: Support for students, faculty, and authorities
- **Issue Management**: Report, track, and manage campus issues
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Context-based state management
- **Accessibility**: WCAG 2.1 AA compliant

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS with custom theme
- **Routing**: React Router DOM v6
- **State Management**: React Context API with useReducer
- **Build Tool**: Vite with Rolldown
- **Icons**: Heroicons
- **Date Handling**: date-fns

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (Navbar, Footer, Sidebar)
│   ├── ui/             # UI components (IssueCard, StatusBadge, Loader)
│   └── ProtectedRoute.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── IssuesContext.tsx
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
│   ├── api.ts          # API utilities
│   ├── constants.ts    # App constants
│   └── helpers.ts      # Helper functions
└── assets/             # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## User Roles

### Students/Faculty
- Report campus issues
- View and track their reported issues
- Update profile information

### Authorities
- View all reported issues
- Update issue status and add comments
- View analytics and reports
- Manage issue resolution

## Development Status

This project is currently in development. The following components are implemented:

✅ Project structure and configuration
✅ Routing setup with React Router
✅ Authentication and Issues context providers
✅ TypeScript type definitions
✅ Tailwind CSS configuration with custom theme
✅ Utility functions and constants

## Next Steps

The following features will be implemented in upcoming tasks:

- [ ] Authentication pages and forms
- [ ] Layout components (Navbar, Footer, Sidebar)
- [ ] UI components (IssueCard, StatusBadge, Loader)
- [ ] Dashboard pages for different user roles
- [ ] Issue reporting and management features
- [ ] Profile management
- [ ] Analytics and reporting

## Contributing

This project follows the Campus Connect specification. Please refer to the design document for implementation guidelines.

## License

This project is part of the Campus Connect platform.