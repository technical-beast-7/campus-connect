# Campus Connect

A comprehensive web-based platform for reporting, tracking, and managing campus-related issues. Campus Connect enables users and authorities to collaborate effectively in maintaining and improving campus facilities and services.

## 📋 Overview

Campus Connect provides a centralized system where:
- **Users** can report issues they encounter on campus
- **Authorities** can track, manage, and resolve reported issues efficiently

### Key Highlights
- 🔐 **Secure Email Verification** - OTP-based registration for verified users
- 🎯 **Category-Based Access Control** - Authorities only see relevant issues
- 📊 **Real-time Analytics** - Department-wise issue tracking and statistics
- 💬 **Interactive Communication** - Comment system for issue discussions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🖼️ **Image Support** - Visual documentation of issues with photo uploads

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
- **Email Verification with OTP** - Secure registration with one-time password verification
- **Role-based Authentication** - Two user roles: User and Authority
- **JWT-based Security** - Secure token-based authentication
- **User Profile Management** - Update personal information and preferences
- **Department & Category Organization** - Department-based for users, category-based for authorities

### Issue Reporting
- **Detailed Issue Reports** - Create comprehensive issue descriptions
- **Image Upload** - Attach photos to document issues visually
- **Issue Categories** - Maintenance, Canteen, Classroom, Hostel, Transport, Other
- **Status Tracking** - Monitor issue progress (Pending, In Progress, Resolved)
- **Department Tagging** - Automatic department association for better organization

### Issue Management
- **Comprehensive Issue View** - View all reported issues with filtering
- **Advanced Filtering** - Filter by category, status, department, and search
- **Status Updates** - Authorities can update issue status
- **Category-based Access Control** - Authorities only see issues in their assigned categories
- **Issue Deletion** - Authorities can remove inappropriate or duplicate issues

### Communication
- **Comment System** - Add comments and responses to issues
- **Authority Responses** - Authorities can post official responses
- **Comment History** - View complete conversation thread for each issue
- **User Identification** - Comments show author name and role

### Analytics & Reporting
- **User Dashboard** - Personalized dashboard for users
- **Authority Dashboard** - Comprehensive overview for authorities
- **Issue Statistics** - Total, pending, in-progress, and resolved counts
- **Department Analytics** - Department-wise issue distribution for authorities
- **Recent Activity Feed** - Quick view of latest issues and updates

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
- **Email Service:** Nodemailer (for OTP verification)
- **Password Hashing:** bcryptjs
- **File Upload:** Multer
- **Validation:** express-validator
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
   git clone https://github.com/technical-beast-7/campus-connect.git
   cd campus-connect
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
   
   # Email Configuration (for OTP verification)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   EMAIL_FROM=Campus Connect <noreply@campusconnect.com>
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

- `POST /api/auth/send-otp` - Send OTP for email verification (Public)
- `POST /api/auth/verify-otp` - Verify OTP and complete registration (Public)
- `POST /api/auth/register` - Register a new user (Legacy - without OTP) (Public)
- `POST /api/auth/login` - Login user (Public)
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Issue Endpoints

- `POST /api/issues` - Create a new issue with optional image upload (Protected)
- `GET /api/issues` - Get all issues with optional filters (status, category, department) (Protected)
- `GET /api/issues/my-issues` - Get current user's issues (Protected)
- `GET /api/issues/:id` - Get single issue by ID (Protected)
- `PUT /api/issues/:id/status` - Update issue status (Authority only)
- `DELETE /api/issues/:id` - Delete issue (Authority only)
- `POST /api/issues/:id/comments` - Add comment to issue (Protected)

## 👥 User Roles

### User
- Report new issues
- View own issues
- Comment on issues
- Update profile
- View department-specific issues

### Authority
- View issues in assigned categories only (category-based access control)
- Update issue status (Pending → In Progress → Resolved)
- Post official responses to issues
- Access analytics dashboard with department-wise statistics
- Delete inappropriate or duplicate issues
- Manage issue resolution within their domain

## 🔐 Email Verification Setup

Campus Connect uses email verification with OTP for secure user registration.

### Option 1: Using Gmail (Recommended for Development)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings → Security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate a new app password for "Mail"
3. Add to your `server/.env`:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-digit-app-password
   ```

### Option 2: Console Mode (For Testing Without Email)

If you want to test without setting up email:
1. In `server/controllers/authController.js`, change the import:
   ```javascript
   // From:
   import { sendOTPEmail } from '../utils/emailService.js';
   // To:
   import { sendOTPEmail } from '../utils/emailService-console.js';
   ```
2. OTP will be logged to the console instead of being emailed

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

**OTP Email Not Received**
- Check email configuration in server `.env`
- Verify Gmail App Password is correct (16 digits, no spaces)
- Check spam/junk folder
- Use console mode for testing (see Email Verification Setup)
- Check server logs for email sending errors

**Authority Can't See Issues**
- Ensure authority user has categories assigned during registration
- Categories must match issue categories exactly
- Check MongoDB to verify user's `categories` field is populated

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
