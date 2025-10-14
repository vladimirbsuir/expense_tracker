import { NavLink, useNavigate } from 'react-router-dom';
import { Home, DollarSign, TrendingUp, MessageSquare, Bell, Settings, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/auth');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Expense Tracker</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard/summary" className="nav-item">
          <Home size={20} />
          <span>Summary</span>
        </NavLink>
        
        <NavLink to="/dashboard/expenses" className="nav-item">
          <DollarSign size={20} />
          <span>Expenses</span>
        </NavLink>
        
        <NavLink to="/dashboard/earnings" className="nav-item">
          <TrendingUp size={20} />
          <span>Earnings</span>
        </NavLink>
        
        <NavLink to="/dashboard/messages" className="nav-item">
          <MessageSquare size={20} />
          <span>Messages</span>
        </NavLink>
        
        <NavLink to="/dashboard/reminders" className="nav-item">
          <Bell size={20} />
          <span>Reminders</span>
        </NavLink>
        
        <NavLink to="/dashboard/settings" className="nav-item">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;