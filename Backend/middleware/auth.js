const jwt = require('jsonwebtoken');

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || 
                     req.headers.authorization?.split(' ')[1] ||
                     req.body.token;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No authentication token found' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = {
            _id: decoded.userId,
            sessionId: req.params.sessionId || req.body.sessionId
        };

        next();
    } catch (error) {
        console.error('Auth Error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
};

module.exports = { authenticateToken };