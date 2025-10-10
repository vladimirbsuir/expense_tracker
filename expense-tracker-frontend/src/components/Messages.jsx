import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { reminderAPI } from '../services/api';
import './Messages.css';

const Messages = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const response = await reminderAPI.getAll({ size: 100 });
      setReminders(response.data.content || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await reminderAPI.deactivate(id);
      setReminders(reminders.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error dismissing reminder:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        await reminderAPI.delete(id);
        setReminders(reminders.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting reminder:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="messages">
      <h1>Messages & Notifications</h1>
      
      {reminders.length === 0 ? (
        <div className="no-messages">
          <Bell size={48} />
          <p>No messages or notifications</p>
        </div>
      ) : (
        <div className="messages-list">
          {reminders.map(reminder => (
            <div key={reminder.id} className="message-card">
              <div className="message-content">
                <div className="message-header">
                  <h3>{reminder.title}</h3>
                  <span className={`message-type ${reminder.type?.toLowerCase()}`}>
                    {reminder.type}
                  </span>
                </div>
                <p>{reminder.description}</p>
                <div className="message-meta">
                  <span>Due: {reminder.reminderDate}</span>
                  <span>Created: {reminder.createdAt}</span>
                </div>
              </div>
              <div className="message-actions">
                <button 
                  onClick={() => handleDismiss(reminder.id)}
                  className="btn-dismiss"
                  title="Dismiss"
                >
                  Dismiss
                </button>
                <button 
                  onClick={() => handleDelete(reminder.id)}
                  className="btn-delete"
                  title="Delete"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;