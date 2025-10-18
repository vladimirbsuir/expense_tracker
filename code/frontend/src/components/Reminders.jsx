import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, Play } from 'lucide-react';
import { reminderAPI } from '../services/api';
import ReminderModal from './ReminderModal';
import './Reminders.css';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const response = await reminderAPI.getAll({ page: 0, size: 100 });
      console.log('Reminders response:', response.data);
      setReminders(response.data.content || response.data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
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

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowModal(true);
  };

  const handleDeactivate = async (id) => {
    try {
      await reminderAPI.deactivate(id);
      setReminders(reminders.map(r => 
        r.id === id ? { ...r, active: false } : r
      ));
    } catch (error) {
      console.error('Error deactivating reminder:', error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await reminderAPI.update(id, { active: true });
      setReminders(reminders.map(r => 
        r.id === id ? { ...r, active: true } : r
      ));
    } catch (error) {
      console.error('Error activating reminder:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="reminders">
      <div className="reminders-header">
        <h1>Reminders</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />
          Add Reminder
        </button>
      </div>

      <div className="reminders-table">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Due Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reminders.map(reminder => (
              <tr key={reminder.id}>
                <td className="common">{reminder.title}</td>
                <td className="common">{reminder.message}</td>
                <td className="common">{reminder.dueDate}</td>
                <td>
                  <span className={`reminder-type ${reminder.type?.toLowerCase()}`}>
                    {reminder.type}
                  </span>
                </td>
                <td>
                  <span className={`status ${reminder.active ? 'active' : 'inactive'}`}>
                    {reminder.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button onClick={() => handleEdit(reminder)} className="btn-edit">
                      <Edit size={14} />
                    </button>
                    {reminder.active ? (
                      <button onClick={() => handleDeactivate(reminder.id)} className="btn-deactivate">
                        <Calendar size={14} />
                      </button>
                    ) : (
                      <button onClick={() => handleActivate(reminder.id)} className="btn-activate">
                        <Play size={14} />
                      </button>
                    )}
                    <button onClick={() => handleDelete(reminder.id)} className="btn-delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ReminderModal
          reminder={editingReminder}
          onClose={() => {
            setShowModal(false);
            setEditingReminder(null);
          }}
          onSave={() => {
            fetchReminders();
            setShowModal(false);
            setEditingReminder(null);
          }}
        />
      )}
    </div>
  );
};

export default Reminders;