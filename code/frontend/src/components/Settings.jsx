import { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="settings">
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>Profile Information</h2>
        <div className="profile-card">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <div className="info-item">
              <label>Username</label>
              <span>{username || 'Not available'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;