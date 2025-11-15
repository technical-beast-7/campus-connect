import Issue from '../models/Issue.js';

// @desc    Create new issue
// @route   POST /api/issues
// @access  Private
export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, department } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      res.status(400);
      throw new Error('Please provide title, description, and category');
    }

    // Create issue with reporter from authenticated user
    const issue = await Issue.create({
      title,
      description,
      category,
      department: department || req.user.department,
      reporter: req.user._id,
      imageUrl: req.file ? `/uploads/issue-images/${req.file.filename}` : undefined
    });

    // Populate reporter details
    await issue.populate('reporter', 'name email role department');

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all issues with filtering
// @route   GET /api/issues
// @access  Private (authorities see only issues matching their categories)
export const getIssues = async (req, res, next) => {
  try {
    const { status, category, department } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (department) {
      filter.department = department;
    }
    
    // Authorities can only see issues matching their assigned categories
    if (req.user.role === 'authority') {
      console.log('Authority user:', req.user.name, 'Categories:', req.user.categories);
      if (req.user.categories && req.user.categories.length > 0) {
        // Filter issues to only show categories this authority handles
        filter.category = { $in: req.user.categories };
        console.log('Filtering issues by categories:', req.user.categories);
      } else {
        // If authority has no categories assigned, they see nothing
        filter.category = { $in: [] };
        console.log('Authority has no categories, showing no issues');
      }
    }

    console.log('Final filter:', JSON.stringify(filter));
    const issues = await Issue.find(filter)
      .populate('reporter', 'name email role department')
      .populate('comments.user', 'name email role')
      .sort({ createdAt: -1 });

    console.log('Found', issues.length, 'issues');

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's issues
// @route   GET /api/issues/my-issues
// @access  Private
export const getMyIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ reporter: req.user._id })
      .populate('reporter', 'name email role department')
      .populate('comments.user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue by ID
// @route   GET /api/issues/:id
// @access  Private
export const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reporter', 'name email role department')
      .populate('comments.user', 'name email role');

    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue status
// @route   PUT /api/issues/:id/status
// @access  Private (authority only)
export const updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'resolved'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Please provide a valid status: pending, in-progress, or resolved');
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }

    // Check if authority's category matches the issue's category
    if (req.user.role === 'authority') {
      if (!req.user.categories || !req.user.categories.includes(issue.category)) {
        res.status(403);
        throw new Error('Not authorized to update issues from other categories');
      }
    }

    issue.status = status;
    await issue.save();

    await issue.populate([
      { path: 'reporter', select: 'name email role department' },
      { path: 'comments.user', select: 'name email role' }
    ]);

    res.status(200).json({
      success: true,
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete issue
// @route   DELETE /api/issues/:id
// @access  Private (admin only)
export const deleteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }

    await issue.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400);
      throw new Error('Comment text is required');
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      res.status(404);
      throw new Error('Issue not found');
    }

    // Add comment
    const comment = {
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    };

    issue.comments.push(comment);
    await issue.save();

    console.log('Comment added to issue:', issue._id);
    console.log('Total comments now:', issue.comments.length);
    console.log('Comments array:', JSON.stringify(issue.comments, null, 2));

    // Populate the issue with all necessary data
    await issue.populate([
      { path: 'reporter', select: 'name email role department' },
      { path: 'comments.user', select: 'name email role' }
    ]);

    console.log('After populate - comments:', JSON.stringify(issue.comments, null, 2));

    res.status(201).json({
      success: true,
      data: issue
    });
  } catch (error) {
    next(error);
  }
};
