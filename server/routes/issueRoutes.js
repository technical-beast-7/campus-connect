import express from 'express';
import {
  createIssue,
  getIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
  addComment
} from '../controllers/issueController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../utils/uploadConfig.js';

const router = express.Router();

// @route   POST /api/issues
// @desc    Create new issue with optional image upload
// @access  Private (all authenticated users)
router.post('/', protect, upload.single('image'), createIssue);

// @route   GET /api/issues
// @desc    Get all issues with optional filters (status, category, department)
// @access  Private (all authenticated users)
router.get('/', protect, getIssues);

// @route   GET /api/issues/my-issues
// @desc    Get current user's issues
// @access  Private (all authenticated users)
router.get('/my-issues', protect, getMyIssues);

// @route   GET /api/issues/:id
// @desc    Get single issue by ID
// @access  Private (all authenticated users)
router.get('/:id', protect, getIssueById);

// @route   PUT /api/issues/:id/status
// @desc    Update issue status (pending, in-progress, resolved)
// @access  Private (authority only)
router.put('/:id/status', protect, authorize('authority'), updateIssueStatus);

// @route   DELETE /api/issues/:id
// @desc    Delete issue
// @access  Private (admin only)
router.delete('/:id', protect, authorize('authority'), deleteIssue);

// @route   POST /api/issues/:id/comments
// @desc    Add comment to issue
// @access  Private (all authenticated users)
router.post('/:id/comments', protect, addComment);

export default router;
