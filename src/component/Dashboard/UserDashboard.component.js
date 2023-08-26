import React, { useState, useEffect } from 'react';
import './UserDashboard.component.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';

const UserDashboard = () => {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState();
  const [selectedDate, setSelectedDate] = useState(null);
  const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedServiceCenterId, setSelectedServiceCenterId] = useState();
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    mileage: ''
  });
  const [selectedUpdateVehicleId, setSelectedUpdateVehicleId] = useState('');
const [selectedUpdateVehicle, setSelectedUpdateVehicle] = useState({
  make: '',
  model: '',
  year: '',
  mileage: ''
});

const handleUpdateVehicleSelect = (vehicleId) => {
  const selectedVehicle = vehicles.find(vehicle => vehicle.id === parseInt(vehicleId));
  setSelectedUpdateVehicleId(vehicleId);
  setSelectedUpdateVehicle(selectedVehicle);
};

const handleUpdateInputChange = (field, value) => {
  setSelectedUpdateVehicle(prevState => ({
    ...prevState,
    [field]: value
  }));
};

const handleUpdateVehicle = async () => {
  try {
    setIsLoading(true);
    const response = await axios.patch(`http://localhost:3000/api/vehicles/${selectedUpdateVehicleId}`, selectedUpdateVehicle, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.success) {
      toast.success(response.data.message);
      setSelectedUpdateVehicleId('');
      setSelectedUpdateVehicle({
        make: '',
        model: '',
        year: '',
        mileage: ''
      });
      fetchVehicles();
    } else {
      toast.error(response.data.message);
    }
  } catch (error) {
    console.log(error.response.data.message);
    toast.error(error.response.data.message);
  } finally {
    setIsLoading(false);
  }
};




  useEffect(() => {
    console.log(selectedDate)
    if (selectedDate && selectedServiceCenterId) {
      fetchAvailableTimeSlots();
    }
    fetchBookings();
    fetchVehicles();
    fetchServiceCenters();
  }, [selectedDate, selectedServiceCenterId]);
  const token = localStorage.getItem('token');
  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/bookings', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const bookings = response.data.data;
      const upcoming = bookings.filter(each => (each.booking.status === 'pending' || each.booking.status === 'inprogress') && each.vehicle);
      console.log(upcoming, 'upcomming')
      const past = bookings.filter(each => each.booking.status === 'completed' && each.vehicle);

      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAvailableTimeSlots = async () => {
    try {
      const date = selectedDate.toISOString(); // Replace with desired date
      console.log(selectedDate, 'sekected')
      const response = await axios.get(`http://localhost:3000/api/service-centers/${selectedServiceCenterId}/available-time-slots?date=${date}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAvailableTimeSlots(response.data.availableTimeSlotsAfterBookings);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setVehicles(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchServiceCenters = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/service-centers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setServiceCenters(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedServiceCenterId('');
    setSelectedVehicleId('');
    setSelectedTimeSlot('');
  };

  const handleCreateBooking = async () => {
    try {
      setIsLoading(true); // Start loading
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
      const day = String(selectedDate.getDate()).padStart(2, '0');

      const selectedDateISO = `${year}-${month}-${day}`;
      console.log(selectedDateISO);
      const bookingData = {
        date: selectedDateISO,
        timeSlot: selectedTimeSlot,
        serviceType: selectedServiceType,
        serviceCenterId: parseInt(selectedServiceCenterId),
        vehicle_id: parseInt(selectedVehicleId)
      };

      const response = await axios.post('http://localhost:3000/api/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        toast.success(response.data.message);
        // Booking created successfully, you can update your state or take any other actions
        // Call fetchBookings() to refresh booking data
        resetForm(); // Reset form after successful booking
        fetchBookings();
      } else {
        toast.error(response.data.message);
        console.error('Booking creation failed');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleAddVehicle = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/vehicles', newVehicle, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        // Clear the form and fetch updated vehicle list
        setNewVehicle({
          make: '',
          model: '',
          year: '',
          mileage: ''
        });
        fetchVehicles();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="user-dashboard">
      {isLoading && <div>Loading...</div>} {/* Render loader if isLoading is true */}
      {upcomingBookings.length > 0 && (
        <div className="card upcoming-card">
          <h3 className="card-title-booking">Upcoming Bookings</h3>
          <div className="booking-cards">
            {upcomingBookings.map(booking => (
              <div className="booking-card" key={booking.booking.id}>
                <h4>Booking Details</h4>
                <p>Service Type: {booking.booking.service_type}</p>
                <p>Date: {new Date(booking.booking.date).toLocaleDateString()}</p>
                <p>Time Slot: {booking.booking.time_slot}</p>
                <p>Service Center: {booking.serviceCenter.name}</p>
                <p>Location: {booking.serviceCenter.location}</p>
                <p>Status: {booking.booking.status}</p>
                <h4>Vehicle Details</h4>
                <p>Make: {booking.vehicle.make}</p>
                <p>Model: {booking.vehicle.model}</p>
                <p>Year: {booking.vehicle.year}</p>
                <p>Mileage: {booking.vehicle.mileage}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {pastBookings && pastBookings.length > 0 && (
        <div className="card past-card">
          <h3 className="card-title-booking">Past Bookings</h3>
          <div className="booking-cards">
            {pastBookings.map(booking => (
              <div className="booking-card" key={booking.booking.id}>
                <h4>Booking Details</h4>
                <p>Service Type: {booking.booking.service_type}</p>
                <p>Date: {new Date(booking.booking.date).toLocaleDateString()}</p>
                <p>Time Slot: {booking.booking.time_slot}</p>
                <p>Service Center: {booking.serviceCenter.name}</p>
                <p>Location: {booking.serviceCenter.location}</p>
                <p>Status: {booking.booking.status}</p>
                <h4>Vehicle Details</h4>
                <p>Make: {booking.vehicle.make}</p>
                <p>Model: {booking.vehicle.model}</p>
                <p>Year: {booking.vehicle.year}</p>
                <p>Mileage: {booking.vehicle.mileage}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className='flex-display'>
      <div className="booking-form" style={{ paddingRight: '20px' }}>
        <h3 className='card-title'>Create Booking</h3>
        <div className="date-picker-container">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            placeholderText="Select a date"
            nextMonthButtonLabel="Next"
            previousMonthButtonLabel="Prev"
            style={{ zIndex: 9999 }} // Adjust the z-index as needed
          />
        </div>
        <select className='width100' value={selectedServiceCenterId} onChange={(e) => setSelectedServiceCenterId(e.target.value)}>
          <option value="">Select a Service Center</option>
          {serviceCenters.map(serviceCenter => (
            <option key={serviceCenter.id} value={serviceCenter.id}>
              {serviceCenter.name} - {serviceCenter.location}
            </option>
          ))}
        </select>

        {selectedServiceCenterId && (
          <select className='width100' value={selectedServiceType} onChange={(e) => setSelectedServiceType(e.target.value)}>
            <option value="">Select a Service Type</option>
            {serviceCenters
              .find(center => center.id == selectedServiceCenterId)
              ?.available_services.map(serviceType => (
                <option key={serviceType} value={serviceType}>
                  {serviceType}
                </option>
              ))}
          </select>
        )}

        <select className='width100' value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
          <option value="">Select a Vehicle</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </option>
          ))}
        </select>
        <select className='width100' value={selectedTimeSlot} onChange={(e) => setSelectedTimeSlot(e.target.value)}>
          <option value="">Select a Time Slot</option>
          {availableTimeSlots.map(timeSlot => (
            <option key={timeSlot} value={timeSlot}>{timeSlot}</option>
          ))}
        </select>
        <button className='width100' onClick={handleCreateBooking}>Create Booking</button>
      </div>
      {/* Add Vehicle Form */}
      <div className="add-vehicle-form" style={{ paddingLeft: '20px' }}>
        <h3>Add Vehicle</h3>
        <div className="input-group">
          <label>Make:</label>
          <input
            type="text"
            placeholder="Make"
            value={newVehicle.make}
            onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Model:</label>
          <input
            type="text"
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Year:</label>
          <input
            type="number"
            placeholder="Year"
            value={newVehicle.year}
            onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })}
          />
        </div>
        <div className="input-group">
          <label>Mileage:</label>
          <input
            type="number"
            placeholder="Mileage"
            value={newVehicle.mileage}
            onChange={(e) => setNewVehicle({ ...newVehicle, mileage: e.target.value })}
          />
        </div>
        <button className="add-vehicle-button" onClick={handleAddVehicle}>Add Vehicle</button>
      </div>
      <div className="add-vehicle-form" style={{ paddingLeft: '20px' }}>
  <h3>Update Vehicle</h3>
  <div className="input-group">
    <label>Select Vehicle:</label>
    <select value={selectedUpdateVehicleId} onChange={(e) => handleUpdateVehicleSelect(e.target.value)}>
      <option value="">Select a Vehicle</option>
      {vehicles.map(vehicle => (
        <option key={vehicle.id} value={vehicle.id}>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </option>
      ))}
    </select>
  </div>
  {selectedUpdateVehicleId && (
    <div>
      <div className="input-group">
        <label>Make:</label>
        <input
          type="text"
          value={selectedUpdateVehicle.make}
          onChange={(e) => handleUpdateInputChange('make', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Model:</label>
        <input
          type="text"
          value={selectedUpdateVehicle.model}
          onChange={(e) => handleUpdateInputChange('model', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Year:</label>
        <input
          type="number"
          value={selectedUpdateVehicle.year}
          onChange={(e) => handleUpdateInputChange('year', e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Mileage:</label>
        <input
          type="number"
          value={selectedUpdateVehicle.mileage}
          onChange={(e) => handleUpdateInputChange('mileage', e.target.value)}
        />
      </div>
      <button className="add-vehicle-button" onClick={handleUpdateVehicle}>Update Vehicle</button>
    </div>
  )}
</div>

      </div>
      
    </div>
  );
};

export default UserDashboard;
