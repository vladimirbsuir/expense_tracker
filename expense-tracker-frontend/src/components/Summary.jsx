import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyticsAPI } from '../services/api';
import './Summary.css';

const Summary = () => {
  const [balance, setBalance] = useState(0);
  const [dailyData, setDailyData] = useState([]);
  const [topExpenses, setTopExpenses] = useState([]);
  const [period, setPeriod] = useState('7');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - parseInt(period));

      const [balanceRes, dailyRes, topRes] = await Promise.all([
        analyticsAPI.getBalance(),
        analyticsAPI.getDailyExpenses(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0],
          { size: 100 }
        ),
        analyticsAPI.getTopExpenses(5, { size: 5 })
      ]);

      setBalance(balanceRes.data);
      setDailyData(dailyRes.data.content || []);
      setTopExpenses(topRes.data.content || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="summary">
      <h1>Summary</h1>
      
      <div className="summary-cards">
        <div className="card">
          <h3>Total Balance</h3>
          <div className={`balance ${balance >= 0 ? 'positive' : 'negative'}`}>
            ${balance?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-controls">
          <label>Period: </label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>

        <div className="charts-grid">
          <div className="chart-container">
            <h3>Daily Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h3>Top Expenses</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;