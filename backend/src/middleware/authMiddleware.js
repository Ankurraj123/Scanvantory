
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authMiddleware = (req, res, next) => {
    try {
    
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided. Please log in.' });
        }

        const token = authHeader.substring(7); 

        
        const decoded = jwt.verify(token, JWT_SECRET);

        
        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        next();
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token. Please log in again.' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        return res.status(500).json({ message: 'Authentication error.' });
    }
};

module.exports = authMiddleware;
