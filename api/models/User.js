const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [50, 'الاسم لا يجب أن يتجاوز 50 حرف']
  },
  
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    unique: true,
    match: [/^(\+201|01)[0-9]{9}$/, 'رقم الهاتف غير صحيح']
  },
  
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'البريد الإلكتروني غير صحيح']
  },
  
  // Profile Information
  avatar: {
    public_id: String,
    url: {
      type: String,
      default: 'https://res.cloudinary.com/elsoug/image/upload/v1/defaults/default-avatar.png'
    }
  },
  
  bio: {
    type: String,
    maxlength: [200, 'الوصف لا يجب أن يتجاوز 200 حرف']
  },
  
  // Location Information

  
  address: {
    type: String,
    maxlength: [100, 'العنوان لا يجب أن يتجاوز 100 حرف']
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  
  // Authentication
  password: {
    type: String,
    select: false
  },
  
  passwordChangedAt: Date,
  
  // OTP for phone verification
  phoneOTP: {
    type: String,
    select: false
  },
  
  phoneOTPExpires: {
    type: Date,
    select: false
  },
  
  phoneOTPAttempts: {
    type: Number,
    default: 0,
    select: false
  },
  
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  // Refresh token for JWT
  refreshToken: {
    type: String,
    select: false
  },
  
  refreshTokenExpires: {
    type: Date,
    select: false
  },
  
  // Account Status
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user'
  },
  
  // Business Information (for sellers)
  businessName: {
    type: String,
    trim: true,
    maxlength: [100, 'اسم النشاط التجاري لا يجب أن يتجاوز 100 حرف']
  },
  
  businessType: {
    type: String,
    enum: ['individual', 'shop', 'service_provider', 'farmer'],
    default: 'individual'
  },
  
  // Statistics
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  reviewsCount: {
    type: Number,
    default: 0
  },
  
  productsCount: {
    type: Number,
    default: 0
  },
  
  servicesCount: {
    type: Number,
    default: 0
  },
  
  // Settings
  settings: {
    notifications: {
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      email: { type: Boolean, default: false }
    },
    privacy: {
      showPhone: { type: Boolean, default: true },
      showLocation: { type: Boolean, default: true }
    },
    language: {
      type: String,
      enum: ['ar', 'en'],
      default: 'ar'
    }
  },
  
  // FCM Token for push notifications
  fcmToken: String,
  
  // Last activity
  lastActive: {
    type: Date,
    default: Date.now
  },
  
  // Account creation and updates
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ phone: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ isActive: 1, isVerified: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's products
userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'seller'
});

// Virtual for user's services
userSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'provider'
});

// Virtual for user's reviews
userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'reviewee'
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to hash password if it exists
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return resetToken;
};

// Instance method to update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = Date.now();
  return this.save({ validateBeforeSave: false });
};

// Static method to find users near a location
userSchema.statics.findNearby = function(coordinates, maxDistance = 10000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: coordinates
        },
        $maxDistance: maxDistance
      }
    },
    isActive: true,
    isVerified: true
  });
};

// Static method to get user statistics
userSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        verifiedUsers: {
          $sum: {
            $cond: [{ $eq: ['$isVerified', true] }, 1, 0]
          }
        },
        sellers: {
          $sum: {
            $cond: [{ $eq: ['$role', 'seller'] }, 1, 0]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    sellers: 0
  };
};

// Remove sensitive data from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.fcmToken;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;