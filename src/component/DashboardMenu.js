import React from 'react';
import { Link } from 'react-router-dom';

function DashboardMenu() {
  return (
    <ul>
      <li><Link to="/user">User Dashboard</Link></li>
      <li><Link to="/service-center">Service Center Dashboard</Link></li>
      <li><Link to="/admin">Admin Dashboard</Link></li>
    </ul>
  );
}

export default DashboardMenu;
