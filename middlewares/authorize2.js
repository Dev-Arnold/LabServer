const jwt = require('jsonwebtoken')

const authorize = (allowedRoles) => (req, res, next) => {
    // console.log('Authorize middleware triggered');
    const token = req.headers.authorization?.split(' ')[1];
    console.log(token || "Nothing")
    if (!token) return res.status(403).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, 'myF@vour!te&00d');
        req.user = decoded;
        console.log('Decoded token:', decoded); 
        // Check if the user's role is in the allowed roles
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).send('Access denied. Insufficient permissions.');
        }

        next();
    } catch (err) {
        console.log('Token verification error:', err.message);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send('Token expired');
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(400).send('Invalid token');
        }
        res.status(400).send('Invalid token');
    }
};
module.exports = authorize;