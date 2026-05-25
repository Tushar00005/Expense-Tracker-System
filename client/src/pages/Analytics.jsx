import { useState, useEffect } from 'react';
import api from '../api';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [budgetInput, setBudgetInput] = useState('');
    const [isSavingBudget, setIsSavingBudget] = useState(false);

    useEffect(() => {
        fetchData();
    }, [month, year]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/analytics?month=${month}&year=${year}`);
            setData(res.data);
            setBudgetInput(res.data.budget);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBudget = async () => {
        setIsSavingBudget(true);
        try {
            await api.post('/budget', { month, year, amount: Number(budgetInput) });
            fetchData();
            alert('Budget updated!');
        } catch (error) {
            console.error(error);
            alert('Failed to update budget');
        } finally {
            setIsSavingBudget(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

    const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#f59e0b', '#ef4444']; // Primary, Indigo, Emerald, Amber, Red

    // Prepare Data
    const pieData = data?.categoryData ? Object.entries(data.categoryData).map(([name, value]) => ({ name, value })) : [];
    const barData = data?.dailyData?.map((val, idx) => ({ day: idx + 1, spent: val })) || [];

    // Waste vs Necessary
    const wasteVsNecessary = [
        { name: 'Necessary', value: (data?.totalSpent - data?.totalWasted) || 0 },
        { name: 'Wasted', value: data?.totalWasted || 0 }
    ];

    return (
        <div className="space-y-8 print:space-y-4">
            <div className="flex justify-between items-center print:hidden">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics & Reports</h2>
                    <p className="text-slate-500">Detailed breakdown of your finances</p>
                </div>
                <div className="flex gap-2">
                    <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="input w-auto">
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'short' })}</option>
                        ))}
                    </select>
                    <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input w-auto">
                        <option value={2024}>2024</option>
                        <option value={2025}>2025</option>
                        <option value={2026}>2026</option>
                    </select>
                    <button onClick={handlePrint} className="btn btn-secondary">
                        <Download size={20} /> <span className="hidden sm:inline">Export PDF</span>
                    </button>
                </div>
            </div>

            {/* Budget Setting */}
            <div className="card print:hidden">
                <div className="flex items-end gap-4 max-w-md">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Set Monthly Budget</label>
                        <input
                            type="number"
                            className="input"
                            value={budgetInput}
                            onChange={(e) => setBudgetInput(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleUpdateBudget}
                        disabled={isSavingBudget}
                        className="btn btn-primary"
                    >
                        {isSavingBudget ? 'Saving...' : <><Save size={18} /> Update</>}
                    </button>
                </div>
            </div>

            <div id="report-content" className="space-y-8">
                {/* Print Header */}
                <div className="hidden print:block text-center mb-8">
                    <h1 className="text-3xl font-bold">Monthly Expense Report</h1>
                    <p className="text-slate-500">{new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}</p>
                </div>

                {/* Summary Row */}
                <div className="grid grid-cols-4 gap-4 text-center print:border print:p-4 print:rounded-xl">
                    <div className="p-4 bg-white dark:bg-slate-50 rounded-xl">
                        <p className="text-sm black ">Budget</p>
                        <p className="text-xl font-bold">₹{data?.budget}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-50 rounded-xl">
                        <p className="text-sm black color ">Spent</p>
                        <p className="text-xl font-bold">₹{data?.totalSpent}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-600">Wasted</p>
                        <p className="text-xl font-bold text-red-500">₹{data?.totalWasted}</p>
                    </div>
                    <div className="p-4 bg-white dark:bg-slate-50 rounded-xl">
                        <p className="text-sm text-slate-600">Balance</p>
                        <p className="text-xl font-bold text-emerald-500">₹{data?.remaining}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
                    {/* Category Chart */}
                    <div className="card h-80 print:shadow-none print:border">
                        <h3 className="text-lg font-semibold mb-4 text-center">Category Spending</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Waste vs Necessary */}
                    <div className="card h-80 print:shadow-none print:border">
                        <h3 className="text-lg font-semibold mb-4 text-center">Necessary vs Waste</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={wasteVsNecessary}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill="#10b981" /> {/* Necessary (Emerald) */}
                                    <Cell fill="#ef4444" /> {/* Waste (Red) */}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Daily Activity */}
                    <div className="card col-span-1 lg:col-span-2 h-80 print:shadow-none print:border">
                        <h3 className="text-lg font-semibold mb-4">Daily Spending Trend</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="day" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value}`, 'Spent']}
                                />
                                <Bar dataKey="spent" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Table for Print */}
                <div className="hidden print:block mt-8">
                    <h3 className="text-lg font-bold mb-4">Transaction History</h3>
                    <p className="text-sm text-slate-500 italic">Please visit the Expenses tab for the full transaction list.</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
