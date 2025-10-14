import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { reminderAPI } from '../services/api';
import './ExpenseModal.css';

const ReminderModal = ({ reminder, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    dueDate: new Date().toISOString().split('T')[0],
    type: 'ONE_TIME'
  });
  const [loading, setLoading] = useState(false);

  const reminderTypes = [
    { value: 'ONE_TIME', label: 'One Time' },
    { value: 'DAILY', label: 'Daily' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'MONTHLY', label: 'Monthly' }
  ];

  useEffect(() => {
    if (reminder) {
      setFormData({
        title: reminder.title || '',
        message: reminder.message || '',
        dueDate: reminder.dueDate || new Date().toISOString().split('T')[0],
        type: reminder.type || 'ONE_TIME'
      });
    }
  }, [reminder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (reminder) {
        // Note: Update functionality would need to be added to backend
        console.log('Update not implemented in backend');
      } else {
        await reminderAPI.create(formData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Error saving reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{reminder ? 'Edit' : 'Add'} Reminder</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              {reminderTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;