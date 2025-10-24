const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'اسم القرية مطلوب'],
    trim: true,
    maxlength: [100, 'اسم القرية لا يجب أن يتجاوز 100 حرف']
  },
  
  nameEn: {
    type: String,
    trim: true,
    maxlength: [100, 'اسم القرية بالإنجليزية لا يجب أن يتجاوز 100 حرف']
  },
  
  // Administrative Information
  governorate: {
    type: String,
    required: [true, 'المحافظة مطلوبة'],
    trim: true
  },
  
  center: {
    type: String,
    required: [true, 'المركز مطلوب'],
    trim: true
  },
  
  postalCode: {
    type: String,
    trim: true
  },
  
  // Geographic Information
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'إحداثيات القرية مطلوبة'],
      index: '2dsphere'
    }
  },
  
  // Village Details
  description: {
    type: String,
    maxlength: [500, 'وصف القرية لا يجب أن يتجاوز 500 حرف']
  },
  
  population: {
    type: Number,
    min: 0
  },
  
  area: {
    type: Number, // in square kilometers
    min: 0
  },
  
  // Village Image
  image: {
    public_id: String,
    url: {
      type: String,
      default: 'https://res.cloudinary.com/elsoug/image/upload/v1/defaults/default-village.png'
    }
  },
  
  // Village Features
  features: [{
    type: String,
    enum: [
      'مسجد',
      'كنيسة', 
      'مدرسة',
      'وحدة صحية',
      'مكتب بريد',
      'بنك',
      'صراف آلي',
      'سوق',
      'محطة وقود',
      'مخبز',
      'صيدلية',
      'مقهى شعبي',
      'ملعب',
      'حديقة',
      'مركز شباب'
    ]
  }],
  
  // Economic Activities
  mainActivities: [{
    type: String,
    enum: [
      'زراعة',
      'تربية مواشي',
      'صيد',
      'حرف يدوية',
      'تجارة',
      'خدمات',
      'صناعات صغيرة'
    ]
  }],
  
  // Village Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  usersCount: {
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
  
  storesCount: {
    type: Number,
    default: 0
  },
  
  // Contact Information
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  
  // Village Admin (Mayor or representative)
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  
  // Creation and update timestamps
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
villageSchema.index({ name: 1 });
villageSchema.index({ governorate: 1, center: 1 });
villageSchema.index({ location: '2dsphere' });
villageSchema.index({ isActive: 1, isVerified: 1 });
villageSchema.index({ createdAt: -1 });

// Virtual for village users
villageSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'village'
});

// Virtual for village products
villageSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'village'
});

// Virtual for village services
villageSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'village'
});

// Virtual for village stores
villageSchema.virtual('stores', {
  ref: 'Store',
  localField: '_id',
  foreignField: 'village'
});

// Pre-save middleware to update timestamps
villageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find villages near a location
villageSchema.statics.findNearby = function(coordinates, maxDistance = 50000) {
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
    isActive: true
  });
};

// Static method to search villages by name or governorate
villageSchema.statics.search = function(query) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { nameEn: searchRegex },
      { governorate: searchRegex },
      { center: searchRegex }
    ],
    isActive: true
  });
};

// Static method to get villages by governorate
villageSchema.statics.getByGovernorate = function(governorate) {
  return this.find({
    governorate: new RegExp(governorate, 'i'),
    isActive: true
  }).sort({ name: 1 });
};

// Static method to get village statistics
villageSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalVillages: { $sum: 1 },
        activeVillages: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        verifiedVillages: {
          $sum: {
            $cond: [{ $eq: ['$isVerified', true] }, 1, 0]
          }
        },
        totalPopulation: { $sum: '$population' },
        totalArea: { $sum: '$area' }
      }
    }
  ]);
  
  return stats[0] || {
    totalVillages: 0,
    activeVillages: 0,
    verifiedVillages: 0,
    totalPopulation: 0,
    totalArea: 0
  };
};

// Instance method to update statistics
villageSchema.methods.updateStatistics = async function() {
  const User = mongoose.model('User');
  const Product = mongoose.model('Product');
  const Service = mongoose.model('Service');
  const Store = mongoose.model('Store');
  
  const [usersCount, productsCount, servicesCount, storesCount] = await Promise.all([
    User.countDocuments({ village: this._id, isActive: true }),
    Product.countDocuments({ village: this._id, isActive: true }),
    Service.countDocuments({ village: this._id, isActive: true }),
    Store.countDocuments({ village: this._id, isActive: true })
  ]);
  
  this.usersCount = usersCount;
  this.productsCount = productsCount;
  this.servicesCount = servicesCount;
  this.storesCount = storesCount;
  
  return this.save({ validateBeforeSave: false });
};

const Village = mongoose.model('Village', villageSchema);

module.exports = Village;