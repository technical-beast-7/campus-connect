# Campus Connect - Issue & Suggestion Management System

**Campus Connect** is a web-based platform designed to make it easier for students to report campus issues and share suggestions. It bridges the gap between students and college administration, allowing transparent and efficient communication.

## Features

- **User Registration & Login:** Students can sign up and log in to the system.
- **Issue Reporting:** Students can post issues or suggestions with descriptions, categories, and optional images.
- **Issue Tracking:** Students can monitor the status of their reports (Pending, In Progress, Resolved).
- **Upvotes & Comments:** Students can upvote or comment on common issues to help prioritize them.
- **Admin Panel:** Department authorities can view, update, and manage reported issues.
- **Super Admin Dashboard:** Optional overview for overall analytics, escalations, and department performance.
- **Notifications:** Students receive updates when their issues are updated by authorities.

## Tech Stack

- **Frontend:** React.js, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary / AWS S3 (for images)
- **Notifications:** Nodemailer (email notifications)

## Installation (Local Setup)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Campus-Connect

   ```

2. Setup Backend
   cd server
   npm install
   npm run dev

Create a .env file with:
PORT=5000
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_API_KEY=<your-cloudinary-key>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>

3. Setup Frontend
   cd client
   npm install
   npm run dev

4. Access the App
   Open http://localhost:3000 in your browser.

Folder Structure
Campus-Connect/
├── client/ # React frontend
├── server/ # Node.js backend
├── README.md
└── .gitignore

Future Enhancements
Automatic issue categorization
QR code scanning for classroom/location-based reporting
Leaderboard for most active reporters
Push notifications for real-time updates

License
MIT License
