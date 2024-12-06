import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { fetchAllRoomsManage, updateRoomStatus } from '../api'; // Adjust the import path as needed

const RoomManagement = () => {
  const [roomList, setRoomList] = useState([]);
  const [filteredRoomList, setFilteredRoomList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const statuses = ['Available', 'Occupied', 'Maintenance'];

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchAllRoomsManage();
        if (response && response.data && response.data.rooms) {
          setRoomList(response.data.rooms);
          setFilteredRoomList(response.data.rooms); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch room data. Please try again.');
      }
    };
    loadRooms();
  }, []);

  useEffect(() => {
    let updatedList = roomList.filter((room) =>
      Object.values(room)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setFilteredRoomList(updatedList);
  }, [roomList, searchQuery]);

  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await updateRoomStatus(roomId, { status: newStatus });
      setRoomList((prev) =>
        prev.map((room) =>
          room._id === roomId ? { ...room, status: newStatus } : room
        )
      );
    } catch (error) {
      setError(error.message || 'Failed to update room status. Please try again.');
    }
  };

  const roomColumns = [
    { label: 'Room Number', accessor: (row) => row.roomNumber },
    { label: 'Category', accessor: (row) => row.category },
    { label: 'Price', accessor: (row) => `$${row.price}` },
    { label: 'Status', accessor: (row) => row.status },
    { label: 'Description', accessor: (row) => row.description || 'N/A' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Room Management
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center', // Centers the search bar
          mb: 3,
        }}
      >
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: '100%', // Makes it responsive
            maxWidth: 400, // Sets a decent width
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px', // Adds rounded corners
            },
          }}
        />
      </Box>

      {/* Room Status Update in Table */}
      <TableContainer
        component={Paper}
        elevation={2}
        sx={{
          display: { xs: 'none', md: 'block' },
          overflowX: 'auto',
          borderRadius: '12px', // Adds rounded corners
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow for better UI
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: '#333', // Dark header background
              '& th': {
                color: '#fff', // White text color
                fontWeight: 'bold', // Make the text bold
                textAlign: 'left',
              },
            }}
          >
            <TableRow>
              <TableCell>Room Number</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRoomList.map((room) => (
              <TableRow key={room._id}>
                <TableCell>{room.roomNumber}</TableCell>
                <TableCell>{room.category}</TableCell>
                <TableCell>{room.price}</TableCell>

                <TableCell>{room.description}</TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={room.status}
                      onChange={(e) =>
                        handleStatusChange(room._id, e.target.value)
                      }
                      label="Status"
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Mobile View for Room List */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredRoomList.map((room) => (
          <Paper key={room._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{room.roomNumber}</Typography>
            <Typography>Category: {room.category}</Typography>
            <Typography>Price: ${room.price}</Typography>
            <Typography>Status:</Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={room.status}
                onChange={(e) => handleStatusChange(room._id, e.target.value)}
                label="Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography>Description: {room.description}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={Boolean(error)}
        message={error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      />
    </Box>
  );
};

export default RoomManagement;
