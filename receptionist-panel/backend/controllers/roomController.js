const Room = require('../models/Room'); // Adjust the import path as needed


// Fetch all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch all available rooms
exports.getAvailableRooms = async (req, res) => {
    try {
        // Find rooms where the status is 'Available'
        const availableRooms = await Room.find({ status: 'Available' });

        if (availableRooms.length === 0) {
            return res.status(404).json({ message: 'No available rooms found' });
        }

        res.status(200).json({ availableRooms });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update room status
exports.updateRoomStatus = async (req, res) => {
    try {
        const { id } = req.params;  // Room ID from the URL
        const { status } = req.body; // Status from the request body

        // Check if the status is valid
        const validStatuses = ['Available', 'Occupied', 'Maintenance'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Find and update the room status
        const updatedRoom = await Room.findByIdAndUpdate(
            id, 
            { status }, // Update only the status
            { new: true } // Return the updated room
        );

        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({
            message: 'Room status updated successfully',
            room: updatedRoom
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
