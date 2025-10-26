const express = require('express');
const villageController = require('../controllers/villageController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', villageController.getAllVillages);
router.get('/search', villageController.searchVillages);
router.get('/nearby', villageController.getNearbyVillages);
router.get('/governorate/:governorate', villageController.getVillagesByGovernorate);
router.get('/:id', villageController.getVillage);

// Protected routes (admin only)
router.use(protect);
router.use(authorize('admin'));

router.post('/', villageController.createVillage);
router.patch('/:id', villageController.updateVillage);
router.delete('/:id', villageController.deleteVillage);
router.patch('/:id/admin', villageController.updateVillageAdmin);
router.get('/stats/admin', villageController.getVillageStats);

module.exports = router; 