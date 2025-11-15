# Campus Connect

A comprehensive web-based platform for reporting, tracking, and managing campus-related issues. Campus Connect enables students, faculty, and authorities to collaborate effectively in maintaining and improving campus facilities and services.

## 📋 Overview

Campus Connect provides a centralized system where:
- **Students** can report issues they encounter on campus
- **Faculty** can monitor and report departmental concerns
- **Authorities** can track, manage, and resolve reported issues efficiently

## 🏗️ Project Structure

```
CampusConnect/
├── client/                    # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── assets/          # Images, icons
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── context/         # Global state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API integration layer
│   │   └── utils/           # Helper functions
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                    # Node.js/Express backend API
│   ├── config/               # Database configuration
│   ├── controllers/          # Business logic
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── uploads/              # File uploads storage
│   ├── utils/                # Helper functions
│   ├── server.js             # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## ✨ Features

### User Management
- Role-based authentication (Student, Faculty, Authority)
- Secure JWT-based authentication
- User profile management
- Department-based organization

### Issue Reporting
- Create detailed issue reports with descriptions
- Upload images to document issues
- Categorize issues (Maintenance, Canteen, Classroom, Hostel, Transport, Other)
- Track issue status (Pending, In Progress, Resolved)

### Issue Management
- View all reported issues
- Filter issues by category, status, and department
- Update issue status (Authority role)
- Delete issues (Admin role)

### Communication
- Comment system for issue discussions
- Real-time updates on issue progress
- Notifications for status changes

### Analytics & Reporting
- Dashboard with issue statistics
- Category-wise issue breakdown
- Status distribution charts
- Department-wise analytics

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Date Handling:** date-fns

### Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **CORS:** cors middleware
- **Environment Variables:** dotenv

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CampusConnect
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Configuration

#### Client Configuration

1. Navigate to the `client` directory
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Update the environment variables:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=Campus Connect
   ```

#### Server Configuration

1. Navigate to the `server` directory
2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Update the environment variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus-connect
   JWT_SECRET=your_secure_jwt_secret_key_here
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

### Database Setup

1. **Start MongoDB**
   
   On macOS/Linux:
   ```bash
   mongod
   ```
   
   On Windows:
   ```bash
   net start MongoDB
   ```
   
   Or use MongoDB Compass for a GUI interface.

2. **Verify MongoDB is running**
   ```bash
   mongosh
   ```

### Running the Application

#### Option 1: Run Both Services Separately

1. **Start the backend server** (Terminal 1)
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:5000`

2. **Start the frontend client** (Terminal 2)
   ```bash
   cd client
   npm run dev
   ```
   The client will start on `http://localhost:3000`

3. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

#### Option 2: Production Build

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd ../server
   npm start
   ```

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Issue Endpoints

- `POST /api/issues` - Create a new issue (Protected)
- `GET /api/issues` - Get all issues with filters (Protected)
- `GET /api/issues/my-issues` - Get current user's issues (Protected)
- `GET /api/issues/:id` - Get single issue details (Protected)
- `PUT /api/issues/:id/status` - Update issue status (Authority only)
- `DELETE /api/issues/:id` - Delete issue (Admin only)

### Comment Endpoints

- `POST /api/comments/issues/:issueId/comments` - Add comment to issue (Protected)
- `GET /api/comments/issues/:issueId/comments` - Get all comments for issue (Protected)
- `DELETE /api/comments/:id` - Delete comment (Protected)

### Admin Endpoints

- `GET /api/admin/analytics` - Get issue analytics (Authority/Admin only)
- `GET /api/admin/users` - Get all users (Admin only)
- `DELETE /api/admin/users/:id` - Delete user (Admin only)

## 👥 User Roles

### Student
- Report new issues
- View own issues
- Comment on issues
- Update profile

### Faculty
- All student permissions
- View department-specific issues
- Priority issue reporting

### Authority
- All faculty permissions
- View all issues across departments
- Update issue status
- Access analytics dashboard
- Manage issue resolution

### Admin
- All authority permissions
- User management
- Delete issues and users
- System-wide analytics

## 🧪 Testing

### Client Testing
```bash
cd client
npm run test
```

### Server Testing
```bash
cd server
npm run test
```

## 📦 Building for Production

### Build the client
```bash
cd client
npm run build
```
The production-ready files will be in `client/dist/`

### Prepare the server
```bash
cd server
# Set NODE_ENV to production in .env
npm start
```

## 🔧 Development

### Code Structure Guidelines

- Follow the existing folder structure
- Use TypeScript for type safety in the client
- Use ES6+ features and async/await
- Follow RESTful API conventions
- Implement proper error handling
- Add comments for complex logic

### Naming Conventions

- **Components:** PascalCase (e.g., `IssueCard.tsx`)
- **Utilities:** camelCase (e.g., `formatDate.ts`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Routes:** kebab-case (e.g., `/api/my-issues`)

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check the `MONGODB_URI` in server `.env`
- Verify MongoDB port (default: 27017)

**Port Already in Use**
- Change the port in `.env` files
- Kill the process using the port:
  ```bash
  # Find process
  lsof -i :5000
  # Kill process
  kill -9 <PID>
  ```

**CORS Errors**
- Verify the API URL in client `.env`
- Check CORS configuration in `server/server.js`

**Image Upload Fails**
- Ensure `server/uploads/issue-images/` directory exists
- Check file size limits in multer configuration
- Verify file permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Support

For support and questions, please contact the development team or open an issue in the repository.

---

**Built with ❤️ for Campus Community**
