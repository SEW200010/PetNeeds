import React, { useEffect, useState } from 'react';
import Header from "../../components/Admin/Header";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import AdminSidebar from "../../components/Admin/AdminSidebar";

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF6666', '#AA88FF'];
const ITEMS_PER_PAGE = 10;

const FundRaising = () => {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [donorName, setDonorName] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [barChartData, setBarChartData] = useState([]);
  const [incomePieData, setIncomePieData] = useState([]);
  const [expensePieData, setExpensePieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // Pagination states
  const [incomePage, setIncomePage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);

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

  // Fetch transactions from backend
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

  // Form validation including donor/beneficiary check
  const isFormValid =
    description &&
    amount &&
    category &&
    !isNaN(parseFloat(amount)) &&
    ((type === 'income' && donorName) || (type === 'expense' && beneficiaryName));

  const handleAddTransaction = async () => {
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('amount', parseFloat(amount));
      formData.append('type', type);
      formData.append('category', category);
      if (type === 'income') formData.append('donorName', donorName);
      if (type === 'expense') formData.append('beneficiaryName', beneficiaryName);
      if (file) formData.append('transcriptFile', file);

      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setMessage(`❌ ${errorData.error || 'Error adding transaction'}`);

        // Reset form even on error
        setDescription('');
        setAmount('');
        setCategory('');
        setDonorName('');
        setBeneficiaryName('');
        setFile(null);

        return; // Stop here to avoid success message
      }

      // On success, reset form and refetch data
      setDescription('');
      setAmount('');
      setCategory('');
      setDonorName('');
      setBeneficiaryName('');
      setFile(null);

      setIncomePage(1);
      setExpensePage(1);

      await Promise.all([fetchTransactions(), fetchSummary(), fetchChartData()]);

      setMessage('✅ Transaction added successfully!');
    } catch (err) {
      console.error(err);
      setMessage('❌ Error adding transaction');

      // Also reset form on unexpected error
      setDescription('');
      setAmount('');
      setCategory('');
      setDonorName('');
      setBeneficiaryName('');
      setFile(null);
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

  // Filter and paginate income and expense transactions
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  const incomePageCount = Math.ceil(incomeTransactions.length / ITEMS_PER_PAGE);
  const expensePageCount = Math.ceil(expenseTransactions.length / ITEMS_PER_PAGE);

  const incomePaginated = incomeTransactions.slice(
    (incomePage - 1) * ITEMS_PER_PAGE,
    incomePage * ITEMS_PER_PAGE
  );

  const expensePaginated = expenseTransactions.slice(
    (expensePage - 1) * ITEMS_PER_PAGE,
    expensePage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <Header />
      <main className="bg-gray-100 pt-[65px] min-h-screen">
        <div className="flex flex-col md:flex-row">

          {/* left panel- Sidebar */}
          <AdminSidebar />

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
              {/* Form Section */}
              <div className="bg-white p-4 rounded shadow overflow-auto max-h-[700px]">
                <label className="block mb-2 text-sm font-medium">Type</label>
                <select
                  value={type}
                  onChange={e => {
                    setType(e.target.value);
                    setCategory('');
                    setDonorName('');
                    setBeneficiaryName('');
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

                {/* Conditional donor/beneficiary fields */}
                {type === 'income' && (
                  <>
                    <label className="block mb-2 text-sm font-medium">Donor / Organization Name</label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={e => setDonorName(e.target.value)}
                      className="w-full border p-2 rounded mb-4"
                      placeholder="Enter Donor or Organization Name"
                    />
                  </>
                )}

                {type === 'expense' && (
                  <>
                    <label className="block mb-2 text-sm font-medium">Beneficiary Name</label>
                    <input
                      type="text"
                      value={beneficiaryName}
                      onChange={e => setBeneficiaryName(e.target.value)}
                      className="w-full border p-2 rounded mb-4"
                      placeholder="Enter Beneficiary Name"
                    />
                  </>
                )}

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

                <label className="block mb-2 text-sm font-medium">Upload Transcript</label>
                <input
                  type="file"
                  onChange={e => setFile(e.target.files[0])}
                  className="w-full border p-2 rounded mb-4"
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

            {/* Income Transactions Table */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Income Transactions</h2>
              <table className="w-full text-sm mb-2 border-collapse border border-gray-300">
                <thead>
                  <tr className="text-left border-b border-gray-300 bg-gray-100">
                    <th className="p-2 border border-gray-300">Donor/Organization</th>
                    <th className="p-2 border border-gray-300">Category</th>
                    <th className="p-2 border border-gray-300">Description</th>
                    <th className="p-2 border border-gray-300">Amount</th>
                    <th className="p-2 border border-gray-300">Date</th>
                    <th className="p-2 border border-gray-300">File</th>
                  </tr>
                </thead>

                <tbody>
                  {incomePaginated.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-4 text-center">No income transactions</td>
                    </tr>
                  ) : (
                    incomePaginated.map(t => (
                      <tr key={t._id} className="bg-gray-50">
                        <td className="py-1 px-2 border border-gray-300">{t.donorName || '-'}</td>
                        <td className="py-1 px-2 border border-gray-300">{t.category}</td>
                        <td className="py-1 px-2 border border-gray-300">{t.description}</td>
                        <td className="py-1 px-2 border border-gray-300 text-green-600">+${t.amount.toFixed(2)}</td>
                        <td className="py-1 px-2 border border-gray-300">{new Date(t.timestamp).toLocaleString()}</td>
                        <td className="py-1 px-2 border border-gray-300">
                          {t.file?.url ? (
                            <a href={t.file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                              View
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setIncomePage(p => Math.max(1, p - 1))}
                  disabled={incomePage === 1}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {incomePage} of {incomePageCount}</span>
                <button
                  onClick={() => setIncomePage(p => Math.min(incomePageCount, p + 1))}
                  disabled={incomePage === incomePageCount}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Expense Transactions Table */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Expense Transactions</h2>
              <table className="w-full text-sm mb-2 border-collapse border border-gray-300">
                <thead>
                  <tr className="text-left border-b border-gray-300 bg-gray-100">
                    <th className="p-2 border border-gray-300">Beneficiary's Name</th>
                    <th className="p-2 border border-gray-300">Category</th>
                    <th className="p-2 border border-gray-300">Description</th>
                    <th className="p-2 border border-gray-300">Amount</th>
                    <th className="p-2 border border-gray-300">Date</th>
                    <th className="p-2 border border-gray-300">File</th>
                  </tr>
                </thead>
                <tbody>
                  {expensePaginated.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-4 text-center">No expense transactions</td>
                    </tr>
                  ) : (
                    expensePaginated.map(t => (
                      <tr key={t._id} className="bg-gray-50">
                        <td className="py-1 px-2 border border-gray-300">{t.beneficiaryName || '-'}</td>
                        <td className="py-1 px-2 border border-gray-300">{t.category}</td>
                        <td className="py-1 px-2 border border-gray-300">{t.description}</td>
                        <td className="py-1 px-2 border border-gray-300 text-red-600">-${t.amount.toFixed(2)}</td>
                        <td className="py-1 px-2 border border-gray-300">{new Date(t.timestamp).toLocaleString()}</td>
                        <td className="py-1 px-2 border border-gray-300">{t.file?.url ? (
                          <a href={t.file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                            View
                          </a>
                        ) : (
                          "-"
                        )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-between mb-6">
                <button
                  onClick={() => setExpensePage(p => Math.max(1, p - 1))}
                  disabled={expensePage === 1}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span>Page {expensePage} of {expensePageCount}</span>
                <button
                  onClick={() => setExpensePage(p => Math.min(expensePageCount, p + 1))}
                  disabled={expensePage === expensePageCount}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default FundRaising;
