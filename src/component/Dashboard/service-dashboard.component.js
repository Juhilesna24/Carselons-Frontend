import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './service-dashboard.component.css';
import { toast } from 'react-toastify';
import Calendar from 'react-calendar'; // Import the calendar component


function App() {
  const [serviceCenter, setServiceCenter] = useState({});
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [showCalendarView, setShowCalendarView] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchServiceCenters();
  },[]);

  const fetchServiceCenters = () => {
    // Fetch service center details
    axios.get('http://localhost:3000/api/service-centers', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const firstServiceCenter = response.data; // Assuming you want to fetch details for the first service center
        setServiceCenter(firstServiceCenter);
        console.log('Service Center:', firstServiceCenter);
        fetchUpcomingBookings();
      })
      .catch(error => {
        console.error('Error fetching service center details:', error);
      });
  }

  const fetchUpcomingBookings = () => {
    // Fetch upcoming bookings using the retrieved service center's id
    axios.get(`http://localhost:3000/api/service-details/${serviceCenter.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setUpcomingBookings(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching upcoming bookings:', error);
      });
  }

  const updateBookingStatus = (bookingId, newStatus) => {
    // Update booking status
    axios.patch(`http://localhost:3000/api/service-centers/${bookingId}/status`, { status: newStatus }, {headers: {
      Authorization: `Bearer ${token}`
    }})
      .then(response => {
        toast.success(response.data.message);
         // Also update the status of the specific booking in the state
        fetchServiceCenters();
      })
      .catch(error => {
        console.error('Error updating booking status:', error);
      });
  };

  // Custom function to format time_slot for display
  const formatTimeSlot = (timeSlot) => {
    const [startTime, endTime] = timeSlot.split('-');
    return `${startTime.trim()} - ${endTime.trim()}`;
  }

  return (
    <div className="service-dashboard">
      <h1 className="card-title-booking">Service Center Dashboard</h1>

      {/* Display Service Center Details */}
      <div className="service-center-details">
        <h2>Service Center Details</h2>
        <p>Name: {serviceCenter.name}</p>
        <p>Location: {serviceCenter.location}</p>
        <p>Available Services: {serviceCenter.available_services && serviceCenter.available_services.join(', ')}</p>
        <p>Working Hours: {serviceCenter.working_hours && `${serviceCenter.working_hours.start_time} - ${serviceCenter.working_hours.close_time}`}</p>
        <button onClick={() => setShowCalendarView(!showCalendarView)}>
          {showCalendarView ? 'Close Calendar' : 'Calendar View'}
        </button>      </div>
      {/* Display Calendar View */}
      {showCalendarView && (
        <div className="calendar-view">
          <h2>Calendar View</h2>
          <Calendar
            showNeighboringMonth={false}
            value={new Date()}
            tileContent={({ date }) => {
              const formattedDate = date.toISOString().split('T')[0];

              // Get all time slots for the selected date
              const timeSlots = upcomingBookings
                .filter(each => {
                  const bookingDate = new Date(each.booking.date);
                  return (
                    bookingDate.toISOString().split('T')[0] === formattedDate
                  );
                })
                .map(each => formatTimeSlot(each.booking.time_slot))
                .join(', ');

              return (
                <div className={`day-tile ${timeSlots ? 'has-booking' : ''}`}>
                  {timeSlots && (
                    <div className="booking-details">
                      <p>{timeSlots}</p>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      )}


      {/* Display Upcoming Bookings */}
      {!showCalendarView && (
        <div className="upcoming-bookings">
        <h2>Upcoming Service Bookings</h2>
        <ul>
      
          {upcomingBookings.map(each => (
            <li key={each.booking.id}>
              <p>Service Type: {each.booking.service_type}</p>
              <p>Date: {each.booking.date}</p>
              <p>Time Slot: {each.booking.time_slot}</p>
              <p>Status: {each.booking.status}</p>
              {/* <p>Location: {each.booking.location}</p> */}
              <p>Vehicle: {each.vehicle.model}</p>
              <p></p>
              <button onClick={() => updateBookingStatus(each.booking.id, 'inprogress')}>Mark as In Progress</button>
              <button onClick={() => updateBookingStatus(each.booking.id, 'completed')}>Mark as Completed</button>
            </li>
          ))}
        </ul>
      </div>
      )}
      
    </div>
  );
}

export default App;
