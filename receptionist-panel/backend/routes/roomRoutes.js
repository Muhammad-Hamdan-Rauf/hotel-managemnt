const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController'); // Adjust the import path as needed
const authMiddleware = require('../middlewares/authMiddleware');
const receptionistMiddleware = require('../middlewares/receptionistMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(receptionistMiddleware);
router.use(logMiddleware);

// Define routes for room management
router.get('/all', roomController.getAllRooms);
router.get('/available', roomController.getAvailableRooms);
router.put('/updateStatus/:id', roomController.updateRoomStatus);

module.exports = router;