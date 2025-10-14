import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import { budgetAPI, categoryAPI } from '../services/api';
import BudgetModal from './BudgetModal';
import './Budgets.css';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        budgetAPI.getAll({ page: 0, size: 100 }),
        categoryAPI.getAll()
      ]);
      console.log('Budgets response:', budgetsRes.data);
      setBudgets(budgetsRes.data.content || budgetsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetAPI.delete(id);
        setBudgets(budgets.filter(b => b.id !== id));
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setShowModal(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="budgets">
      <div className="budgets-header">
        <h1>Budgets</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={16} />
          Add Budget
        </button>
      </div>

      <div className="budgets-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map(budget => (
              <tr key={budget.id}>
                <td>{budget.category?.name || 'Unassigned'}</td>
                <td className="amount">${budget.amount?.toFixed(2)}</td>
                <td>{budget.period}</td>
                <td>
                  <div className="actions">
                    <button onClick={() => handleEdit(budget)} className="btn-edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(budget.id)} className="btn-delete">
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
        <BudgetModal
          budget={editingBudget}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingBudget(null);
          }}
          onSave={() => {
            fetchData();
            setShowModal(false);
            setEditingBudget(null);
          }}
        />
      )}
    </div>
  );
};

export default Budgets;