const ServiceRequest = require('../models/ServiceRequest'); // ServiceRequest model
const User = require('../models/User'); // User model to reference guest
const Service = require('../models/Service'); // Service model to reference services

// Fetch all service requests
exports.getAllServiceRequests = async (req, res) => {
  try {
    const serviceRequests = await ServiceRequest.find()
      .populate('guest') // Populate guest details
      .populate('service'); // Populate service details

    res.status(200).json({ serviceRequests });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch service requests. Please try again later.' });
  }
};

// Fetch a service request by ID
exports.getServiceRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceRequest = await ServiceRequest.findById(id)
      .populate('guest')
      .populate('service');

    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found.' });
    }

    res.status(200).json({ serviceRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch the service request. Please try again later.' });
  }
};

// Create a new service request
exports.createServiceRequest = async (req, res) => {
  const { guestId, serviceId } = req.body;
  try {
    const guest = await User.findById(guestId);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found.' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    const newServiceRequest = new ServiceRequest({
      guest: guestId,
      service: serviceId,
      status: 'Pending',
    });

    await newServiceRequest.save();
    res.status(201).json({ message: 'Service request created successfully', serviceRequest: newServiceRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create service request. Please try again later.' });
  }
};

// Update the status of a service request
exports.updateServiceRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Pending', 'Completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value. Must be "Pending" or "Completed".' });
  }

  try {
    const updatedServiceRequest = await ServiceRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated service request
    ).populate('guest').populate('service');

    if (!updatedServiceRequest) {
      return res.status(404).json({ message: 'Service request not found.' });
    }

    res.status(200).json({ message: 'Service request status updated successfully', serviceRequest: updatedServiceRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update service request status. Please try again later.' });
  }
};

// Delete a service request
exports.deleteServiceRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const serviceRequest = await ServiceRequest.findByIdAndDelete(id);
    if (!serviceRequest) {
      return res.status(404).json({ message: 'Service request not found.' });
    }
    res.status(200).json({ message: 'Service request deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete service request. Please try again later.' });
  }
};
