import React, { useState, useEffect } from 'react';
import DashboardCard from "../../components/Admin/DashboardCard";
import userIcon from "../../assets/Admin/image3.png";
import eventIcon from "../../assets/Admin/image2.png";
import monitorIcon from "../../assets/Admin/image1.png";
import modelIcon from "../../assets/Admin/image4.png";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import 'react-calendar/dist/Calendar.css';
import BarChartComponent from '@/components/Fund/BarChartComponent';
import LineChartComponent from '@/components/Fund/LineChartComponent';

const AdminDashboard = () => {
    const [date, setDate] = useState(new Date());
    const [barChartData, setBarChartData] = useState([]);
    const [engagementMetrics, setEngagementMetrics] = useState({
        totalLogins: 0,
        totalUsers: 0,
        totalEvents: 0,
        totalParticipants: 0
    });
    const [contributionTrends, setContributionTrends] = useState([]);
    const [managementTrends, setManagementTrends] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch chart data
                const chartRes = await fetch('http://127.0.0.1:5000/api/chart-data');
                const chartData = await chartRes.json();
                setBarChartData([
                    { name: 'Income', value: chartData.income },
                    { name: 'Expense', value: chartData.expense },
                ]);

                // Fetch engagement metrics
                const engagementRes = await fetch('http://127.0.0.1:5000/api/engagement-metrics');
                if (engagementRes.ok) {
                    const engagementData = await engagementRes.json();
                    setEngagementMetrics(engagementData);
                }

                // Fetch contribution trends (financial)
                const trendsRes = await fetch('http://127.0.0.1:5000/api/contribution-trends');
                if (trendsRes.ok) {
                    const trendsData = await trendsRes.json();
                    setContributionTrends(trendsData);
                }

                // Fetch management trends (users & events)
                const mgRes = await fetch('http://127.0.0.1:5000/api/management-trends');
                if (mgRes.ok) {
                    const mgData = await mgRes.json();
                    setManagementTrends(mgData);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };

        fetchAllData();
    }, []);

    // Example event dates (you can later fetch or generate these)
    const eventDates = [
        new Date(2025, 5, 25),
        new Date(2025, 5, 30)
    ];
    // derive selected month label from calendar date
    const selectedMonthLabel = React.useMemo(() => {
        try {
            return date ? date.toLocaleString('default', { month: 'short', year: 'numeric' }) : '';
        } catch (e) {
            return '';
        }
    }, [date]);

    const selectedManagementData = React.useMemo(() => {
        if (!managementTrends || managementTrends.length === 0) return null;
        return managementTrends.find(m => m.month === selectedMonthLabel) || null;
    }, [managementTrends, selectedMonthLabel]);
    return (
        <div>
            <Header />
            <main className="bg-gray-100 pt-[65px] min-h-screen">
                <div className="flex flex-col md:flex-row">

                    {/* left panel- Sidebar */}
                    <AdminSidebar date={date} setDate={setDate} eventDates={eventDates} />

                    {/* Right Panel */}
                    <div className="w-full md:w-3/4 px-4 py-6">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Admin Dashboard</h1>
                        <p className="mb-4">Overview of contributions and engagement metrics.</p>

                        {/* Dashboard Cards */}
                        <div className="bg-[#D9D9D9BA] p-6 rounded-lg shadow-md flex flex-wrap justify-center gap-4">
                            <DashboardCard to="/user-management" icon={userIcon} title="User Management" gradientColors={['#F222E4', '#AC2CEB']} />
                            <DashboardCard to="/event-management" icon={eventIcon} title="Event Management" gradientColors={['#1CAB21', '#091E11']} />
                            <DashboardCard to="/monitor-students" icon={monitorIcon} title="Monitor Students" gradientColors={['#3750E0', '#695AE1']} />
                            <DashboardCard to="/explore-model" icon={modelIcon} title="Explore model" gradientColors={['#F2AD22', '#EA371B']} />
                        </div>

                        {/* Engagement + Fundraising */}
                        <div className="mt-10 flex flex-col md:flex-row gap-8">
                            {/* Engagement */}
                            <div className="w-full md:w-[45%]">
                                <h2 className="text-xl font-bold mb-2 text-gray-800">Engagement Metrics</h2>
                                <div className="bg-[#D9D9D9BA] p-4 rounded-xl shadow-lg">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">🔐</span>
                                                {engagementMetrics.totalLogins} <br /><strong>Total Logins</strong>
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">👥</span>
                                                {engagementMetrics.totalUsers} <br /><strong>Total Users</strong>
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">✅</span>
                                                {engagementMetrics.totalEvents} <br /><strong>Total Events</strong>
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">🆕</span>
                                                {engagementMetrics.totalParticipants} <br /><strong>Participants</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fundraising */}
                            <div className="w-full md:w-[55%]">
                                <h2 className="text-xl font-bold mb-2 text-gray-800">Fundraising Status</h2>
                                {/*<div className="bg-white p-4 rounded-xl shadow-lg h-full">*/}
                                    <BarChartComponent data={barChartData} title="Income vs Expense" />
                                {/*</div>*/}
                            </div>
                        </div>

                        {/* Management Trends (users & events) */}
                        <div className="mt-10">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">User & Event Management Trends (Last 12 Months)</h2>
                            <div className="bg-[#D9D9D9BA] p-4 rounded-xl shadow-lg">
                                {/* Selected month summary (syncs with sidebar calendar) */}
                                <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white p-3 rounded-lg shadow flex flex-col justify-center">
                                        <div className="text-sm text-gray-500">Selected Month</div>
                                        <div className="text-lg font-semibold text-gray-800">{selectedMonthLabel || '—'}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg shadow flex flex-col justify-center">
                                        <div className="text-sm text-gray-500">Registrations</div>
                                        <div className="text-lg font-semibold text-indigo-600">{selectedManagementData ? selectedManagementData.users : '—'}</div>
                                    </div>
                                    <div className="bg-white p-3 rounded-lg shadow flex flex-col justify-center">
                                        <div className="text-sm text-gray-500">Events Created</div>
                                        <div className="text-lg font-semibold text-green-600">{selectedManagementData ? selectedManagementData.events : '—'}</div>
                                    </div>
                                </div>

                                <LineChartComponent data={managementTrends} title="Registrations vs Events" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AdminDashboard;
