import { useState, useEffect } from 'react';
import { Plus, Download, Upload, Edit, Trash2, Tag } from 'lucide-react';
import { expenseAPI, categoryAPI, csvAPI } from '../services/api';
import ExpenseModal from './ExpenseModal';
import CategoryModal from './CategoryModal';
import './Expenses.css';

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingEarning, setEditingEarning] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredEarnings, setFilteredEarnings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleCategoryFilter(selectedCategory);
  }, [earnings, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [earningsRes, categoriesRes] = await Promise.all([
        expenseAPI.getByType('INCOME', { page: 0, size: 100 }),
        categoryAPI.getAll()
      ]);
      console.log('Earnings response:', earningsRes.data);
      const earningData = earningsRes.data.content || earningsRes.data || [];
      setEarnings(earningData);
      setFilteredEarnings(earningData);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this earning?')) {
      try {
        await expenseAPI.delete(id);
        setEarnings(earnings.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting earning:', error);
      }
    }
  };

  const handleEdit = (earning) => {
    setEditingEarning(earning);
    setShowModal(true);
  };

  const handleExport = async () => {
    try {
      console.log('Exporting earnings...');
      const response = await csvAPI.exportExpenses();
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'earnings.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      console.log('Export completed');
    } catch (error) {
      console.error('Error exporting earnings:', error);
      alert('Export failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      try {
        console.log('Importing file:', file.name);
        await csvAPI.importExpenses(file);
        fetchData();
        alert('Import successful!');
      } catch (error) {
        console.error('Error importing earnings:', error);
        alert('Import failed: ' + (error.response?.data?.message || error.message));
      }
    }
    event.target.value = ''; // Reset file input
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === '') {
      setFilteredEarnings(earnings);
    } else {
      setFilteredEarnings(earnings.filter(earning => 
        earning.category?.id?.toString() === categoryId
      ));
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="expenses">
      <div className="expenses-header">
        <h1>Earnings</h1>
        <div className="expenses-actions">
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} />
            Add Earning
          </button>
          <button onClick={handleExport} className="btn-secondary">
            <Download size={16} />
            Export
          </button>
          <label className="btn-secondary">
            <Upload size={16} />
            Import
            <input type="file" accept=".csv" onChange={handleImport} style={{display: 'none'}} />
          </label>
          <button onClick={() => setShowCategoryModal(true)} className="btn-secondary">
            <Tag size={16} />
            Categories
          </button>
        </div>
      </div>

      <div className="category-filter">
        <label>Filter by Category: </label>
        <select value={selectedCategory} onChange={(e) => handleCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="expenses-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEarnings.map(earning => (
              <tr key={earning.id}>
                <td className="common">{earning.name}</td>
                <td className="amount income">${earning.amount?.toFixed(2)}</td>
                <td className="common">{earning.date}</td>
                <td className="common">{earning.category?.name || 'Uncategorized'}</td>
                <td className="common">{earning.description}</td>
                <td>
                  <div className="actions">
                    <button onClick={() => handleEdit(earning)} className="btn-edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(earning.id)} className="btn-delete">
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
        <ExpenseModal
          expense={editingEarning}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingEarning(null);
          }}
          onSave={() => {
            fetchData();
            setShowModal(false);
            setEditingEarning(null);
          }}
          type="INCOME"
        />
      )}
      
      {showCategoryModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          onSave={() => {
            fetchData();
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default Earnings;