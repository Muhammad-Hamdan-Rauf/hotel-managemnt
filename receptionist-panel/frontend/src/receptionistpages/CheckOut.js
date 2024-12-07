import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, Grid, Snackbar, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchAllGuests, getGuestBookings, getGuestById, updateRoomStatus } from '../api'; // Make sure getGuestById is imported
import { jsPDF } from 'jspdf'; // To generate PDF invoices

const CheckOut = () => {
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestNames, setGuestNames] = useState({}); // Cache guest names by guest ID

  // Fetch guest list on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const guestsResponse = await fetchAllGuests();
        setGuests(guestsResponse.data.guests);
      } catch (err) {
        setError('Failed to load guests.');
      }
    };
    loadData();
  }, []);

  // Fetch bookings for the selected guest
  useEffect(() => {
    const loadBookings = async () => {
      if (selectedGuest) {
        try {
          const bookingsResponse = await getGuestBookings(selectedGuest);
          setBookings(bookingsResponse.data.bookings);
        } catch (err) {
          setError('Failed to load bookings.');
        }
      }
    };

    loadBookings();
  }, [selectedGuest]);

  // Fetch guest name by guest ID if not cached
  useEffect(() => {
    const fetchGuestName = async () => {
      if (selectedGuest && !guestNames[selectedGuest]) {
        try {
          const guestResponse = await getGuestById(selectedGuest);
          setGuestNames((prevNames) => ({
            ...prevNames,
            [selectedGuest]: guestResponse.data.guest.name,
          }));
        } catch (err) {
          setError('Failed to load guest name.');
        }
      }
    };

    fetchGuestName();
  }, [selectedGuest, guestNames]);

  // Function to generate the invoice
  const generateInvoice = (booking) => {
    const doc = new jsPDF();
    
    // Add title and details
    doc.setFontSize(18);
    doc.text('Invoice', 105, 10, null, null, 'center');
    
    const guestName = guestNames[booking.guest] || 'Guest Name Not Found'; // Fallback in case guest name is not loaded
    const roomNumber = booking.room.roomNumber;

    doc.setFontSize(12);
    doc.text(`Guest: ${guestName}`, 20, 30);
    doc.text(`Room Number: ${roomNumber}`, 20, 40);
    doc.text(`Check-In Date: ${booking.checkInDate}`, 20, 50);
    doc.text(`Check-Out Date: ${booking.checkOutDate}`, 20, 60);
    doc.text(`Total Amount: $${booking.totalAmount}`, 20, 70);

    // Save as PDF
    doc.save(`invoice_${roomNumber}.pdf`);
  };

  // Function to handle room check-out
  const handleCheckOut = async (booking) => {
    setLoading(true);
    try {
      // Update room status to available
      await updateRoomStatus(booking.room._id, { status: 'Available' });

      // Reload bookings after successful check-out
      const bookingsResponse = await getGuestBookings(selectedGuest);
      setBookings(bookingsResponse.data.bookings);
      
      setLoading(false);
      alert('Check-out successful!');
    } catch (err) {
      setLoading(false);
      setError('Failed to check-out.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Check Out
      </Typography>

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
      </Grid>

      {/* Bookings Table */}
      {selectedGuest && bookings.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Check-In Date</TableCell>
                <TableCell>Check-Out Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking.room.roomNumber}</TableCell>
                  <TableCell>{booking.checkInDate}</TableCell>
                  <TableCell>{booking.checkOutDate}</TableCell>
                  <TableCell>${booking.totalAmount}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => generateInvoice(booking)}
                    >
                      Generate Invoice
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ ml: 2 }}
                      onClick={() => handleCheckOut(booking)}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Check-Out'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Error Handling */}
      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
          message={error}
        />
      )}
    </Box>
  );
};

export default CheckOut;
