import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { categoryAPI } from '../services/api';
import './ExpenseModal.css';

const CategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || ''
      });
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        await categoryAPI.update(category.id, formData);
      } else {
        await categoryAPI.create(formData);
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