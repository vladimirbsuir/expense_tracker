import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoryAPI, budgetAPI } from '../services/api';
import './ExpenseModal.css';

const CategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    budgetAmount: '',
    budgetPeriod: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        budgetAmount: category.budget?.amount || '',
        budgetPeriod: category.budget?.period || new Date().toISOString().split('T')[0]
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let savedCategory;
      if (category) {
        savedCategory = await categoryAPI.update(category.id, { name: formData.name });
      } else {
        savedCategory = await categoryAPI.create({ name: formData.name });
      }
      
      // Create budget if amount is provided
      if (formData.budgetAmount) {
        const budgetData = {
          amount: parseFloat(formData.budgetAmount),
          period: formData.budgetPeriod
        };
        const budgetResponse = await budgetAPI.create(budgetData);
        await budgetAPI.assignToCategory(budgetResponse.data.id, savedCategory.data?.id || category.id);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>{category ? 'Edit' : 'Add'} Category</h2>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Enter category name"
            />
          </div>

          <div className="form-group">
            <label>Budget Amount (Optional)</label>
            <input
              type="number"
              step="0.01"
              value={formData.budgetAmount}
              onChange={(e) => setFormData({...formData, budgetAmount: e.target.value})}
              placeholder="Enter budget amount"
            />
          </div>

          {formData.budgetAmount && (
            <div className="form-group">
              <label>Budget Period</label>
              <input
                type="date"
                value={formData.budgetPeriod}
                onChange={(e) => setFormData({...formData, budgetPeriod: e.target.value})}
              />
            </div>
          )}

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

export default CategoryModal;