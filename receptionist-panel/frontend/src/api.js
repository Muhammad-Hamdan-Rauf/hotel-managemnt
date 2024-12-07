import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/' });

// Custom error handler
const handleApiError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    switch (status) {
      case 400:
        return { message: data.message || 'Invalid request. Please check your input.', type: 'warning' };
      case 401:
        return { message: data.message || 'Authentication failed. Please log in again.', type: 'error' };
      case 403:
        return { message: data.message || 'You do not have permission to access this resource.', type: 'error' };
      case 404:
        return { message: data.message || 'The requested resource was not found.', type: 'warning' };
      case 500:
        return { message: 'Server error. Please try again later.', type: 'error' };
      default:
        return { message: data.message || 'An unexpected error occurred.', type: 'error' };
    }
  } else if (error.request) {
    return { message: 'No response received from server. Please check your network connection.', type: 'error' };
  } else {
    return { message: error.message || 'An unexpected error occurred.', type: 'error' };
  }
};

// Attach token to every request if available
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth API functions
export const login = async (formData) => {
  try {
    const response = await API.post('/auth/login', formData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const signup = async (formData) => {
  try {
    const response = await API.post('/auth/signup', formData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const googleLogin = async (credential) => {
  try {
    const response = await API.post('/auth/google', { credential });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Guest API functions
export const addGuest = async (guestData) => {
  try {
    const response = await API.post('/guests/add', guestData);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const editGuest = async (id, updates) => {
  try {
    const response = await API.put(`/guests/edit/${id}`, updates);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteGuest = async (id) => {
  try {
    const response = await API.delete(`/guests/delete/${id}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchAllGuests = async () => {
  try {
    const response = await API.get('/guests/all');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getGuestBookings = async (guestId) => {
  try {
    const response = await API.get(`/guests/${guestId}/bookings`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Guest API functions

// Fetch guest by ID (new function)
export const getGuestById = async (guestId) => {
  try {
    const response = await API.get(`/guests/${guestId}`);
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const fetchAllRoomsManage = async () => {
  try {
    const response = await API.get('/room-manage/all');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchAvailableRooms = async () => {
  try {
    const response = await API.get('/room-manage/available');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Room API functions
export const updateRoomStatus = async (roomId, updates) => {
  try {
    const response = await API.put(`/room-manage/updateStatus/${roomId}`, updates);
    return response;  // Returns the updated room data
  } catch (error) {
    throw handleApiError(error);
  }
};


// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await API.post('/bookings/create', bookingData);
    return response; // Returns the booking details
  } catch (error) {
    throw handleApiError(error);
  }
};


// Create a new booking
export const fetchBookings = async () => {
  try {
    const response = await API.get('/bookings/');
    return response; // Returns the booking details
  } catch (error) {
    throw handleApiError(error);
  }
};


// Fetch all service requests
export const fetchAllServiceRequests = async () => {
  try {
    const response = await API.get('/service-requests');
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update service request status
export const updateServiceRequestStatus = async (requestId, newStatus) => {
  try {
    const response = await API.patch(`/service-requests/${requestId}`, { status: newStatus });
    return response;
  } catch (error) {
    throw handleApiError(error);
  }
};
