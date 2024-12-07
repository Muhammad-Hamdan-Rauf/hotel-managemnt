const express = require('express');
const router = express.Router();
const { createGuest, editGuest, deleteGuest, getAllGuests, getGuestBookings, getGuestById } = require('../controllers/guestController');
const authMiddleware = require('../middlewares/authMiddleware');
const receptionistMiddleware = require('../middlewares/receptionistMiddleware');
const logMiddleware = require('../middlewares/logMiddleware');

// Apply authentication and admin middleware
router.use(authMiddleware);
router.use(receptionistMiddleware);
router.use(logMiddleware);

// Route to create a new guest
router.post('/add', createGuest);

// Route to edit an existing guest
router.put('/edit/:id', editGuest);

// Route to delete a guest
router.delete('/delete/:id', deleteGuest);

// Route to get all guests
router.get('/all', getAllGuests);

// Route to get a guest's booking history
router.get('/:id/bookings', getGuestBookings);  

router.get('/:id',getGuestById);


module.exports = router;
