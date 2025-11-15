# Campus Connect Server

Backend API for the Campus Connect platform - a web-based system for reporting and managing campus-related issues.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## Prerequisites

Before running the server, ensure you have the following installed:

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - Set a secure `JWT_SECRET`
   - Update `MONGODB_URI` if using a different database connection
   - Adjust `PORT` if needed

## Running the Server

### Development Mode

Start the server with auto-reload on file changes:

```bash
npm run dev
```

### Production Mode

Start the server in production:

```bash
npm start
```

The server will run on `http://localhost:5000` (or the PORT specified in your .env file).

## Project Structure

```
server/
├── config/           # Configuration files (database, etc.)
├── controllers/      # Request handlers and business logic
├── models/          # Mongoose schemas and models
├── routes/          # API route definitions
├── middleware/      # Custom middleware (auth, error handling)
├── uploads/         # File upload storage
├── utils/           # Helper functions and utilities
├── server.js        # Application entry point
└── package.json     # Dependencies and scripts
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Issues
- `POST /api/issues` - Create new issue
- `GET /api/issues` - Get all issues (with filters)
- `GET /api/issues/my-issues` - Get user's issues
- `GET /api/issues/:id` - Get single issue
- `PUT /api/issues/:id/status` - Update issue status (authority only)
- `DELETE /api/issues/:id` - Delete issue (admin only)

### Comments
- `POST /api/issues/:issueId/comments` - Add comment to issue
- `GET /api/issues/:issueId/comments` - Get all comments for issue
- `DELETE /api/comments/:id` - Delete comment

### Admin
- `GET /api/admin/analytics` - Get issue statistics
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/campus-connect |
| JWT_SECRET | Secret key for JWT signing | (required) |
| JWT_EXPIRE | JWT token expiration time | 30d |
| NODE_ENV | Environment mode | development |

## Database Setup

1. Ensure MongoDB is running on your system:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # On Linux with systemd
   sudo systemctl start mongod

   # On Windows
   net start MongoDB
   ```

2. The application will automatically connect to MongoDB using the URI specified in `.env`

3. Collections will be created automatically when the server starts

## User Roles

The system supports two user roles:

- **User** - Can report issues and view their own issues
- **Authority** - Can view all issues, update status, and access analytics

## File Uploads

- Issue images are stored in `uploads/issue-images/`
- Supported formats: JPEG, JPG, PNG, GIF
- Maximum file size: 5MB
- Files are automatically named with timestamps to prevent conflicts

## Error Handling

The server uses centralized error handling middleware that:
- Returns consistent error responses
- Includes stack traces in development mode
- Logs errors for debugging

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes with authentication middleware
- Role-based authorization
- Input validation with express-validator
- CORS configuration for cross-origin requests

## Development Tips

- Use `nodemon` for automatic server restarts during development
- Check MongoDB connection logs if database issues occur
- Ensure `.env` file is properly configured before starting
- Use tools like Postman or Thunder Client to test API endpoints

## Troubleshooting

### Server won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Ensure port 5000 is not already in use

### Database connection errors
- Verify MongoDB is running: `mongosh` or `mongo`
- Check MONGODB_URI in `.env` file
- Ensure MongoDB service is started

### Authentication issues
- Verify JWT_SECRET is set in `.env`
- Check token format in Authorization header: `Bearer <token>`
- Ensure user exists in database

## License

ISC
