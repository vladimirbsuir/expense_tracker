import { useState, useEffect } from 'react';
import { Plus, Download, Upload, Edit, Trash2 } from 'lucide-react';
import { expenseAPI, categoryAPI, csvAPI } from '../services/api';
import ExpenseModal from './ExpenseModal';
import './Expenses.css';

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEarning, setEditingEarning] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [earningsRes, categoriesRes] = await Promise.all([
        expenseAPI.getByType('INCOME', { size: 100 }),
        categoryAPI.getAll()
      ]);
      setEarnings(earningsRes.data.content || []);
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
      const response = await csvAPI.exportExpenses();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'earnings.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting earnings:', error);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await csvAPI.importExpenses(file);
        fetchData();
        alert('Import successful!');
      } catch (error) {
        console.error('Error importing earnings:', error);
        alert('Import failed!');
      }
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
        </div>
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
            {earnings.map(earning => (
              <tr key={earning.id}>
                <td>{earning.name}</td>
                <td className="amount income">${earning.amount?.toFixed(2)}</td>
                <td>{earning.date}</td>
                <td>{earning.category?.name || 'Uncategorized'}</td>
                <td>{earning.description}</td>
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
    </div>
  );
};

export default Earnings;