import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TripLogChart from './Logs';

const Dutychart = () => {
  const {tid}=useParams()
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/get_duty_chart_data', {
          params: {
            trip_id: tid,
        
          }
        });

        if (response.data.status === 'success') {
          setLogData(response.data.data);
        } else {
          console.error('Error fetching chart data:', response.data.message);
        }
      } catch (error) {
        console.error('API request failed:', error);
      }
    };

    fetchChartData();
  }, [tid]);

  useEffect(() => {
    if (chartRef.current && logData.length > 0) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: logData.map(entry => entry.time),
          datasets: [{
            label: 'Duty Status',
            data: logData.map(entry => entry.status),
            borderColor: '#2563eb', // Blue for visibility
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: false,
            tension: 0.4
          }]
        },
        options: {
          scales: {
            y: {
              title: {
                display: true,
                text: 'Duty Status'
              },
              ticks: {
                stepSize: 1,
                callback: function (value) {
                  switch (value) {
                    case 0: return 'Off-Duty';
                    case 1: return 'Sleeper Berth';
                    case 2: return 'Driving';
                    case 3: return 'On-Duty';
                    default: return '';
                  }
                }
              }
            },
            x: {
              title: {
                display: true,
                text: 'Time'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: '#1f2937' // Dark gray for visibility
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [logData]);

  return (
    <div className='content-wrapper p-4'>
      <canvas ref={chartRef} />
   
    </div>
  );
};

export default Dutychart;