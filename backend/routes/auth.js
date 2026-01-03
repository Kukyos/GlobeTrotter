import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { randomUUID } from 'crypto';
import db from '../config/database.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required')
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Validation errors:', errors.array());
        return res.status(400).json({ 
          success: false, 
          message: errors.array()[0].msg,
          errors: errors.array() 
        });
      }

      const { email, password, firstName, lastName, phone, city, country, bio } = req.body;

      console.log('Registration attempt for:', email);

      // Check if user already exists
      const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        console.log('User already exists:', email);
        return res.status(400).json({ 
          success: false, 
          message: 'User with this email already exists' 
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Generate UUID
      const userId = randomUUID();

      console.log('Creating user with ID:', userId);

      // Insert user
      await db.query(
        `INSERT INTO users (id, email, password_hash, first_name, last_name, phone, city, country, bio, role, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', NOW())`,
        [userId, email, passwordHash, firstName, lastName, phone || null, city || null, country || null, bio || null]
      );

      console.log('User created successfully:', email);

      // Create JWT token
      const token = jwt.sign(
        { id: userId, email, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Return user data (without password)
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          token,
          user: {
            id: userId,
            email,
            firstName,
            lastName,
            phone: phone || null,
            city: city || null,
            country: country || null,
            bio: bio || null,
            role: 'user',
            createdAt: new Date().toISOString()
          }
        }
      });

    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.error('Login validation errors:', errors.array());
        return res.status(400).json({ 
          success: false, 
          message: errors.array()[0].msg,
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;

      console.log('Login attempt for:', email);

      // Find user
      const [users] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        console.log('User not found:', email);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      const user = users[0];

      // Check password
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        console.log('Invalid password for:', email);
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid email or password' 
        });
      }

      console.log('Login successful for:', email);

      // Create JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Return user data (without password)
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            phone: user.phone,
            photoUrl: user.photo_url,
            city: user.city,
            country: user.country,
            bio: user.bio,
            role: user.role,
            createdAt: user.created_at
          }
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const [users] = await db.query(
      'SELECT id, email, first_name, last_name, phone, photo_url, city, country, bio, role, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const user = users[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        photoUrl: user.photo_url,
        city: user.city,
        country: user.country,
        bio: user.bio,
        role: user.role,
        createdAt: user.created_at
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
});

export default router;
