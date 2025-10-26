const User = require('../models/User');
const Village = require('../models/Village');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { createSendToken } = require('../utils/jwt');
const { generateOTP, hashOTP, verifyOTP, sendOTP } = require('../utils/otp');

/**
 * Register new user with complete profile
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, phone, email, villageId, address, bio, coordinates } = req.body;

  if (!name || !phone || !villageId || !coordinates) {
    return next(new AppError('الاسم ورقم الهاتف والقرية وإحداثيات الموقع مطلوبة', 400));
  }

  // Validate phone number format
  const phoneRegex = /^(\+201|01)[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    return next(new AppError('رقم الهاتف غير صحيح', 400));
  }

  // Check if phone already exists
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return next(new AppError('رقم الهاتف مسجل بالفعل', 400));
  }

  // Verify village exists
  const village = await Village.findById(villageId);
  if (!village) {
    return next(new AppError('القرية المحددة غير موجودة', 404));
  }

  // Create user with complete profile
  const user = await User.create({
    name,
    phone,
    email,
    village: villageId,
    address,
    bio,
    location: {
      type: 'Point',
      coordinates: coordinates
    },
    isPhoneVerified: true,
    isVerified: true,
    isActive: true
  });

  // Create and send token
  createSendToken(user, 201, res, 'تم التسجيل بنجاح');
});

/**
 * Send OTP for phone verification (Registration/Login)
 */
const sendPhoneOTP = asyncHandler(async (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new AppError('رقم الهاتف مطلوب', 400));
  }

  // Validate phone number format
  const phoneRegex = /^(\+201|01)[0-9]{9}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return next(new AppError('رقم الهاتف غير صحيح', 400));
  }

  // Check if user exists
  let user = await User.findOne({ phone: phoneNumber }).select('+phoneOTP +phoneOTPExpires +phoneOTPAttempts');
  
  // Check OTP attempts limit
  if (user && user.phoneOTPAttempts >= 5 && user.phoneOTPExpires > Date.now()) {
    const remainingTime = Math.ceil((user.phoneOTPExpires - Date.now()) / (1000 * 60));
    return next(new AppError(`تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى بعد ${remainingTime} دقيقة`, 429));
  }

  // Generate OTP
  const otp = generateOTP();
  const hashedOTP = hashOTP(otp);

  if (user) {
    // Update existing user
    user.phoneOTP = hashedOTP;
    user.phoneOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    user.phoneOTPAttempts = user.phoneOTPAttempts >= 5 ? 1 : user.phoneOTPAttempts + 1;
    await user.save({ validateBeforeSave: false });
  } else {
    // Create new user with OTP
    user = await User.create({
      phone: phoneNumber,
      phoneOTP: hashedOTP,
      phoneOTPExpires: Date.now() + 10 * 60 * 1000,
      phoneOTPAttempts: 1,
      name: '', // Will be set during profile completion
      village: null // Will be set during profile completion
    });
  }

  // Send OTP via SMS
  try {
    await sendOTP(phoneNumber, otp);
  } catch (error) {
    user.phoneOTP = undefined;
    user.phoneOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    return next(new AppError('فشل في إرسال رمز التحقق، يرجى المحاولة لاحقاً', 500));
  }

  res.status(200).json(
    ApiResponse.success('تم إرسال رمز التحقق بنجاح', {
      phoneNumber,
      expiresIn: '10 دقائق'
    })
  );
});

/**
 * Verify OTP and login/register user
 */
const verifyPhoneOTP = asyncHandler(async (req, res, next) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return next(new AppError('رقم الهاتف ورمز التحقق مطلوبان', 400));
  }

  // Find user with phone number
  const user = await User.findOne({ phone: phoneNumber })
    .select('+phoneOTP +phoneOTPExpires +phoneOTPAttempts');

  if (!user) {
    return next(new AppError('لم يتم العثور على المستخدم', 404));
  }

  // Check if OTP exists and not expired
  if (!user.phoneOTP || user.phoneOTPExpires < Date.now()) {
    return next(new AppError('رمز التحقق منتهي الصلاحية', 400));
  }

  // Verify OTP
  const isValidOTP = verifyOTP(otp, user.phoneOTP);
  if (!isValidOTP) {
    return next(new AppError('رمز التحقق غير صحيح', 400));
  }

  // Clear OTP fields and mark phone as verified
  user.phoneOTP = undefined;
  user.phoneOTPExpires = undefined;
  user.phoneOTPAttempts = 0;
  user.isPhoneVerified = true;
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  // Check if profile is complete
  const isProfileComplete = user.name && user.village;

  // Create and send token
  createSendToken(user, 200, res, isProfileComplete ? 'تم تسجيل الدخول بنجاح' : 'تم التحقق من الهاتف، يرجى إكمال الملف الشخصي');
});

