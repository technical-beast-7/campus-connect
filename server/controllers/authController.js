import User from '../models/User.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/emailService-console.js';

/**
 * @desc    Send OTP for registration
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
export const sendOTP = async (req, res, next) => {
  try {
    const { name, email, password, role, department, categories } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Validate department for students/faculty
    if ((role === 'student' || role === 'faculty') && !department) {
      res.status(400);
      throw new Error('Department is required for students and faculty');
    }

    // Validate categories for authorities
    if (role === 'authority') {
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        res.status(400);
        throw new Error('Authorities must select at least one category');
      }
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email });

    // Store OTP and user data temporarily
    const userData = {
      name,
      email,
      password,
      role,
      department
    };

    // Add categories if user is an authority
    if (role === 'authority' && categories) {
      userData.categories = categories;
    }

    await OTP.create({
      email,
      otp,
      userData
    });

    // Send OTP email
    console.log('Calling sendOTPEmail...');
    const emailResult = await sendOTPEmail(email, otp, name);
    console.log('Email sent, result:', emailResult);

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email address',
      email,
      // For development: include preview URL
      ...(process.env.NODE_ENV === 'development' && emailResult.previewUrl && {
        previewUrl: emailResult.previewUrl
      })
    });
  } catch (error) {
    console.error('Error in sendOTP controller:', error);
    next(error);
  }
};

/**
 * @desc    Verify OTP and register user
 * @route   POST /api/auth/verify-otp
 * @access  Public
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    // Create user with stored data
    const { name, password, role, department, categories } = otpRecord.userData;

    const userData = {
      name,
      email,
      password,
      role,
      department
    };

    // Add categories if user is an authority
    if (role === 'authority' && categories) {
      userData.categories = categories;
    }

    const user = await User.create(userData);

    // Delete OTP record after successful registration
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send welcome email (non-blocking)
    sendWelcomeEmail(email, name, role).catch(err => 
      console.error('Welcome email failed:', err)
    );

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400);
      throw new Error('Failed to create user');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register a new user (legacy - without OTP)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists with this email');
    }

    // Validate required fields
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Validate department for students/faculty
    if ((role === 'student' || role === 'faculty') && !department) {
      res.status(400);
      throw new Error('Department is required for students and faculty');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      department
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        categories: user.categories || [],
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // User is already attached to req by protect middleware
    const user = await User.findById(req.user._id).select('-password');

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.department = req.body.department || user.department;
    user.avatar = req.body.avatar || user.avatar;

    // Update password if provided
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      avatar: updatedUser.avatar,
      token: generateToken(updatedUser._id)
    });
  } catch (error) {
    next(error);
  }
};
