const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken, extractToken } = require('../utils/jwt');

/**
 * Protect middleware - Verify JWT token and authenticate user
 */
const protect = asyncHandler(async (req, res, next) => {
  // 1) Get token from request
  const token = extractToken(req);

  if (!token) {
    return next(new AppError('يجب تسجيل الدخول للوصول إلى هذا المورد', 401));
  }

  // 2) Verify token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('رمز المصادقة غير صحيح', 401));
    } else if (error.name === 'TokenExpiredError') {
      return next(new AppError('انتهت صلاحية رمز المصادقة، يرجى تسجيل الدخول مرة أخرى', 401));
    }
    return next(new AppError('خطأ في المصادقة', 401));
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+active');
  if (!currentUser) {
    return next(new AppError('المستخدم المرتبط بهذا الرمز لم يعد موجوداً', 401));
  }

  // 4) Check if user is active
  if (!currentUser.active) {
    return next(new AppError('تم إلغاء تفعيل حسابك، يرجى التواصل مع الدعم', 401));
  }

  // 5) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('تم تغيير كلمة المرور مؤخراً، يرجى تسجيل الدخول مرة أخرى', 401));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

/**
 * Authorize middleware - Check user roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('ليس لديك صلاحية للوصول إلى هذا المورد', 403));
    }
    next();
  };
};

/**
 * Optional authentication - Don't fail if no token provided
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    try {
      const decoded = verifyToken(token);
      const currentUser = await User.findById(decoded.id).select('+active');
      
      if (currentUser && currentUser.active && !currentUser.changedPasswordAfter(decoded.iat)) {
        req.user = currentUser;
      }
    } catch (error) {
      // Silently fail for optional auth
    }
  }

  next();
});

/**
 * Check if user owns resource or is admin
 */
const restrictToOwnerOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user owns the resource
    const resource = req.resource || req.body;
    if (resource && resource[resourceUserField] && resource[resourceUserField].toString() === req.user._id.toString()) {
      return next();
    }

    return next(new AppError('يمكنك فقط الوصول إلى مواردك الخاصة', 403));
  };
};

/**
 * Check if user is verified (phone number verified)
 */
const requireVerification = (req, res, next) => {
  if (!req.user.isPhoneVerified) {
    return next(new AppError('يجب تأكيد رقم الهاتف أولاً', 403));
  }
  next();
};

/**
 * Check if user has completed profile setup
 */
const requireCompleteProfile = (req, res, next) => {
  const user = req.user;
  
  if (!user.name || !user.phoneNumber || !user.village) {
    return next(new AppError('يجب إكمال الملف الشخصي أولاً', 403));
  }
  
  next();
};

/**
 * Rate limiting for authentication attempts
 */
const authRateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.ip + (req.body.phoneNumber || req.body.email || '');
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const attempt = attempts.get(key);
    
    if (now > attempt.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (attempt.count >= maxAttempts) {
      return next(new AppError('تم تجاوز عدد المحاولات المسموح، يرجى المحاولة لاحقاً', 429));
    }

    attempt.count++;
    next();
  };
};

module.exports = {
  protect,
  authorize,
  optionalAuth,
  restrictToOwnerOrAdmin,
  requireVerification,
  requireCompleteProfile,
  authRateLimit
};