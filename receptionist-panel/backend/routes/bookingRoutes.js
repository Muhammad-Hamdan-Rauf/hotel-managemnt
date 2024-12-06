const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const receptionistMiddleware = require('../middlewares/receptionistMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(receptionistMiddleware);
router.use(logMiddleware);

// Route for adding a new booking
router.post('/create', bookingController.addBooking);

// Route for updating a booking
router.put('/edit/:id', bookingController.updateBooking);

// Route for fetching all bookings
router.get('/', bookingController.getAllBookings);

// Route for fetching booking details by ID
router.get('/:id', bookingController.getBookingById);

// Route for deleting a booking
router.delete('/delete/:id', bookingController.deleteBooking);

module.exports = router;
