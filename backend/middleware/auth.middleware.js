const jwt  = require('jsonwebtoken');
const User = require('../models/User.model');

// ── Protect: any logged-in user ──
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
      return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ success: false, message: 'User not found.' });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
};

// ── AdminOnly: role must be admin or superadmin ──
const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin()) {
    return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
  }
  next();
};

// ── SuperAdminOnly: role must be superadmin ──
const superAdminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied. Superadmin only.' });
  }
  next();
};

module.exports = { protect, adminOnly, superAdminOnly };
