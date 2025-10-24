const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/search', userController.searchUsers);
router.get('/nearby', userController.getNearbyUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/products', userController.getUserProducts);
router.get('/:id/services', userController.getUserServices);
router.get('/:id/orders', userController.getUserOrders);
router.get('/:id/reviews', userController.getUserReviews);
router.get('/:id/statistics', userController.getUserStatistics);

// Protected routes (Admin only)
router.use(protect);
router.use(authorize('admin'));

router.get('/', userController.getAllUsers);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/:id/toggle-block', userController.toggleUserBlock);

module.exports = router;