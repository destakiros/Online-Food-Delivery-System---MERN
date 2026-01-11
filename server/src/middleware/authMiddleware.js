
// This is a mock authentication middleware for demonstration purposes.
// In a real application, this would use 'jsonwebtoken' to verify a real token
// and fetch a user from the database.

const protect = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // In a real app: verify token, find user by ID from token payload.
    // For this demo, we'll attach a mock user if the token exists.
    req.user = {
      _id: 'mockUserId',
      name: 'Mock User',
      isAdmin: req.headers.authorization.includes('admin'), // Simple check for demo
    };
    next();
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export { protect, admin };
