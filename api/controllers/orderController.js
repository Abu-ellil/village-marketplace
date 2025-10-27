const Order = require("../models/Order");
const Product = require("../models/Product");
const Service = require("../models/Service");
const User = require("../models/User");
const Notification = require("../models/Notification");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");
const ApiResponse = require("../utils/apiResponse");
const ApiFeatures = require("../utils/apiFeatures");

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by payment status
  if (req.query.paymentStatus) {
    filter.paymentStatus = req.query.paymentStatus;
  }

  // Filter by order type
  if (req.query.orderType) {
    filter.orderType = req.query.orderType;
  }

  // Date range filter
  if (req.query.startDate || req.query.endDate) {
    filter.createdAt = {};
    if (req.query.startDate) {
      filter.createdAt.$gte = new Date(req.query.startDate);
    }
    if (req.query.endDate) {
      filter.createdAt.$lte = new Date(req.query.endDate);
    }
  }

  const orders = await Order.find(filter)
    .populate("buyer", "name email phone profilePicture")
    .populate("seller", "name email phone profilePicture")
    .populate("product", "title price images")
    .populate("service", "title price images")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: orders,
  });
});

// @desc    Get user orders (buyer or seller)
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    $or: [{ buyer: req.user._id }, { seller: req.user._id }],
  };

  // Filter by role (as buyer or seller)
  if (req.query.role === "buyer") {
    filter.$or = [{ buyer: req.user._id }];
  } else if (req.query.role === "seller") {
    filter.$or = [{ seller: req.user._id }];
  }

  // Filter by status
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // Filter by order type
  if (req.query.orderType) {
    filter.orderType = req.query.orderType;
  }

  const orders = await Order.find(filter)
    .populate("buyer", "name email phone profilePicture")
    .populate("seller", "name email phone profilePicture")
    .populate("product", "title price images")
    .populate("service", "title price images")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
    data: orders,
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("buyer", "name email phone profilePicture")
    .populate("seller", "name email phone profilePicture")
    .populate("product", "title description price images category condition")
    .populate("service", "title description price images category serviceType");

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Check if user is authorized to view this order
  if (
    order.buyer._id.toString() !== req.user._id.toString() &&
    order.seller._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Not authorized to view this order", 403);
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderType,
    product,
    service,
    quantity,
    deliveryAddress,
    paymentMethod,
    notes,
  } = req.body;

  let item, seller, totalAmount;

  // Validate order type and get item details
  if (orderType === "product") {
    if (!product) {
      throw new AppError("Product ID is required for product orders", 400);
    }

    item = await Product.findById(product).populate("seller");
    if (!item) {
      throw new AppError("Product not found", 404);
    }

    if (!item.isAvailable) {
      throw new AppError("Product is not available", 400);
    }

    seller = item.seller;
    totalAmount = item.price * (quantity || 1);
  } else if (orderType === "service") {
    if (!service) {
      throw new AppError("Service ID is required for service orders", 400);
    }

    item = await Service.findById(service).populate("provider");
    if (!item) {
      throw new AppError("Service not found", 404);
    }

    if (!item.isAvailable) {
      throw new AppError("Service is not available", 400);
    }

    seller = item.provider;
    totalAmount = item.price;
  } else {
    throw new AppError("Invalid order type", 400);
  }

  // Check if buyer is not the seller
  if (seller._id.toString() === req.user._id.toString()) {
    throw new AppError("You cannot order your own items", 400);
  }

  // Create order
  const orderData = {
    buyer: req.user._id,
    seller: seller._id,
    orderType,
    quantity: orderType === "product" ? quantity || 1 : 1,
    totalAmount,
    deliveryAddress: deliveryAddress || req.user.address,
    paymentMethod: paymentMethod || "cash",
    notes,
  };

  if (orderType === "product") {
    orderData.product = product;
  } else {
    orderData.service = service;
  }

  const order = await Order.create(orderData);

  // Populate the created order
  await order.populate([
    { path: "buyer", select: "name email phone profilePicture" },
    { path: "seller", select: "name email phone profilePicture" },
    { path: "product", select: "title price images" },
    { path: "service", select: "title price images" },
  ]);

  // Create notification for seller
  await Notification.create({
    recipient: seller._id,
    title: "طلب جديد",
    message: `لديك طلب جديد من ${req.user.name}`,
    type: "order",
    relatedEntity: {
      entityType: "Order",
      entityId: order._id,
    },
    data: {
      orderId: order._id,
      orderType,
      buyerName: req.user.name,
    },
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Check authorization
  const isSeller = order.seller.toString() === req.user._id.toString();
  const isBuyer = order.buyer.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isSeller && !isBuyer && !isAdmin) {
    throw new AppError("Not authorized to update this order", 403);
  }

  // Validate status transitions
  const validTransitions = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "completed", "cancelled"],
    shipped: ["delivered", "cancelled"],
    delivered: ["completed"],
    completed: [],
    cancelled: [],
  };

  if (!validTransitions[order.status].includes(status)) {
    throw new AppError(
      `Cannot change status from ${order.status} to ${status}`,
      400
    );
  }

  // Check who can change to what status
  if (status === "cancelled") {
    // Both buyer and seller can cancel, but with restrictions
    if (order.status === "delivered" || order.status === "completed") {
      throw new AppError("Cannot cancel delivered or completed orders", 400);
    }
  } else if (["confirmed", "processing", "shipped"].includes(status)) {
    // Only seller can update to these statuses
    if (!isSeller && !isAdmin) {
      throw new AppError("Only seller can update to this status", 403);
    }
  } else if (status === "delivered") {
    // Only buyer can confirm delivery
    if (!isBuyer && !isAdmin) {
      throw new AppError("Only buyer can confirm delivery", 403);
    }
  }

  order.status = status;
  order.statusHistory.push({
    status,
    updatedBy: req.user._id,
    timestamp: new Date(),
  });

  // Update payment status for completed orders
  if (status === "completed" && order.paymentMethod === "cash") {
    order.paymentStatus = "paid";
  }

  await order.save();

  // Create notification for the other party
  const notificationRecipient = isSeller ? order.buyer : order.seller;
  const statusMessages = {
    confirmed: "تم تأكيد طلبك",
    processing: "جاري تحضير طلبك",
    shipped: "تم شحن طلبك",
    delivered: "تم تسليم الطلب",
    completed: "تم إكمال الطلب",
    cancelled: "تم إلغاء الطلب",
  };

  await Notification.create({
    recipient: notificationRecipient,
    title: "تحديث حالة الطلب",
    message: statusMessages[status],
    type: "order",
    relatedEntity: {
      entityType: "Order",
      entityId: order._id,
    },
    data: {
      orderId: order._id,
      status,
      updatedBy: req.user.name,
    },
  });

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus, transactionId } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Check authorization (seller, buyer, or admin)
  if (
    order.seller.toString() !== req.user._id.toString() &&
    order.buyer.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Not authorized to update payment status", 403);
  }

  order.paymentStatus = paymentStatus;
  if (transactionId) {
    order.paymentDetails.transactionId = transactionId;
  }
  order.paymentDetails.paidAt = paymentStatus === "paid" ? new Date() : null;

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Add order review/rating
// @route   POST /api/orders/:id/review
// @access  Private
const addOrderReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  // Only buyer can review and only for completed orders
  if (order.buyer.toString() !== req.user._id.toString()) {
    throw new AppError("Only buyer can review the order", 403);
  }

  if (order.status !== "completed") {
    throw new AppError("Can only review completed orders", 400);
  }

  if (order.review) {
    throw new AppError("Order already reviewed", 400);
  }

  order.review = {
    rating,
    comment,
    reviewedAt: new Date(),
  };

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
const getOrderStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const isAdmin = req.user.role === "admin";

  let matchStage = {};

  if (!isAdmin) {
    matchStage = {
      $or: [{ buyer: userId }, { seller: userId }],
    };
  }

  const stats = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        pendingOrders: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        },
        completedOrders: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        cancelledOrders: {
          $sum: { $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0] },
        },
        averageOrderValue: { $avg: "$totalAmount" },
      },
    },
  ]);

  // Get orders by status
  const ordersByStatus = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Get orders by type
  const ordersByType = await Order.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$orderType",
        count: { $sum: 1 },
      },
    },
  ]);

  // Recent orders
  const recentOrders = await Order.find(matchStage)
    .populate("buyer", "name")
    .populate("seller", "name")
    .populate("product", "title")
    .populate("service", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      summary: stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        averageOrderValue: 0,
      },
      ordersByStatus,
      ordersByType,
      recentOrders,
    },
  });
});

module.exports = {
  getAllOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  addOrderReview,
  getOrderStats,
};
