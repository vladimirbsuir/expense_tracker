import { useState, useEffect } from 'react';
import { Plus, Download, Upload, Edit, Trash2, Tag } from 'lucide-react';
import { expenseAPI, categoryAPI, csvAPI } from '../services/api';
import ExpenseModal from './ExpenseModal';
import CategoryModal from './CategoryModal';
import './Expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleCategoryFilter(selectedCategory);
  }, [expenses, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        expenseAPI.getByType('EXPENSE', { page: 0, size: 100 }),
        categoryAPI.getAll()
      ]);
      console.log('Expenses response:', expensesRes.data);
      const expenseData = expensesRes.data.content || expensesRes.data || [];
      setExpenses(expenseData);
      setFilteredExpenses(expenseData);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await expenseAPI.delete(id);
        setExpenses(expenses.filter(e => e.id !== id));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const handleExport = async () => {
    try {
      const response = await csvAPI.exportExpenses();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'expenses.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting expenses:', error);
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
        console.error('Error importing expenses:', error);
        alert('Import failed!');
      }
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === '') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(expense => 
        expense.category?.id?.toString() === categoryId
      ));
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="expenses">
      <div className="expenses-header">
        <h1>Expenses</h1>
        <div className="expenses-actions">
          <button onClick={() => setShowModal(true)} className="btn-primary">
            <Plus size={16} />
            Add Expense
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
            {filteredExpenses.map(expense => (
              <tr key={expense.id}>
                <td className="common">{expense.name}</td>
                <td className="amount">${expense.amount?.toFixed(2)}</td>
                <td className="common">{expense.date}</td>
                <td className="common">{expense.category?.name || 'Uncategorized'}</td>
                <td className="common">{expense.description}</td>
                <td>
                  <div className="actions">
                    <button onClick={() => handleEdit(expense)} className="btn-edit">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(expense.id)} className="btn-delete">
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
          expense={editingExpense}
          categories={categories}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
          onSave={() => {
            fetchData();
            setShowModal(false);
            setEditingExpense(null);
          }}
          type="EXPENSE"
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

export default Expenses;