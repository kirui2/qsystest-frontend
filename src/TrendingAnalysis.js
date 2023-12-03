import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import axios from 'axios';
import { ENDPOINT } from './Url';

const TrendingAnalysis = () => {
  const [pickedCount, setPickedCount] = useState(300);
  const [completedCount, setCompleteTokenCount] = useState(300);
  const [servedTokens, setTokensServed] = useState([]);
  const [projectedTokens, setProjectedTokens] = useState([]);
  const [analysis, setAnalysis] = useState([]);

  useEffect(() => {
    const fetchComparisons = async () => {
      const response = await axios.get(`${ENDPOINT}/api/token-comparison`);
      const { picked_tokens_count, completed_tokens_count } = response.data;
      setCompleteTokenCount(completed_tokens_count);
      setPickedCount(picked_tokens_count);
    };
    fetchComparisons();
  }, []);

  useEffect(() => {
    const fetchTokensServed = async () => {
      const response = await axios.get(`${ENDPOINT}/api/served-by-operators`);
      const data = response.data;
      setTokensServed(data.tokens_served_by_operators);
    };
    fetchTokensServed();
  }, []);

  useEffect(() => {
    const fetchProjection = async () => {
      const response = await axios.get(`${ENDPOINT}/api/trend-analysis`);
      const _analysis = response.data;
      setProjectedTokens(_analysis.predicted_tokens_by_midnight);
      setAnalysis(_analysis.tokens_by_hour);
    };
    fetchProjection();
  }, []);

  ChartJS.register(...registerables);

  const data = {
    labels: ['Picked Tokens Count', 'Completed Tokens Count'],
    datasets: [
      {
        data: [pickedCount, completedCount],
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
        hoverOffset: 4,
      },
    ],
  };

  const data2 = {
    labels: Array.from({ length: 24 }, (_, i) => i + 1),
    datasets: [
      {
        label: '',
        data: Array.from(
          { length: 24 },
          (_, i) => analysis.find((item) => item.hour === i + 1)?.token_count || 0
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <h2>Tokens served by Operator</h2>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">Teller ID</th>
                <th scope="col">Tokens Served</th>
              </tr>
            </thead>
            <tbody>
              {servedTokens.map((token, index) => (
                <tr key={index}>
                  <td>{token.counter}</td>
                  <td>{token.tokens_served}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-6">
          <h2>Projected Tokens By EOD</h2>
          <p><strong>Count By Midnight: {Math.floor(projectedTokens)}</strong></p>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <h2>Tokens Count Comparison</h2>
          <Doughnut data={data} />
        </div>

        <div className="col-md-6">
          <h2>Token Analysis by Hour</h2>
          <Bar data={data2} />
        </div>
      </div>
    </div>
  );
};
export default TrendingAnalysis;