/**
 * Complete user profile after OTP verification
 */
const completeProfile = asyncHandler(async (req, res, next) => {
  const { name, villageId, address, businessName, businessType } = req.body;

  if (!name || !villageId) {
    return next(new AppError('الاسم والقرية مطلوبان', 400));
  }

  // Verify village exists
  const village = await Village.findById(villageId);
  if (!village) {
    return next(new AppError('القرية المحددة غير موجودة', 404));
  }

  // Update user profile
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      village: villageId,
      address,
      businessName,
      businessType,
      role: businessName ? 'seller' : 'user'
    },
    { new: true, runValidators: true }
  ).populate('village', 'name governorate');

  res.status(200).json(
    ApiResponse.success('تم إكمال الملف الشخصي بنجاح', { user })
  );
});

/**
 * Get current user profile
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('village', 'name governorate')
    .populate('products')
    .populate('services');

  res.status(200).json(
    ApiResponse.success('تم جلب بيانات المستخدم بنجاح', { user })
  );
});

/**
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  // Fields that can be updated
  const allowedFields = ['name', 'email', 'bio', 'address', 'businessName', 'businessType', 'settings'];
  const updates = {};

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // Update role based on business info
  if (updates.businessName) {
    updates.role = 'seller';
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).populate('village', 'name governorate');

  res.status(200).json(
    ApiResponse.success('تم تحديث الملف الشخصي بنجاح', { user })
  );
});

/**
 * Update user location
 */
const updateLocation = asyncHandler(async (req, res, next) => {
  const { coordinates, address } = req.body;

  if (!coordinates || coordinates.length !== 2) {
    return next(new AppError('إحداثيات الموقع مطلوبة (خط الطول، خط العرض)', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      location: {
        type: 'Point',
        coordinates: coordinates
      },
      address: address || user.address
    },
    { new: true, runValidators: true }
  );

  res.status(200).json(
    ApiResponse.success('تم تحديث الموقع بنجاح', { 
      location: user.location,
      address: user.address 
    })
  );
});

/**
 * Change user role (admin only)
 */
const changeUserRole = asyncHandler(async (req, res, next) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return next(new AppError('معرف المستخدم والدور مطلوبان', 400));
  }

  const validRoles = ['user', 'seller', 'admin'];
  if (!validRoles.includes(role)) {
    return next(new AppError('الدور المحدد غير صحيح', 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError('لم يتم العثور على المستخدم', 404));
  }

  res.status(200).json(
    ApiResponse.success('تم تغيير دور المستخدم بنجاح', { user })
  );
});

/**
 * Deactivate user account
 */
const deactivateAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { 
    active: false,
    isActive: false 
  });

  res.status(200).json(
    ApiResponse.success('تم إلغاء تفعيل الحساب بنجاح')
  );
});

/**
 * Logout user
 */
const logout = asyncHandler(async (req, res, next) => {
  // Clear cookies
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.cookie('refreshToken', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json(
    ApiResponse.success('تم تسجيل الخروج بنجاح')
  );
});

/**
 * Get user statistics (admin only)
 */
const getUserStats = asyncHandler(async (req, res, next) => {
  const stats = await User.getStatistics();

  res.status(200).json(
    ApiResponse.success('تم جلب إحصائيات المستخدمين بنجاح', { stats })
  );
});

module.exports = {
  register,
  sendPhoneOTP,
  verifyPhoneOTP,
  completeProfile,
  getMe,
  updateProfile,
  updateLocation,
  changeUserRole,
  deactivateAccount,
  logout,
  getUserStats
};