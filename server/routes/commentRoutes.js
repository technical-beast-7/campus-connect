import express from 'express';
import { 
  addComment, 
  getComments, 
  deleteComment 
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for comments on specific issues
// POST /api/issues/:issueId/comments - Add comment to issue
// GET /api/issues/:issueId/comments - Get all comments for issue
router.route('/issues/:issueId/comments')
  .post(protect, addComment)
  .get(protect, getComments);

// Route for individual comment operations
// DELETE /api/comments/:id - Delete specific comment
router.route('/comments/:id')
  .delete(protect, deleteComment);

export default router;
