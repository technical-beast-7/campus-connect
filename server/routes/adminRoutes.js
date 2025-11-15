import express from 'express';
import { 
  getAnalytics, 
  getAllUsers, 
  deleteUser 
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('authority'));

// @route   GET /api/admin/analytics
// @desc    Get analytics data (issue stats, user stats, etc.)
// @access  Private/Admin
router.get('/analytics', getAnalytics);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', getAllUsers);

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user by ID
// @access  Private/Admin
router.delete('/users/:id', deleteUser);

export default router;
