import DashboardCard from "../../components/Admin/DashboardCard";
import userIcon from "../../assets/Admin/image3.png";
import eventIcon from "../../assets/Admin/image2.png";
import monitorIcon from "../../assets/Admin/image1.png";
import modelIcon from "../../assets/Admin/image4.png";
import Header from "../../components/Admin/Header";

const AdminDashboard = () => {
    return (
        <div>
            <Header />
            <main className="bg-gray-100 pt-[65px] min-h-screen">
                {/* Main 2-column layout */}
                <div className="flex">

                    {/* Left Panel */}
                    <div className="w-1/4 bg-white m- 10 p-4 shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Left Panel</h2>
                        <p>Add your new content here.</p>
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
