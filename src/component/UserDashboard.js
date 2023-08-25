import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    mileage: ''
  });

  const [newBooking, setNewBooking] = useState({
    serviceType: '',
    date: '',
    timeSlot: '',
    serviceCenter: ''
  });

  useEffect(() => {
    // Fetch user's bookings from the backend and update 'bookings' state
    const fetchedBookings = [
      {
        id: 1,
        date: "12/01/2023",
        timeSlot: '8-9AM',
        serviceType: "wash",
        serviceCenter: {
          name: "juhi",
          status: "booked"
        }
      },
      {
        id: 1,
        date: "12/01/2023",
        timeSlot: '8-9AM',
        serviceType: "wash",
        serviceCenter: {
          name: "juhi",
          status: "booked"
        }
      },
      {
        id: 1,
        date: "12/01/2023",
        timeSlot: '8-9AM',
        serviceType: "wash",
        serviceCenter: {
          name: "juhi",
          status: "booked"
        }
      },
      {
        id: 1,
        date: "12/01/2023",
        timeSlot: '8-9AM',
        serviceType: "wash",
        serviceCenter: {
          name: "juhi",
          status: "booked"
        }
      },
      {
        id: 1,
        date: "12/01/2023",
        timeSlot: '8-9AM',
        serviceType: "wash",
        serviceCenter: {
          name: "juhi",
          status: "booked"
        }
      },
      {
        id: 1,
        date: "12/01/2023",
        timeSlot: '8-9AM',
        serviceType: "wash",
        serviceCenter: {
          name: "juhi",
          status: "booked"
        }
      }
    ];

    setBookings(fetchedBookings);

    const fetchVehicles = [
      {
        make: '2010',
        model: '2009',
        year: '2018',
        mileage: '70000'
      }
    ];

    setVehicleDetails(fetchVehicles[0]);

    // Fetch user's vehicle details from the backend and update 'vehicleDetails' state
    // ...
  }, []);

  const handleVehicleDetailsChange = (event) => {
    const { name, value } = event.target;
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleNewBookingChange = (event) => {
    const { name, value } = event.target;
    setNewBooking((prevBooking) => ({
      ...prevBooking,
      [name]: value
    }));
  };

  const handleBookingSubmit = (event) => {
    event.preventDefault();

    // Submit the new booking to the backend
    // ...

    // Clear the form fields
    setNewBooking({
      serviceType: '',
      date: '',
      timeSlot: '',
      serviceCenter: ''
    });
  };

  const handleVehicleDetailsSubmit = (event) => {
    event.preventDefault();

    // Submit the new booking to the backend
    // ...

    // Clear the form fields
    setVehicleDetails({
      make: '',
      model: '',
      year: '',
      mileage: ''
    });
  };



  return (
    <div className="welcome-container">
      <h1 className="welcome-heading">Welcome to User Dashboard!</h1>
      <p className="welcome-message">Explore your dashboard features here.</p>
      <h2>Upcoming and Past Service Bookings</h2>
      <div className='user-div'>
        <ul className="booking-list">
          {bookings.map(booking => (
            <li key={booking.id} className="booking-item">
              <p>Date: {booking.date}</p>
              <p>Time Slot: {booking.timeSlot}</p>
              <p>Service Type: {booking.serviceType}</p>
              <p>Service Center: {booking.serviceCenter.name}</p>
              <p>Status: {booking.serviceCenter.status}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="booking-service">
        <h2>Book a New Service</h2>
        <form className="form-container" onSubmit={handleBookingSubmit}>
          <label>
            Service Type:
            <input
              type="text"
              name="serviceType"
              value={newBooking.serviceType}
              onChange={handleNewBookingChange}
            />
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={newBooking.date}
              onChange={handleNewBookingChange}
            />
          </label>
          <label>
            Time Slot:
            <input
              type="text"
              name="timeSlot"
              value={newBooking.timeSlot}
              onChange={handleNewBookingChange}
            />
          </label>
          <label>
            Service Center:
            <input
              type="text"
              name="serviceCenter"
              value={newBooking.serviceCenter}
              onChange={handleNewBookingChange}
            />
          </label>
          <button type="submit">Book Service</button>
        </form>
      </div>
      <div className="booking-service">
        <h2>Update Vehicle Details</h2>
        <form className="form-container" onSubmit={handleVehicleDetailsSubmit}>
          <label>
            Make:
            <input
              type="text"
              name="make"
              value={vehicleDetails.make}
              onChange={handleVehicleDetailsChange}
            />
          </label>
          <label>
            Model:
            <input
              type="text"
              name="model"
              value={vehicleDetails.model}
              onChange={handleVehicleDetailsChange}
            />
          </label>
          <label>
            Year:
            <input
              type="text"
              name="year"
              value={vehicleDetails.year}
              onChange={handleVehicleDetailsChange}
            />
          </label>
          <label>
            Mileage:
            <input
              type="text"
              name="mileage"
              value={vehicleDetails.mileage}
              onChange={handleVehicleDetailsChange}
            />
          </label>
          <button type="submit">Update Vehicle Details</button>
        </form>
      </div>
    </div>
  );
}

export default UserDashboard;
