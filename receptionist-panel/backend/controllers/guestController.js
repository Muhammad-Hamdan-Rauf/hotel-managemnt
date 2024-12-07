const User = require('../models/User'); // The User model
const Booking = require('../models/Booking'); // The Booking model
const Room = require('../models/Room'); // Assuming you have a Room model

// Create a new guest (actually creates a User with role 'Guest')
exports.createGuest = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Create a new user for the guest
    const user = await User.create({ name, email, phoneNumber, password, role: 'Guest' });

    res.status(201).json({ message: 'Guest created successfully', guest: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create guest. Please try again later.' });
  }
};

// Edit guest details
exports.editGuest = async (req, res) => {
  try {
    const guestId = req.params.id;
    const { name, email, phoneNumber } = req.body;

    const guest = await User.findByIdAndUpdate(
      guestId,
      { name, email, phoneNumber },
      { new: true } // Return the updated user
    );
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.status(200).json({ message: 'Guest updated successfully', guest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update guest. Please try again later.' });
  }
};

// Delete a guest
exports.deleteGuest = async (req, res) => {
  try {
    const guestId = req.params.id;

    const guest = await User.findByIdAndDelete(guestId);
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    // Optionally, delete associated bookings if needed
    await Booking.deleteMany({ guest: guestId }); // Deletes all bookings associated with this guest
    
    res.status(200).json({ message: 'Guest deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete guest. Please try again later.' });
  }
};

// Fetch all guests
exports.getAllGuests = async (req, res) => {
  try {
    // Fetch all guests (Users with role 'Guest')
    const guests = await User.find({ role: 'Guest' });

    res.status(200).json({ guests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch guests. Please try again later.' });
  }
};

// Get a guest's booking history
exports.getGuestBookings = async (req, res) => {
  try {
    const guestId = req.params.id;

    // Fetch all bookings for the specific guest (use the guest's User ID)
    const bookings = await Booking.find({ guest: guestId })
      .populate('room') // Populate the associated Room details
      .populate('checkInDate') // Populate the receptionist who checked in the guest
      .populate('checkOutDate')
      .populate('totalAmount')
      .populate('status');

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this guest' });
    }

    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch booking history. Please try again later.' });
  }
};


// Fetch guest by ID
exports.getGuestById = async (req, res) => {
  try {
    const guestId = req.params.id;

    // Find guest by ID
    const guest = await User.findById(guestId);

    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }

    res.status(200).json({ guest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch guest details. Please try again later.' });
  }
};