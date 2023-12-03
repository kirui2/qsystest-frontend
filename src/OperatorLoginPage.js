import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINT } from './Url';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const OperatorLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${ENDPOINT}/api/operator/login`, {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_id', response.data.user_id);
        navigate('/dashboard'); // Redirect to Dashboard on successful login
      } else {
        console.log('Unable to login');
        // Handle unsuccessful login (display error message or retry)
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error scenarios
    }
  };

  return (
    <div className='container mt-5'>
      <div className='row justify-content-center'>
        <div className='col-lg-4 col-md-6 col-sm-8'>
          <div className='card p-4'>
            <h2 className='text-center mb-4'>Operator Login</h2>
            <form>
              <div className='mb-3'>
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  className='form-control'
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  className='form-control'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className='d-grid gap-2'>
                <button onClick={handleLogin} className='btn btn-primary' type='button'>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperatorLoginPage;
