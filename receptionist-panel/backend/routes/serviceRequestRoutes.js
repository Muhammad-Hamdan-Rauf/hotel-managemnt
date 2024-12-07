const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/ServicesRequestController');
const authMiddleware = require('../middlewares/authMiddleware');
const receptionistMiddleware = require('../middlewares/receptionistMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(receptionistMiddleware);
router.use(logMiddleware);

// Routes for service request management
router.get('/', serviceRequestController.getAllServiceRequests); // Get all service requests
router.get('/:id', serviceRequestController.getServiceRequestById); // Get service request by ID
router.post('/', serviceRequestController.createServiceRequest); // Create a new service request
router.patch('/:id', serviceRequestController.updateServiceRequestStatus); // Update status of a service request
router.delete('/:id', serviceRequestController.deleteServiceRequest); // Delete a service request

module.exports = router;
