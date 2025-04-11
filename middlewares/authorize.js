const jwt = require("jsonwebtoken");

const authorize = (allowedRoles) => (req, res, next) => {
  console.log("Cookies in Request:", req.cookies); // Debugging

  const token = req.cookies?.token;

  if (!token) return res.status(403).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded;

    // Check if user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next(); // Move to the next middleware or controller
  } catch (err) {
    console.log("Token verification error:", err.message);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authorize;
