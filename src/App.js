import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Link } from 'react-router-dom'
import { ENDPOINT } from './Url';
const welcomeImagePath = process.env.PUBLIC_URL + '/Multichoice-GoTv.jpg';

const TokenPicker = () => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [generatedToken, setGeneratedToken] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        axios.defaults.headers.common['X-CSRF-TOKEN'] = csrftoken;
        console.log('CSRF Token:', csrftoken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleServiceSelection = (service) => {
    setSelectedService(service);
  };

  const handleProceed = () => {
    if (mobileNumber.trim() !== '') {
      setStep(2);
    } else {
      alert('Please enter a valid mobile number.');
    }
  };

  const handleGenerateToken = async () => {
   
      try {
        const formattedMobileNumber = `254${mobileNumber}`; // Prepend "254" to the entered mobile number
        const payload ={
          'mobile_number':formattedMobileNumber,
          'service':selectedService,
        }
        const response = await axios.post(`${ENDPOINT}/api/generate-token`, 
         payload
        );

        const { token } = response.data;


        setGeneratedToken(token);
        setStep(3);
      } catch (error) {
      
        console.error('Error generating token:', error);
        alert('SMS sent to your phone number, thank you.');
      }
    } 
  

  // const handleGenerateToken = async () => {
  //   if (selectedService !== '') {
  //     try {
  //       const formattedMobileNumber = `254${mobileNumber}`; // Prepend "254" to the entered mobile number
  //       const response = await axios.post(`${ENDPOINT}/api/generate-token`, {
  //         mobile_number: formattedMobileNumber,
  //         service: selectedService,
  //       });
  
  //       const { token } = response.data;
  
  //       setGeneratedToken(token);
  //       setStep(3);
  //     } catch (error) {
  //       console.error('Error generating token:', error);
  //       alert('SMS sent to your phone number, thank you.');
  //       setStep(3); // Set step to 3 even after the alert
  //     }
  //   } else {
  //     alert('Please select a service.');
  //   }
  // };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '30rem' }}>
        {step === 1 && (
          <div>
            <h6 className="text-center mb-3">Step 1: Please Enter Mobile Number To Get a Token</h6>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">254</span>
              </div>
              <input
                type="text"
                className="form-control rounded-pill"
                placeholder="Mobile Number (without '254')"
                value={mobileNumber}
                onChange={handleMobileNumberChange}
              />
            </div>
            <button className="btn btn-primary rounded-pill w-100" onClick={handleProceed}>
              Proceed
            </button>
          </div>
        )}

        {step === 2 && (
         
            <><div className='d-flex justify-content-center pull-right'>
              {/* <Link to="/operator-login">
            <button className='btn btn-primary'>Operator Login</button>
              </Link> */}
          </div><div>
              <h6 className="text-center mb-3">Step 2: Please Select The Service You Require</h6>
              <div className="mb-3 d-flex flex-column">
                <div className="mb-2">
                  <button className="btn btn-secondary mr-2" onClick={() => handleServiceSelection('General Enquiries')}>
                    General Enquiries
                  </button>&nbsp;
                  <button className="btn btn-secondary" onClick={() => handleServiceSelection('Decoder Renewal')}>
                    Decoder Renewal
                  </button>
                </div>
                <button className="btn btn-primary rounded-pill w-100" onClick={handleGenerateToken}>
                  Generate Token
                </button>
              </div>
            </div></>
        )}

        {step === 3 && generatedToken && (
          <div>
            <img src={welcomeImagePath} alt="Welcome" width="100" />
            <h2 className="text-center mb-3">Token Details</h2>
            <p className="text-center">Token: {generatedToken}</p>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      {/* <h1 className="text-center mt-5">Token Picker</h1> */}
      <TokenPicker />
    </div>
  );
}

export default App;
