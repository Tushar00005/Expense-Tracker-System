import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit2, Calendar } from 'lucide-react';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Expenses = () => {
    const { user } = useAuth();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentExpense, setCurrentExpense] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    // Form State
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        type: 'Necessary',
        date: new Date().toISOString().split('T')[0],
        note: ''
    });

    const fetchExpenses = async () => {
        try {
            const { data } = await api.get(`/expenses?month=${month}&year=${year}`);
            setExpenses(data);
        } catch (error) {
            console.error('Error fetching expenses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [month, year]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentExpense) {
                await api.put(`/expenses/${currentExpense._id}`, formData);
            } else {
                await api.post('/expenses', formData);
            }
            setIsModalOpen(false);
            setCurrentExpense(null);
            fetchExpenses();
            resetForm();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (expense) => {
        setCurrentExpense(expense);
        setFormData({
            amount: expense.amount,
            category: expense.category,
            type: expense.type,
            date: new Date(expense.date).toISOString().split('T')[0],
            note: expense.note || ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            amount: '',
            category: 'Food',
            type: 'Necessary',
            date: new Date().toISOString().split('T')[0],
            note: ''
        });
    };

    const openCreateModal = () => {
        setCurrentExpense(null);
        resetForm();
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Expenses</h2>
                    <p className="text-slate-500 text-sm">Manage your daily spendings</p>
                </div>
                <div className="flex gap-2">
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="input w-auto h-10 py-1">
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                        ))}
                    </select>
                    <button onClick={openCreateModal} className="btn btn-primary">
                        <Plus size={20} /> <span className="hidden sm:inline">Add Expense</span>
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-600 text-sm font-medium">
                                <th className="p-4">Date</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Note</th>
                                <th className="p-4">Type</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No expenses found for this month.</td>
                                </tr>
                            ) : (
                                expenses.map(expense => (
                                    <tr key={expense._id} className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="p-4 text-slate-600 dark:text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="opacity-50" />
                                                {new Date(expense.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                expense.category === 'Food' && "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
                                                expense.category === 'Travel' && "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
                                                expense.category === 'Shopping' && "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
                                                expense.category === 'Study' && "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
                                                expense.category === 'Other' && "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
                                            )}>
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm truncate max-w-[150px]">{expense.note || '-'}</td>
                                        <td className="p-4">
                                            <span className={clsx(
                                                "text-xs font-medium",
                                                expense.type === 'Waste' ? "text-red-500" : "text-emerald-500"
                                            )}>
                                                {expense.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-medium text-slate-800 dark:text-white">
                                            ₹{expense.amount}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleEdit(expense)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded dark:hover:bg-slate-700 transition">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(expense._id)} className="p-1.5 text-red-500 hover:bg-red-900/10 rounded dark:hover:bg-red-900/20 transition">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal title={currentExpense ? "Edit Expense" : "New Expense"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount</label>
                        <input
                            type="number"
                            required
                            className="input"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                className="input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Food</option>
                                <option>Travel</option>
                                <option>Shopping</option>
                                <option>Study</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                className="input"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Necessary">Necessary</option>
                                <option value="Waste">Waste</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            required
                            className="input"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Note (Optional)</label>
                        <textarea
                            className="input h-20 resize-none"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {currentExpense ? "Update" : "Add Expense"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Expenses;
