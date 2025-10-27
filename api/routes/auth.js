const express = require('express');
const authController = require('../controllers/authController');
const { protect, authorize, authRateLimit } = require('../middleware/auth');

const router = express.Router(); 

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-otp', authRateLimit, authController.sendPhoneOTP);
router.post('/verify-otp', authController.verifyPhoneOTP);

// Protected routes (authentication required)
router.use(protect); // All routes after this middleware are protected

router.post('/complete-profile', authController.completeProfile);
router.get('/me', authController.getMe);
router.patch('/update-profile', authController.updateProfile);
router.patch('/update-location', authController.updateLocation);
router.post('/logout', authController.logout);
router.delete('/deactivate', authController.deactivateAccount);

// Admin only routes
router.patch('/change-role', authorize('admin'), authController.changeUserRole);
router.get('/stats', authorize('admin'), authController.getUserStats);

module.exports = router;