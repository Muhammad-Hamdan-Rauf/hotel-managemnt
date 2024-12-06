import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { fetchAllGuests, fetchAvailableRooms, createBooking } from '../api'; // Assuming these API calls are available
import { differenceInDays } from 'date-fns'; // To calculate the difference in days between dates
import { updateRoomStatus } from '../api'; // API function to update room status

const CheckIn = () => {
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [totalAmount, setTotalAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const guestsResponse = await fetchAllGuests(); // Fetch all guests
        const roomsResponse = await fetchAvailableRooms(); // Fetch all rooms
        setGuests(guestsResponse.data.guests);
        if (roomsResponse) setRooms(roomsResponse.data.availableRooms);
        else setError('No rooms Available');
      } catch (err) {
        setError('Failed to load data.');
      }
    };
    loadData();
  }, []);

  // Function to handle the change in check-out date
  const handleCheckOutChange = (newDate) => {
    setCheckOutDate(newDate);
    
    if (checkInDate && newDate) {
      const daysDifference = differenceInDays(newDate, checkInDate);
      
      if (daysDifference <= 0) {
        setError('Check-out date must be later than check-in date');
        setTotalAmount('');
        return;
      }

      const selectedRoomData = rooms.find(room => room._id === selectedRoom);
      if (selectedRoomData) {
        const calculatedAmount = daysDifference * selectedRoomData.price;
        setTotalAmount(calculatedAmount);
      }
    }
  };

  const handleCheckIn = async () => {
    if (!selectedGuest || !selectedRoom || !checkInDate || !checkOutDate || !totalAmount) {
      setError('Please fill all fields correctly.');
      return;
    }
    
    setLoading(true);
    try {
      // Create booking data
      const bookingData = {
        guest: selectedGuest,
        room: selectedRoom,
        checkInDate,
        checkOutDate,
        totalAmount,
        status: 'Confirmed',
      };
      
      const response = await createBooking(bookingData); // API call to create booking

      // After successful booking, update room status to 'Occupied'
      if (response.status === 200) {
        await updateRoomStatus(selectedRoom, { status: 'Occupied' });

        // Clear all fields after successful booking
        setSelectedGuest('');
        setSelectedRoom('');
        setCheckInDate(null);
        setCheckOutDate(null);
        setTotalAmount('');
        
        // Reload rooms to get the updated list of available rooms
        const roomsResponse = await fetchAvailableRooms(); // Re-fetch rooms after booking
        if (roomsResponse) setRooms(roomsResponse.data.availableRooms);
        else setError('No rooms Available');

        setLoading(false);
        setError(''); // Clear error
        alert('Booking created successfully!');
      }
    } catch (err) {
      setLoading(false);
      setError('Failed to create booking.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Check In
      </Typography>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Guest Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Guest</InputLabel>
              <Select
                value={selectedGuest}
                onChange={(e) => setSelectedGuest(e.target.value)}
                label="Guest"
              >
                {guests.map((guest) => (
                  <MenuItem key={guest._id} value={guest._id}>
                    {guest.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Room Selection */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Room</InputLabel>
              <Select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                label="Room"
              >
                {rooms.map((room) => (
                  <MenuItem key={room._id} value={room._id}>
                    {room.roomNumber} - {room.category} - ${room.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Check-In Date */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Check In Date"
                inputFormat="MM/dd/yyyy"
                value={checkInDate}
                onChange={(newDate) => setCheckInDate(newDate)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Check-Out Date */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label="Check Out Date"
                inputFormat="MM/dd/yyyy"
                value={checkOutDate}
                onChange={handleCheckOutChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Total Amount */}
          <Grid item xs={12}>
            <TextField
              label="Total Amount"
              variant="outlined"
              fullWidth
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              sx={{ mb: 2 }}
              disabled
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckIn}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Check In'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={Boolean(error)}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      />
    </Box>
  );
};

export default CheckIn;
