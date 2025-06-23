import DashboardCard from "../../components/Admin/DashboardCard";
import userIcon from "../../assets/Admin/image3.png";
import eventIcon from "../../assets/Admin/image2.png";
import monitorIcon from "../../assets/Admin/image1.png";
import modelIcon from "../../assets/Admin/image4.png";
import Header from "../../components/Admin/Header";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react'; // ✅ Make sure this is at the top if not already




const AdminDashboard = () => {
    const [date, setDate] = useState(new Date());

    // Example event dates (you can later fetch or generate these)
    const eventDates = [
        new Date(2025, 5, 25),
        new Date(2025, 5, 30)
    ];
    return (
        <div>
            <Header />
            <main className="bg-gray-100 pt-[65px] min-h-screen">
                <div className="flex flex-col md:flex-row">

                    {/* left panel- Sidebar */}
                    <div className="w-full md:w-1/4 bg-white p-4 md:p-6 shadow-md">
                        {/* Profile */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow mb-6 flex items-center">
                            <img src="https://via.placeholder.com/48" alt="Profile" className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="text-lg font-semibold text-gray-800">John Doe</p>
                                <p className="text-sm text-gray-500">Admin</p>
                            </div>
                        </div>

                        {/* Sidebar Menu */}
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Menu</h2>
                        <div className="border border-gray-300 rounded-lg p-4 space-y-2">
                            {/* Sidebar Links */}
                            {[
                                { label: "🏠 Dashboard", href: "/admin-dashboard" },
                                { label: "👤 User Management", href: "/user-management" },
                                { label: "📅 Event Management", href: "/event-management" },
                                { label: "🎓 Monitor Students", href: "/monitor-students" },
                                { label: "🤖 Explore Model", href: "/explore-model" },
                                { label: "💰 Manage Fundraising", href: "/fundraising" },
                                { label: "📊 Monitor Sessions", href: "/monitor-sessions" },
                                { label: "📝 Create Forms", href: "/settings" },
                                { label: "⚙️ Settings", href: "/settings" },
                            ].map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>

                        {/* Calendar */}
                        <div className="mt-6 border border-gray-300 rounded-lg p-4">
                            <h2 className="text-lg font-bold text-gray-800 mb-3">📆 Upcoming Events</h2>
                            <Calendar
                                onChange={setDate}
                                value={date}
                                tileClassName={({ date: day, view }) =>
                                    view === 'month' && eventDates.find(d => d.toDateString() === day.toDateString())
                                        ? 'highlighted-day'
                                        : null
                                }
                            />
                        </div>
                    </div>

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
                                        {["🔐", "👥", "✅", "🆕"].map((icon, idx) => (
                                            <div key={idx} className="bg-white p-4 rounded-lg shadow">
                                                <p className="text-gray-800 text-lg font-medium">
                                                    <span className="mr-2">{icon}</span>
                                                    1,245 <br /><strong>Total Logins</strong>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Fundraising */}
                            <div className="w-full md:w-[55%]">
                                <h2 className="text-xl font-bold mb-2 text-gray-800">Fundraising Status</h2>
                                <div className="bg-white p-4 rounded-xl shadow-lg h-full">
                                    <div className="h-48 flex items-center justify-center text-gray-500">[ Pie Chart Placeholder ]</div>
                                </div>
                            </div>
                        </div>

                        {/* Line Chart */}
                        <div className="mt-10">
                            <h2 className="text-xl font-bold mb-2 text-gray-800">Contribution Trends</h2>
                            <div className="bg-[#D9D9D9BA] p-4 rounded-xl shadow-lg">
                                <div className="h-48 flex items-center justify-center text-gray-500">[ Line Chart Placeholder ]</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AdminDashboard;
