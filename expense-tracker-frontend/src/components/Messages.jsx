import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { reminderAPI } from '../services/api';
import './Messages.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayMessages();
  }, []);

  const fetchTodayMessages = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await reminderAPI.getByDate(today, { page: 0, size: 100 });
      console.log('Today messages response:', response.data);
      setMessages(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching today messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await reminderAPI.deactivate(id);
      setMessages(messages.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error dismissing message:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="messages">
      <h1>Messages & Notifications</h1>
      
      {messages.length === 0 ? (
        <div className="no-messages">
          <Bell size={48} />
          <p>No messages for today</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map(message => (
            <div key={message.id} className="message-card">
              <div className="message-content">
                <div className="message-header">
                  <h3>{message.title}</h3>
                  <span className={`message-type ${message.type?.toLowerCase()}`}>
                    {message.type}
                  </span>
                </div>
                <p>{message.message}</p>
                <div className="message-meta">
                  <span>Due: {message.dueDate}</span>
                  <span>Status: {message.active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className="message-actions">
                <button 
                  onClick={() => handleDismiss(message.id)}
                  className="btn-dismiss"
                  title="Dismiss"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )) }
        </div>
      )}
    </div>
  );
};

export default Messages;