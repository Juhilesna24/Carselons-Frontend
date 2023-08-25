import React, { useState } from 'react';
import './login.component.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Update the handleLogin function in your LoginPage component
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post('http://localhost:3000/api/login', {
        email,
        password
      });

      console.log(response, 'res0p');
      // Assuming response contains data for success or failure
      if (response.data.success) {
        console.log(response.data.success);
        localStorage.setItem('token', response.data.token); // Store the token in localStorage
        toast.success('Login successful');

        // Redirect based on role
        if (response.data.user.role === 'user') {
          navigate('/user-dashboard'); // Correct route name
        } else if (response.data.user.role === 'service_center') {
          navigate('/service-dashboard'); // Correct route name
        }
      
        // Redirect to dashboard or other pages
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>
        <form className="login-form">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="login-button" onClick={handleLogin}>Log In</button>
        </form>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p> {/* Add Link to Signup page */}
      </div>
    </div>
  );
};

export default LoginPage;
