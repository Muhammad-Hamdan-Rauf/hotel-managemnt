const Booking = require('../models/Booking'); // Import Booking model

// Add a new booking
exports.addBooking = async (req, res) => {
  try {
    const { guest, room, checkInDate, checkOutDate, totalAmount, status } = req.body;
    
    // Check if guest and room exist
    const newBooking = new Booking({
      guest,
      room,
      checkInDate,
      checkOutDate,
      totalAmount,
      status
    });

    await newBooking.save();
    res.status(200).json({
      message: 'Booking created successfully',
      booking: newBooking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Update an existing booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Expecting booking details in request body
    
    const updatedBooking = await Booking.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('guest').populate('room');
    res.status(200).json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).populate('guest').populate('room');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(id);
    
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
