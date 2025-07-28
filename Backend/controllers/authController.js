const User = require('../models/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'User with this email or username already exists' 
            });
        }

        const user = new User({
            username,
            email,
            password
        });

        await user.save();

        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

module.exports = {
    register, login, logout
};
