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
import { fetchAllServiceRequests, updateServiceRequestStatus } from '../api'; // Adjust the import path as needed

const ServiceRequestManagement = () => {
  const [serviceRequestList, setServiceRequestList] = useState([]);
  const [filteredServiceRequestList, setFilteredServiceRequestList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const statuses = ['Pending', 'Completed'];

  useEffect(() => {
    const loadServiceRequests = async () => {
      try {
        const response = await fetchAllServiceRequests();
        if (response && response.data && response.data.serviceRequests) {
          setServiceRequestList(response.data.serviceRequests);
          setFilteredServiceRequestList(response.data.serviceRequests); // Initialize filtered list
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch service requests. Please try again.');
      }
    };
    loadServiceRequests();
  }, []);

  useEffect(() => {
    let updatedList = serviceRequestList.filter((request) =>
      Object.values(request)
        .join(' ')
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setFilteredServiceRequestList(updatedList);
  }, [serviceRequestList, searchQuery]);

  const handleStatusChange = async (requestId, newStatus) => {
    try {
      await updateServiceRequestStatus(requestId, newStatus);
      setServiceRequestList((prev) =>
        prev.map((request) =>
          request._id === requestId ? { ...request, status: newStatus } : request
        )
      );
    } catch (error) {
      setError(error.message || 'Failed to update service request status. Please try again.');
    }
  };

  const serviceRequestColumns = [
    { label: 'Guest Name', accessor: (row) => row.guest.name },
    { label: 'Service', accessor: (row) => row.service.name },
    { label: 'Request Date', accessor: (row) => new Date(row.requestDate).toLocaleString() },
    { label: 'Status', accessor: (row) => row.status },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Service Request Management
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

      {/* Service Request List in Table */}
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
              <TableCell>Guest Name</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Request Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServiceRequestList.map((request) => (
              <TableRow key={request._id}>
                <TableCell>{request.guest.name}</TableCell>
                <TableCell>{request.service.name}</TableCell>
                <TableCell>{new Date(request.requestDate).toLocaleString()}</TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={request.status}
                      onChange={(e) =>
                        handleStatusChange(request._id, e.target.value)
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

      {/* Mobile View for Service Requests */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {filteredServiceRequestList.map((request) => (
          <Paper key={request._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{request.guest.name}</Typography>
            <Typography>Service: {request.service.name}</Typography>
            <Typography>Request Date: {new Date(request.requestDate).toLocaleString()}</Typography>
            <Typography>Status:</Typography>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Status</InputLabel>
              <Select
                value={request.status}
                onChange={(e) => handleStatusChange(request._id, e.target.value)}
                label="Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

export default ServiceRequestManagement;
