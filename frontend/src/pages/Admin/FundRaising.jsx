import React, { useEffect, useState, useRef } from 'react';
import Header from "../../components/Admin/Header";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import AdminSidebar from "../../components/Admin/AdminSidebar";
import BarChartComponent from '@/components/Fund/BarChartComponent';
import { FaTrash, FaEye } from 'react-icons/fa';
import StickyHeadTable from "../../components/Admin/StickyHeadTable";

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF6666', '#AA88FF'];
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

  const fileInputRef = useRef(null);

  const categoryOptions = {
    income: ['Donation', 'Sponsorship', 'Grant'],
    expense: [
      'Administrative Expenses',
      'Training & Session Delivery Costs',
      'Marketing & Outreach',
      'Event/Session Logistics',
      'Staff & Volunteer Costs',
      'Program Development',
      'Monitoring & Evaluation'
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

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !['application/pdf', 'image/png', 'image/jpeg'].includes(selected.type)) {
      alert('Only PDF or image files are allowed');
      return;
    }
    setFile(selected);
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`❌ Failed to delete: ${errorData.error || 'Unknown error'}`);
        return;
      }

      // Refresh data after deletion
      await Promise.all([fetchTransactions(), fetchSummary(), fetchChartData()]);
      setMessage("✅ Transaction deleted");
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert("❌ Error deleting transaction");
    }
  };

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
        if (fileInputRef.current) {
          fileInputRef.current.value = null; // This resets the file input field
        }
        return; // Stop here to avoid success message
      }

      // On success, reset form and refetch data
      setDescription('');
      setAmount('');
      setCategory('');
      setDonorName('');
      setBeneficiaryName('');
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // This resets the file input field
      }
      // No need to reset incomePage/expensePage here, StickyHeadTable manages its own
      // setIncomePage(1);
      // setExpensePage(1);

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
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // This resets the file input field
      }
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

  // Filter income and expense transactions
  const incomeTransactions = transactions.filter(t => t.type === 'income');
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // --- Define Columns for Income Table ---
  const incomeColumns = [
    { id: 'donorName', label: 'Donor/Organization', minWidth: 150 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'description', label: 'Description', minWidth: 180 },
    {
      id: 'timestamp',
      label: 'Date',
      minWidth: 170,
      format: (value) => new Date(value).toLocaleString(),
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 100,
      align: 'right',
      render: (value) => <span className="text-green-600">+{value.toFixed(2)}</span>,
    },
    {
      id: 'file',
      label: 'File',
      minWidth: 80,
      align: 'center',
      render: (file, row) => (
        <div className="flex justify-center items-center h-full">
          {file?.url ? (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              <FaEye className="text-blue-700 hover:scale-125" size={20} />
            </a>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <button
          onClick={() => handleDeleteTransaction(row._id)}
          className="text-red-600 hover:underline"
        >
          <FaTrash className="text-red hover:scale-125" size={20} />
        </button>
      ),
    },
  ];

  // --- Define Columns for Expense Table ---
  const expenseColumns = [
    { id: 'beneficiaryName', label: 'Beneficiary\'s Name', minWidth: 150 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'description', label: 'Description', minWidth: 180 },
    {
      id: 'timestamp',
      label: 'Date',
      minWidth: 170,
      format: (value) => new Date(value).toLocaleString(),
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 100,
      align: 'right',
      render: (value) => <span className="text-red-600">-{value.toFixed(2)}</span>,
    },
    {
      id: 'file',
      label: 'File',
      minWidth: 80,
      align: 'center',
      render: (file, row) => (
        <div className="flex justify-center items-center">
          {file?.url ? (
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              <FaEye className="text-blue-700 hover:scale-125" size={20} />
            </a>
          ) : (
            '-'
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 80,
      align: 'center',
      render: (_, row) => (
        <button
          onClick={() => handleDeleteTransaction(row._id)}
          className="text-red-600 hover:underline"
        >
          <FaTrash className="text-red hover:scale-125" size={20} />
        </button>
      ),
    },
  ];

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
                <label htmlFor="type" className="block mb-2 text-sm font-medium">Type</label>
                <select
                  id="type"
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

                <label htmlFor="category" className="block mb-2 text-sm font-medium">Category</label>
                <select
                  id="category"
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
                    <label htmlFor="donorName" className="block mb-2 text-sm font-medium">Donor / Organization Name</label>
                    <input
                      id="donorName"
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
                    <label htmlFor="beneficiaryName" className="block mb-2 text-sm font-medium">Beneficiary Name</label>
                    <input
                      id="beneficiaryName"
                      type="text"
                      value={beneficiaryName}
                      onChange={e => setBeneficiaryName(e.target.value)}
                      className="w-full border p-2 rounded mb-4"
                      placeholder="Enter Beneficiary Name"
                    />
                  </>
                )}

                <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                  placeholder="Enter description"
                />

                <label htmlFor="amount" className="block mb-2 text-sm font-medium">Amount</label>
                <input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full border p-2 rounded mb-4"
                  placeholder="$0.00"
                />

                <label htmlFor="transcriptFile" className="block mb-2 text-sm font-medium">Upload Transcript</label>
                <input
                  id="transcriptFile"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
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
                <div className="bg-white h-64 rounded border shadow p-4">
                  <h2 className="text-center font-semibold mb-2">Income Breakdown</h2>
                  <div className="flex h-full">
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
                </div>

                {/* Expense Pie Chart */}
                <div className="bg-white h-64 rounded border shadow p-4">
                  <h2 className="text-center font-semibold mb-2">Expenses Breakdown</h2>
                  <div className="flex h-full">
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
                          <div
                            className="w-4 h-4 rounded mr-2"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm">{entry.name} (${entry.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


                {/* Bar Chart */}
                <BarChartComponent data={barChartData} title="Income vs Expense" />
              </div>
            </div>

            {/* Income Transactions Table */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Income Transactions</h2>
              {/* Replace the old table with StickyHeadTable */}
              <StickyHeadTable columns={incomeColumns} rows={incomeTransactions} />
            </div>

            {/* Expense Transactions Table */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-2">Expense Transactions</h2>
              {/* Replace the old table with StickyHeadTable */}
              <StickyHeadTable columns={expenseColumns} rows={expenseTransactions} />
            </div>

          </div>
        </div>
      </main >
    </div >
  );
};

export default FundRaising;