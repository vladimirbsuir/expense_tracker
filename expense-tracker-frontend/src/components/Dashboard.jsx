import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Summary from './Summary';
import Expenses from './Expenses';
import Earnings from './Earnings';
import Messages from './Messages';
import Reminders from './Reminders';
import Budgets from './Budgets';
import Settings from './Settings';
import './Dashboard.css';

const Dashboard = ({ setIsAuthenticated }) => {
  return (
    <div className="dashboard">
      <Sidebar setIsAuthenticated={setIsAuthenticated} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/summary" replace />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;