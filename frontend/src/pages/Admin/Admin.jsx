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
                {/* Main 2-column layout */}
                <div className="flex">

                    {/* Left Panel (Sidebar with profile and menu) */}
                    <div className="w-1/4 bg-white p-6 shadow-md min-h-screen">

                        {/* Profile Box */}
                        <div className="bg-gray-100 p-4 rounded-lg shadow mb-6 flex items-center">
                            <img
                                src="https://via.placeholder.com/48"
                                alt="Profile"
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <p className="text-lg font-semibold text-gray-800">John Doe</p>
                                <p className="text-sm text-gray-500">Admin</p>
                            </div>
                        </div>

                        {/* Sidebar Menu */}
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Admin Menu</h2>
                        <div className="bg-white border border-gray-300 rounded-lg p-4">
                            <nav className="space-y-4">
                                <a href="/admin-dashboard" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    🏠 Dashboard
                                </a>
                                <a href="/user-management" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    👤 User Management
                                </a>
                                <a href="/event-management" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    📅 Event Management
                                </a>
                                <a href="/monitor-students" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    🎓 Monitor Students
                                </a>
                                <a href="/explore-model" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    🤖 Explore Model
                                </a>
                                <a href="/fundraising" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    💰 Manage Fundraising
                                </a>
                                <a href="/monitor-sessions" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    📊 Monitor Sessions
                                </a>
                                <a href="/settings" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    📝 Create Forms
                                </a>
                                <a href="/settings" className="block px-4 py-2 rounded-md text-gray-700 bg-gray-100 border border-gray-300 hover:bg-[#5CBFA0] hover:border-green-400 font-medium">
                                    ⚙️ Settings
                                </a>
                            </nav>
                        </div>

                        {/* Calendar Section */}
                        <div className="mt-6 bg-white border border-gray-300 rounded-lg p-4">
                            <h2 className="text-lg font-bold text-gray-800 mb-3">📆 Upcoming Events</h2>

                            <Calendar
                                onChange={setDate}
                                value={date}
                                tileClassName={({ date, view }) =>
                                    view === 'month' && eventDates.find(d => d.toDateString() === date.toDateString())
                                        ? 'highlighted-day'
                                        : null
                                }
                            />
                        </div>

                    </div>


                    {/* Right Panel */}

                    <div className="w-3/4 m-10 justify-center items-center p-4">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Admin Dashboard</h1>
                        <p className="mb-4">Overview of contributions and engagement metrics.</p>

                        <div className="bg-[#D9D9D9BA] p-6 rounded-lg shadow-md flex flex-wrap justify-center">
                            <DashboardCard
                                to="/user-management"
                                icon={userIcon}
                                title="User Management"
                                gradientColors={['#F222E4', '#AC2CEB']}
                            />
                            <DashboardCard
                                to="/event-management"
                                icon={eventIcon}
                                title="Event Management"
                                gradientColors={['#1CAB21', '#091E11']}
                            />
                            <DashboardCard
                                to="/monitor-students"
                                icon={monitorIcon}
                                title="Monitor Students"
                                gradientColors={['#3750E0', '#695AE1']}
                            />
                            <DashboardCard
                                to="/explore-model"
                                icon={modelIcon}
                                title="Explore model"
                                gradientColors={['#F2AD22', '#EA371B']}
                            />
                        </div>

                        <div className=" mt-15 flex flex-wrap w-full gap-12 justify-center">
                            {/* Engagement Metrics Section */}
                            <div className="flex flex-col items-start w-full md:w-[40%]">
                                <h2 className="text-xl font-bold mb-2 text-gray-800">Engagement Metrics</h2>
                                <div className="bg-[#D9D9D9BA] p-4 rounded-xl shadow-lg w-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Box 1 */}
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">🔐</span>
                                                1,245  <br /><strong> Total Logins</strong>
                                            </p>
                                        </div>

                                        {/* Box 2 */}
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">👥</span>
                                                1,245  <br /><strong> Total Logins</strong>
                                            </p>
                                        </div>

                                        {/* Box 3 */}
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">✅</span>
                                                1,245  <br /><strong> Total Logins</strong>
                                            </p>
                                        </div>

                                        {/* Box 4 */}
                                        <div className="bg-white p-4 rounded-lg shadow">
                                            <p className="text-gray-800 text-lg font-medium">
                                                <span className="mr-2">🆕</span>
                                                1,245  <br /><strong> Total Logins</strong>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pie Chart Section */}
                            <div className="flex flex-col items-start w-full md:w-[55%]">
                                <h2 className="text-xl font-bold mb-2 ml-2 text-gray-800">Fundraising Status</h2>
                                <div className="bg-white p-4 rounded-xl shadow-lg w-full">
                                    {/* Replace with actual PieChart component or image */}
                                    <div className="h-48 flex items-center justify-center text-gray-500">
                                        [ Pie Chart Placeholder ]
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className=" mt-15 flex flex-wrap w-full  justify-center">
                            {/* Line Chart Section */}
                            <div className="flex flex-col items-start w-full ">
                                <h2 className="text-xl font-bold mb-2 ml-2 text-gray-800">Contribution Trends</h2>
                                <div className="bg-[#D9D9D9BA] p-4 rounded-xl shadow-lg w-full">
                                    {/* Replace with actual PieChart component or image */}
                                    <div className="h-48 flex items-center justify-center text-gray-500">
                                        [ Line Chart Placeholder ]
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
