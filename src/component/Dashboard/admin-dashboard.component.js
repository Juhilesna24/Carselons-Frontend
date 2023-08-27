import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './admin-dashboard.component.css'

function AdminDashboard() {
  const [serviceData, setServiceData] = useState([]);
  const [peakTimeData, setPeakTimeData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchServiceData(); // Call fetchServiceData to populate serviceData
      fetchPeakTimeData();
    }
  }, [token]);


  const fetchServiceData = () => {
    axios
      .get('http://localhost:3000/api/admin/static', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setServiceData(response.data.result);
        console.log(response.data.result)
      })
      .catch(error => {
        console.error('Error fetching service center statistics:', error);
      });
  };

  useEffect(() => {
    console.log(serviceData, 'service'); // Now this will log the updated serviceData
  }, [serviceData]); // Run this useEffect whenever serviceData changes

  const chartData = {
    labels: serviceData.map(item => item.service_center_name),
    datasets: [
      {
        label: 'Number of Services Booked',
        data: serviceData.map(item => item.num_of_services_booked),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  const fetchPeakTimeData = () => {
    axios
      .get('http://localhost:3000/api/admin/time-slot-static', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setPeakTimeData(response.data.result);
      })
      .catch(error => {
        console.error('Error fetching peak time statistics:', error);
      });
  };

  const lineChartData = {
    labels: peakTimeData.map(item => item.time_slot),
    datasets: [
      {
        label: 'Number of Bookings',
        data: peakTimeData.map(item => item.num_of_time_slot),
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const lineChartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Time Slot',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Bookings',
        },
      },
    },
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="display-flex">
        <div className="chart-container">
          <h2 className="card-title-booking">Service Center Statistics</h2>
          <div className="chart">
            {serviceData.length > 0 && <Bar data={chartData} options={options} />}
          </div>
        </div>
        <div className="chart-container">
          <h2 className="card-title-booking">Peak Time Statistics</h2>
          <div className="chart">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
