import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { ENDPOINT } from './Url';
import io from 'socket.io-client';

const OperatorDashboard = () => {
  const [token, setToken] = useState('');
  const [user_id, setUserId] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentActiveToken, setCurrentActiveToken] = useState('');
  const [currentToken,setCurrentToken]=useState({})
  const storedUserId = localStorage.getItem('user_id');
  

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('user_id');

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      setIsLoading(false);
      fetchCurrentActiveToken(storedUserId);
      fetchTokens(); // Fetch tokens when token is available
    } else {
      console.error('Token or user_id not found.');
      setIsLoading(false); // Set isLoading to false to prevent infinite loading
    }
  }, []);



  // const socket = io('http://127.0.0.1:80');

const handleCallNext = async () => {
  try {
    const storedUserId = localStorage.getItem('user_id');

    if (!storedUserId) {
      console.error('User ID not found in local storage.');
      return;
    }

    const storedToken = localStorage.getItem('token'); // Fetch stored token here

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${storedToken}` // Use stored token here
      }
    };

    const response = await axios.put(`${ENDPOINT}/api/operator/call-next`, {}, config);

    console.log(response);
    console.log('Next token called:', response.data);

    if (response.data && response.data.tokens && response.data.tokens.length > 0) {
      const { id, mobile_number,service } = response.data.tokens[0];
      const display_mobile_number = `A${id.toString().padStart(3, '0')}-${mobile_number.substring(3)}`;
      
     

      const loggedInUserId = localStorage.getItem('user_id');
      const announcementText = `Ticket number ${display_mobile_number}, proceed to counter number ${loggedInUserId}`;

      if ('speechSynthesis' in window) {
        const synthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(announcementText);
        utterance.lang = 'en-US';
        synthesis.speak(utterance);
        console.log('Speech synthesis triggered:', announcementText);
      } else {
        console.log('Speech synthesis is not supported in your browser.');
      }
    } else {
      setCurrentActiveToken('No active token');
    }

    window.location.reload();

    // Emit a socket event after successfully calling the next token
    // socket.emit('callNextToken', { message: 'Next token called' });
  } catch (error) {
    console.error('Error calling next token:', error);
  }
};

useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUserId = localStorage.getItem('user_id');

  if (storedToken && storedUserId) {
    setToken(storedToken);
    setUserId(storedUserId);
    setIsLoading(false);
    fetchCurrentActiveToken(storedUserId);
    fetchTokens(); // Fetch tokens when token is available
  } else {
    console.error('Token or user_id not found.');
    setIsLoading(false); // Set isLoading to false to prevent infinite loading
  }
}, []);

  
  // // Listening to socket events
  // socket.on('audio-call-channel', (data) => {
  //   // Handle incoming socket events, if required
  //   console.log('Received socket event:', data);
  //   // Perform actions based on the received data
  // });
  

  const handleCompleteService = async () => {
    try {
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const data = {
        token_id: tokenId
      };

      const response = await axios.put(`${ENDPOINT}/api/operator/complete`, data, config);

      console.log(response);
      console.log('Service Completed:', response.data);
      window.location.reload();
    } catch (error) {
      console.error('Error completing service:', error);
    }
  };


  const fetchProcessingToken = async () => {
    setIsLoading(true)
    try {
      const storedToken = localStorage.getItem('token');
  
      if (!storedToken) {
        console.error('Token not found.');
        return;
      }
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }
      };
  
      const response = await axios.get(`${ENDPOINT}/api/operator/processing-token/${storedUserId}`, config);
  
      const data = response.data;
      setIsLoading(false)
      setCurrentToken(data.last_token);
    } catch (error) {
      console.error('Error fetching service:', error);
    }
  };
  
  useEffect(() => {
    fetchProcessingToken();
  }, []);
  



  useEffect(()=>{
fetchProcessingToken()
  },[])

console.log(currentToken)

  const fetchTokens = async () => {
    try {
      const response = await axios.get(`${ENDPOINT}/api/operator/tokens`);

      if (response && response.data && response.data.tokens) {
        const modifiedTokens = response.data.tokens.map(token => {
          return {
            ...token,
            display_mobile_number: `A${token.id.toString().padStart(3, '0')}-${token.mobile_number.substring(3)}`,
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

  const fetchCurrentActiveToken = async () => {
    try {
     
  
      if (!storedUserId) {
        setCurrentActiveToken('No user ID found');
        return;
      }
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
  
      const response = await axios.get(`${ENDPOINT}/api/operator/active-token/${storedUserId}`, config);
  
      if (response && response.data && response.data.token) {
        setCurrentActiveToken(response.data.token);
      } else {
        setCurrentActiveToken('No active token found');
      }
    } catch (error) {
      console.error('Error fetching current active token:', error);
      setCurrentActiveToken('No active token found');
    }
  };
  
  
  const formattedTokenId = `A${String(currentToken.id).padStart(3, '0')}`;
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Operator Dashboard</h2>
      <div>
        {/* <p>Current Active: {currentActiveToken}</p> */}
      </div>
      <div className="mb-3">
        <button className="btn btn-primary mr-2" onClick={handleCallNext}>Call Next</button>
        <button className="btn btn-success" onClick={handleCompleteService}>Complete Service</button>
      </div>
      <div className="form-group">
       
      </div>
      <h3>Current Active Token : {isLoading?"Loading..":formattedTokenId}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Service</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={index}>
              <td>{token.display_mobile_number}</td>
              <td>{token.service}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperatorDashboard;
