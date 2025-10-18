import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { expenseAPI } from '../services/api';
import './ExpenseModal.css';

const ExpenseModal = ({ expense, categories, onClose, onSave, type }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: null,
    type: type
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name || '',
        amount: expense.amount || '',
        date: expense.date || new Date().toISOString().split('T')[0],
        description: expense.description || '',
        category: expense.category || null,
        type: expense.type || type
      });
    }
  }, [expense, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount)
      };

      if (expense) {
        await expenseAPI.update(expense.id, data);
      } else {
        await expenseAPI.create(data);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{expense ? 'Edit' : 'Add'} {type === 'INCOME' ? 'Earning' : 'Expense'}</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category?.id || ''}
              onChange={(e) => {
                const categoryId = e.target.value;
                const category = categories.find(c => c.id === parseInt(categoryId));
                setFormData({...formData, category});
              }}
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
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

export default ExpenseModal;