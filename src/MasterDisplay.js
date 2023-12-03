import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { ENDPOINT } from './Url';
const welcomeImagePath = process.env.PUBLIC_URL + '/Multichoice-GoTv.jpg';
const masterPageImage = process.env.PUBLIC_URL + '/Dstv-launch.jpg';

const MasterDisplay = () => {
  const [token, setToken] = useState('');
  const [user_id, setUserId] = useState('');
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      setIsLoading(false);
      fetchTokens(); // Fetch tokens when token is available
    } else {
      console.error('Token or user_id not found.');
      setIsLoading(false); // Set isLoading to false to prevent infinite loading
    }
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/api/operator/processing-tokens`);

      if (response && response.data && response.data.tokens) {
        const modifiedTokens = response.data.tokens.map(token => {
          return {
            ...token,
            display_mobile_number: `A${token.id.toString().padStart(3, '0')}`,
            counter: token.counter,
          };
        });
        setTokens(modifiedTokens);
        setIsLoading(false);
      } else {
        console.error('No tokens found in the response.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      
      <div className="row">
        <div className="col-md-6">
          <div className="text-center mt-4">
            <img src={masterPageImage} alt="Welcome" className="img-fluid" />
          </div>
        </div>
        <div className="col-md-6">
          <table className="table table-bordered table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">Counter</th>
                <th scope="col">Token</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token, index) => (
                <tr key={index}>
                <td>{token.counter}</td>
                <td>{token.display_mobile_number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="text-center mt-4">
        <marquee behavior="scroll" direction="left" style={{ width: "100%" }}>
          <img src={welcomeImagePath} alt="Welcome" width="100" />
          <span className="font-weight-bold ml-2">Enjoy SuperSport 3 For only Ksh 90</span>
        </marquee>
      </div>
    </div>
  );
};

export default MasterDisplay;
