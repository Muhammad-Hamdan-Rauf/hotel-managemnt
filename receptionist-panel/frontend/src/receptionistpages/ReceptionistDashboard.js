import React from 'react';
import { Box, Typography } from '@mui/material';

const ReceptionistDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography variant="h3" gutterBottom>
          Welcome to Receptionist Dashboard
        </Typography>
      </Box>

      {/* You can add additional content here for the dashboard */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h6">
          Your journey to manage guests, staff, and more starts here.
        </Typography>
      </Box>
    </Box>
  );
};

export default ReceptionistDashboard;
