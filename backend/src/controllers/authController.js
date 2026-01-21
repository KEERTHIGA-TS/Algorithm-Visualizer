// backend/controllers/authController.js
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    // ✅ Return consistent structure with frontend
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: 'Server error during registration'
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // ✅ Return consistent structure with frontend
    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login'
    });
  }
};
