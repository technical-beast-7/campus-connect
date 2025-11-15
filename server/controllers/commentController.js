import Comment from '../models/Comment.js';
import Issue from '../models/Issue.js';

// @desc    Add comment to an issue
// @route   POST /api/issues/:issueId/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { issueId } = req.params;

    // Validate content
    if (!content || content.trim() === '') {
      res.status(400);
      throw new Error('Please provide comment content');
    }

    // Check if issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }

    // Create comment
    const comment = await Comment.create({
      issue: issueId,
      author: req.user._id,
      content: content.trim()
    });

    // Populate author details
    await comment.populate('author', 'name email role department');

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all comments for an issue
// @route   GET /api/issues/:issueId/comments
// @access  Private
export const getComments = async (req, res, next) => {
  try {
    const { issueId } = req.params;

    // Check if issue exists
    const issue = await Issue.findById(issueId);
    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }

    // Get all comments for the issue
    const comments = await Comment.find({ issue: issueId })
      .populate('author', 'name email role department')
      .sort({ createdAt: 1 }); // Oldest first for chronological order

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (author or admin only)
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // Check if user is the author or an admin
    const isAuthor = comment.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to delete this comment');
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
