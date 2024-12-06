import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { addGuest, editGuest, deleteGuest, fetchAllGuests, getGuestBookings } from '../api'; // Adjust the import path as needed

const GuestManagement = () => {
  const [guestList, setGuestList] = useState([]);
  const [filteredGuestList, setFilteredGuestList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ field: '', direction: '' });
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [viewBookingsDialog, setViewBookingsDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [guestBookings, setGuestBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGuests = async () => {
      try {
        const response = await fetchAllGuests();
        if (response && response.data && response.data.guests) {
          setGuestList(response.data.guests);
          setFilteredGuestList(response.data.guests); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch guest data. Please try again.');
      }
    };
    loadGuests();
  }, []);

  useEffect(() => {
    let updatedList = guestList.filter((guest) =>
      Object.values(guest)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    if (sortConfig.field) {
      updatedList = updatedList.sort((a, b) => {
        const aField = a[sortConfig.field];
        const bField = b[sortConfig.field];
        if (sortConfig.direction === 'asc') {
          return aField > bField ? 1 : -1;
        } else {
          return aField < bField ? 1 : -1;
        }
      });
    }

    setFilteredGuestList(updatedList);
  }, [guestList, searchQuery, sortConfig]);

  const handleOpenDialog = (guest = null) => {
    setEditingGuest(guest);
    setNewGuest(guest ? { ...guest } : { name: '', email: '', phoneNumber: '', password: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGuest(null);
    setError('');
  };

  const handleViewBookings = async (guestId) => {
    try {
      const response = await getGuestBookings(guestId);
      const bookings = response.data.bookings;
  
      // Process and format booking data if necessary, to make it easier to display
      const formattedBookings = bookings.map((booking) => ({
        ...booking,
        checkInTime: booking.checkInDate
          ? new Date(booking.checkInDate).toLocaleString()
          : 'Not available',
        checkOutTime: booking.checkOutDate
          ? new Date(booking.checkOutDate).toLocaleString()
          : 'Not available',
        room: booking.room?.roomNumber || 'No room data',
        totalAmount: booking.checkOutDetails?.settledAmount || booking.totalAmount,
        status: booking.status || 'No status',
      }));
  
      setGuestBookings(formattedBookings);
      setViewBookingsDialog(true);
    } catch (error) {
      setError(error.message || 'Failed to fetch booking history. Please try again.');
    }
  };

  const handleSaveGuest = async () => {
    try {
      if (editingGuest) {
        const updatedGuest = await editGuest(editingGuest._id, newGuest);
        setGuestList((prev) =>
          prev.map((guest) => (guest._id === editingGuest._id ? updatedGuest.data.guest : guest))
        );
      } else {
        const addedGuest = await addGuest(newGuest);
        setGuestList((prev) => [...prev, addedGuest.data.guest]);
      }
      handleCloseDialog();
    } catch (error) {
      setError(error.message || 'Failed to save guest data. Please try again.');
    }
  };

  const handleDeleteGuest = async (id) => {
    try {
      await deleteGuest(id);
      setGuestList((prev) => prev.filter((guest) => guest._id !== id));
    } catch (error) {
      setError(error.message || 'Failed to delete guest. Please try again.');
    }
  };

  const handleSortChange = (field) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const guestColumns = [
    { label: 'Name', accessor: (row) => row.name },
    { label: 'Email', accessor: (row) => row.email },
    { label: 'Phone Number', accessor: (row) => row.phoneNumber },
  ];

return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Guest Management
        </Typography>
      </Box>



      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%',
            maxWidth: 400,
            '& .MuiOutlinedInput-root': { borderRadius: '50px' },
          }}
        />
      </Box>

      {/* Sorting Combo Box */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortConfig.field}
            onChange={(e) => handleSortChange(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="phoneNumber">Phone Number</MenuItem>
          </Select>
        </FormControl>
      </Box>

        {/* Mobile View for Staff List */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredGuestList.map((guest) => (
          <Paper key={guest._id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{guest.name}</Typography>
              <Typography>{guest.email}</Typography>
              <Typography>{guest.phoneNumber}</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                <IconButton color="primary" onClick={() => handleOpenDialog(guest)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="info" onClick={() => handleViewBookings(guest._id)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteGuest(guest._id)}>
                  <DeleteIcon />
                </IconButton>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Responsive Table for Desktop */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          display: { xs: 'none', md: 'block' },
          overflowX: 'auto',
          borderRadius: '12px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Table>
        <TableHead
            sx={{
              backgroundColor: '#333', // Dark header background
              '& th': {
                color: '#fff', // White text color
                fontWeight: 'bold', // Make the text bold
                textAlign: 'center',
              },
            }}
          >
            <TableRow>
              <TableCell>
                <Button onClick={() => handleSortChange('name')} sx={{ color: '#fff' }}>Name</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('email')} sx={{ color: '#fff' }}>Email</Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleSortChange('phoneNumber')} sx={{ color: '#fff' }}>Phone Number</Button>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuestList.map((guest) => (
              <TableRow key={guest._id}>
                <TableCell>{guest.name}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>{guest.phoneNumber}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(guest)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="info" onClick={() => handleViewBookings(guest._id)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteGuest(guest._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


      {/* Add/Edit Guest Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              variant="outlined"
              value={newGuest.name}
              onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              value={newGuest.email}
              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              value={newGuest.phoneNumber}
              onChange={(e) => setNewGuest({ ...newGuest, phoneNumber: e.target.value })}
              fullWidth
            />
            
            <TextField

              label="Password"
              variant="outlined"
              value={newGuest.password}
              onChange={(e) => setNewGuest({ ...newGuest, password: e.target.value })}
              fullWidth
              type="password"
              
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleSaveGuest} color="primary">{editingGuest ? 'Save Changes' : 'Add Guest'}</Button>
        </DialogActions>
      </Dialog>
      {/* Booking History dialog */}
      
       <Dialog open={viewBookingsDialog} onClose={() => setViewBookingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Booking History</DialogTitle>
        <DialogContent>
          <Box>
            {guestBookings.length === 0 ? (
              <Typography>No bookings available for this guest.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Room</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Check-in Time</TableCell>
                    <TableCell>Check-out Time</TableCell>
                    <TableCell>Total Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {guestBookings.map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>{booking.room}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>{booking.checkInTime}</TableCell>
                      <TableCell>{booking.checkOutTime}</TableCell>
                      <TableCell>{booking.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewBookingsDialog(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      {error && (
        <Snackbar
          open={!!error}
          onClose={() => setError('')}
          autoHideDuration={6000}
          message={error}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      )}
    </Box>
  );
};

export default GuestManagement;
