const Village = require('../models/Village');
const AppError = require('../utils/appError');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const ApiFeatures = require('../utils/apiFeatures');

/**
 * Get all villages with filtering, sorting, and pagination
 */
const getAllVillages = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Village.find({ isActive: true }), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const villages = await features.query.populate('admin', 'name phone');

  res.status(200).json(
    ApiResponse.success('تم جلب القرى بنجاح', {
      results: villages.length,
      villages
    })
  );
});

/**
 * Get single village by ID
 */
const getVillage = asyncHandler(async (req, res, next) => {
  const village = await Village.findById(req.params.id)
    .populate('admin', 'name phone')
    .populate('users', 'name phone avatar')
    .populate('products', 'name price images')
    .populate('services', 'name price images');

  if (!village) {
    return next(new AppError('لم يتم العثور على القرية', 404));
  }

  res.status(200).json(
    ApiResponse.success('تم جلب القرية بنجاح', { village })
  );
});

/**
 * Create new village (admin only)
 */
const createVillage = asyncHandler(async (req, res, next) => {
  const { name, nameEn, governorate, center, postalCode, coordinates, description, population, area, features, mainActivities, contactInfo } = req.body;

  if (!name || !governorate || !center || !coordinates) {
    return next(new AppError('الاسم والمحافظة والمركز وإحداثيات الموقع مطلوبة', 400));
  }

  const village = await Village.create({
    name,
    nameEn,
    governorate,
    center,
    postalCode,
    location: {
      type: 'Point',
      coordinates: coordinates
    },
    description,
    population,
    area,
    features,
    mainActivities,
    contactInfo
  });

  res.status(201).json(
    ApiResponse.success('تم إنشاء القرية بنجاح', { village })
  );
});

/**
 * Update village (admin only)
 */
const updateVillage = asyncHandler(async (req, res, next) => {
  const allowedFields = ['name', 'nameEn', 'governorate', 'center', 'postalCode', 'description', 'population', 'area', 'features', 'mainActivities', 'contactInfo', 'isActive', 'isVerified'];
  const updates = {};

  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      if (key === 'coordinates') {
        updates.location = {
          type: 'Point',
          coordinates: req.body.coordinates
        };
      } else {
        updates[key] = req.body[key];
      }
    }
  });

  const village = await Village.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!village) {
    return next(new AppError('لم يتم العثور على القرية', 404));
  }

  res.status(200).json(
    ApiResponse.success('تم تحديث القرية بنجاح', { village })
  );
});

/**
 * Delete village (admin only)
 */
const deleteVillage = asyncHandler(async (req, res, next) => {
  const village = await Village.findById(req.params.id);

  if (!village) {
    return next(new AppError('لم يتم العثور على القرية', 404));
  }

  // Soft delete by setting isActive to false
  village.isActive = false;
  await village.save();

  res.status(200).json(
    ApiResponse.success('تم حذف القرية بنجاح')
  );
});

/**
 * Get villages by governorate
 */
const getVillagesByGovernorate = asyncHandler(async (req, res, next) => {
  const { governorate } = req.params;

  const villages = await Village.find({
    governorate: new RegExp(governorate, 'i'),
    isActive: true
  }).sort({ name: 1 });

  res.status(200).json(
    ApiResponse.success('تم جلب القرى بنجاح', {
      results: villages.length,
      villages
    })
  );
});

/**
 * Search villages
 */
const searchVillages = asyncHandler(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new AppError('مصطلح البحث مطلوب', 400));
  }

  const villages = await Village.search(q);

  res.status(200).json(
    ApiResponse.success('تم البحث بنجاح', {
      results: villages.length,
      villages
    })
  );
});

/**
 * Get nearby villages
 */
const getNearbyVillages = asyncHandler(async (req, res, next) => {
  const { lng, lat, maxDistance = 50000 } = req.query;

  if (!lng || !lat) {
    return next(new AppError('خط الطول وخط العرض مطلوبان', 400));
  }

  const villages = await Village.findNearby([parseFloat(lng), parseFloat(lat)], parseFloat(maxDistance));

  res.status(200).json(
    ApiResponse.success('تم جلب القرى القريبة بنجاح', {
      results: villages.length,
      villages
    })
  );
});

/**
 * Get village statistics
 */
const getVillageStats = asyncHandler(async (req, res, next) => {
  const stats = await Village.getStatistics();

  res.status(200).json(
    ApiResponse.success('تم جلب إحصائيات القرى بنجاح', { stats })
  );
});

/**
 * Update village admin
 */
const updateVillageAdmin = asyncHandler(async (req, res, next) => {
  const { adminId } = req.body;

  const village = await Village.findByIdAndUpdate(
    req.params.id,
    { admin: adminId },
    { new: true, runValidators: true }
  ).populate('admin', 'name phone');

  if (!village) {
    return next(new AppError('لم يتم العثور على القرية', 404));
  }

  res.status(200).json(
    ApiResponse.success('تم تحديث مدير القرية بنجاح', { village })
  );
});

module.exports = {
  getAllVillages,
  getVillage,
  createVillage,
  updateVillage,
  deleteVillage,
  getVillagesByGovernorate,
  searchVillages,
  getNearbyVillages,
  getVillageStats,
  updateVillageAdmin
};