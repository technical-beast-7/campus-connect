# Campus Connect Client

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
├── pages/              # Page components
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   └── IssueContext.tsx
├── hooks/              # Custom React hooks
├── services/           # API integration layer
│   ├── api.ts
│   ├── authService.ts
│   └── issueService.ts
├── utils/              # Utility functions
│   ├── constants.ts
│   ├── helpers.ts
│   └── roleRoutes.ts
└── assets/             # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

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

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:5000/api)
- `VITE_APP_NAME` - Application name

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
✅ Core components and pages

## API Integration

The client communicates with the backend server through the services layer. All API calls are made using Axios with interceptors for authentication tokens.

## Contributing

This project follows the Campus Connect specification. Please refer to the design document for implementation guidelines.

## License

This project is part of the Campus Connect platform.
