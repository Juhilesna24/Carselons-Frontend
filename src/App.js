import React from 'react';
import Login from './component/Login/login.component';
import Signup from './component/signup/signup.component';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserDashboard from './component/UserDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Router>
        <ToastContainer /> {/* Add ToastContainer here */}
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          {/* Other routes */}
        </Routes>
      </Router>
      </header>
    </div>
  );
}

export default App;
