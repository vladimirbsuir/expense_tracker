import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { budgetAPI } from '../services/api';
import './ExpenseModal.css';

const BudgetModal = ({ budget, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: '',
    period: new Date().toISOString().split('T')[0],
    categoryId: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (budget) {
      setFormData({
        amount: budget.amount || '',
        period: budget.period || new Date().toISOString().split('T')[0],
        categoryId: budget.category?.id || ''
      });
    }
  }, [budget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const budgetData = {
        amount: parseFloat(formData.amount),
        period: formData.period
      };

      let savedBudget;
      if (budget) {
        savedBudget = await budgetAPI.update(budget.id, budgetData);
      } else {
        const response = await budgetAPI.create(budgetData);
        savedBudget = response;
      }

      // Assign to category if selected
      if (formData.categoryId && savedBudget.data) {
        await budgetAPI.assignToCategory(savedBudget.data.id, formData.categoryId);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving budget:', error);
      alert('Error saving budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{budget ? 'Edit' : 'Add'} Budget</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
              placeholder="Enter budget amount"
            />
          </div>

          <div className="form-group">
            <label>Period</label>
            <input
              type="date"
              value={formData.period}
              onChange={(e) => setFormData({...formData, period: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
            >
              <option value="">Select Category (Optional)</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
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

export default BudgetModal;