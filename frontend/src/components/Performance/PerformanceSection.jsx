import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, Pie } from 'react-chartjs-2';
import {
  fetchPerformanceStatistics,
  fetchIntervieweeComposition,
  fetchIntervieweeStatus,
} from '../../redux/slices/performanceSlice';

// Import and register Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const PerformanceSection = () => {
  const dispatch = useDispatch();

  // Get data from Redux store
  const {
    monthlyPerformance,
    intervieweeComposition,
    intervieweeStatus,
    status,
    error,
  } = useSelector((state) => state.performance);

  useEffect(() => {
    // Dispatch actions to fetch data
    dispatch(fetchPerformanceStatistics());
    dispatch(fetchIntervieweeComposition());
    dispatch(fetchIntervieweeStatus());
  }, [dispatch]);

  // Bar chart data for monthly performance
  const barChartData = {
    labels: monthlyPerformance.map((data) => data.month),
    datasets: [
      {
        label: 'Trial Assessment',
        data: monthlyPerformance.map((data) => data.trial),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Real Assessment',
        data: monthlyPerformance.map((data) => data.real),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Pie chart data for interviewee composition
  const pieChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Interviewee Composition',
        data: [intervieweeComposition.male, intervieweeComposition.female],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div className="performance-section">
      <h2>Performance Statistics</h2>

      {status === 'loading' && <p>Loading performance data...</p>}
      {status === 'failed' && (
        <p className="error">
          {typeof error === 'string'
            ? error
            : error?.msg || error?.message || JSON.stringify(error)}
        </p>
      )}

      {/* Bar Chart */}
      <div className="bar-chart-container">
        <h3>Monthly Performance Statistics</h3>
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      {/* Pie Chart */}
      <div className="pie-chart-container">
        <h3>Interviewee Composition</h3>
        <Pie data={pieChartData} />
        <p>
          Total Interviewees: {intervieweeComposition.male + intervieweeComposition.female}
        </p>
      </div>

      {/* Interviewee Status Table */}
      <div className="status-table">
        <h3>Interviewee Status</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {intervieweeStatus.map((status) => (
              <tr key={status.id}>
                <td>{status.name}</td>
                <td>{status.score}%</td>
                <td
                  style={{
                    color: status.status === 'Qualified' ? 'green' : 'red',
                  }}
                >
                  {status.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceSection;
