import React, { useEffect, useState } from 'react';
import Header from "../../components/Admin/Header";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import AdminSidebar from "../../components/Admin/AdminSidebar";

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF6666', '#AA88FF'];

const FundRaising = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [barChartData, setBarChartData] = useState([]);
  const [incomePieData, setIncomePieData] = useState([]);
  const [expensePieData, setExpensePieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const categoryOptions = {
    income: ['Donation', 'Sponsorship', 'Grant'],
    expense: [
      'Administrative Expenses',
      'Training & Session Delivery Costs',
      'Marketing & Outreach',
      'Event/Session Logistics',
      'Staff & Volunteer Costs',
      'Program Development',
      'Monitoring & Evaluation'
    ],
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/summary');
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/chart-data');
      const data = await res.json();
      setBarChartData([
        { name: 'Income', value: data.income },
        { name: 'Expense', value: data.expense },
      ]);
      setIncomePieData(data.incomeBreakdown);
      setExpensePieData(data.expenseBreakdown);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchTransactions(), fetchSummary(), fetchChartData()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const isFormValid = description && amount && category && !isNaN(parseFloat(amount));

  const handleAddTransaction = async () => {
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setMessage('');

    try {
      const amt = parseFloat(amount);
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount: amt, type, category })
      });

      if (!res.ok) throw new Error('Failed to add');

      setDescription('');
      setAmount('');
      setCategory('');
      await Promise.all([fetchTransactions(), fetchSummary(), fetchChartData()]);
      setMessage('✅ Transaction added successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error adding transaction');
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-lg font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">

          {/* left panel- Sidebar */}
          <AdminSidebar/>

          <div className="w-full md:w-3/4 bg-white p-6 rounded shadow border border-gray-900">
            <h1 className="text-2xl font-bold mb-6">Financial Details</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-200 p-4 rounded text-center shadow">
                <p className="text-sm text-gray-700">Total Balance</p>
                <p className="text-xl font-semibold">${summary.balance.toFixed(2)}</p>
              </div>
              <div className="bg-green-300 p-4 rounded text-center shadow">
                <p className="text-sm text-gray-700">Income</p>
                <p className="text-xl font-semibold">${summary.income.toFixed(2)}</p>
              </div>
              <div className="bg-red-300 p-4 rounded text-center shadow">
                <p className="text-sm text-gray-700">Expenses</p>
                <p className="text-xl font-semibold">${summary.expense.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form and transaction list */}
              <div className="bg-white p-4 rounded shadow overflow-auto max-h-[700px]">
                <label className="block mb-2 text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={e => {
                    setType(e.target.value);
                    setCategory('');
                  }}
                  className="w-full border p-2 rounded mb-4"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>

                <label className="block mb-2 text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                >
                  <option value="" disabled>Select a category</option>
                  {categoryOptions[type].map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>

                <label className="block mb-2 text-sm font-medium">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                  placeholder="Enter description"
                />

                <label className="block mb-2 text-sm font-medium">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                  placeholder="$0.00"
                />

                <button
                  onClick={handleAddTransaction}
                  disabled={!isFormValid || submitting}
                  className={`px-4 py-2 rounded text-white ${isFormValid && !submitting
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                  {submitting ? 'Adding...' : 'Add Transaction'}
                </button>

                {message && (
                  <p className="mt-2 text-sm font-medium text-blue-600">
                    {message}
                  </p>
                )}

                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th>Type</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-2 text-center">No transactions yet</td>
                        </tr>
                      ) : (
                        transactions.map((t, i) => (
                          <tr key={t._id} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="py-1 capitalize">{t.type}</td>
                            <td className="py-1">{t.category}</td>
                            <td className="py-1">{t.description}</td>
                            <td className={`py-1 ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                              {t.type === 'income' ? `+$${t.amount.toFixed(2)}` : `-$${t.amount.toFixed(2)}`}
                            </td>
                            <td className="py-1">{new Date(t.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 gap-4">
                {/* Income Pie Chart */}
                <div className="bg-white h-64 rounded border shadow p-4 flex">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={incomePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          labelLine={false}
                        >
                          {incomePieData.map((entry, index) => (
                            <Cell key={`income-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col justify-center pl-4">
                    {incomePieData.map((entry, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm">{entry.name} (${entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Pie Chart */}
                <div className="bg-white h-64 rounded border shadow p-4 flex">
                  <div className="w-1/2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expensePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          labelLine={false}
                        >
                          {expensePieData.map((entry, index) => (
                            <Cell key={`expense-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 flex flex-col justify-center pl-4">
                    {expensePieData.map((entry, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm">{entry.name} (${entry.value})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white h-64 rounded border shadow p-4">
                  <h3 className="text-center font-semibold mb-2">Income vs Expense</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Income', value: summary.income },
                        { name: 'Expense', value: summary.expense }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barCategoryGap={80}
                    >
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, Math.max(summary.income, summary.expense) * 1.2]} />
                      <Tooltip />
                      <Bar dataKey="value" barSize={100} radius={[6, 6, 0, 0]}>
                        <Cell fill="#0088FE" /> {/* Income bar */}
                        <Cell fill="#FF8042" /> {/* Expense bar */}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
          </div>
      </main>

    </div>
  )
};

export default FundRaising;
