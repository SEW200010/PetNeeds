// pages/AdminDashboard.js
import DashboardCard from "../../components/Admin/DashboardCard";
import userIcon from "../../assets/Admin/image3.png";
import eventIcon from "../../assets/Admin/image2.png";
import monitorIcon from "../../assets/Admin/image1.png";
import modelIcon from "../../assets/Admin/image4.png";
import Header from "../../components/Admin/Header";

const AdminDashboard = () => {
    return (
        <div>
            <div>
                <Header />
            </div>
            <main className="bg-gray-100 pt-[65px]">
                <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                    <div className="bg-[#D9D9D9BA] p-6 rounded-lg shadow-md flex flex-wrap justify-center">
                        <DashboardCard
                            to="/user-management"
                            icon={userIcon}
                            title="User Management"
                           gradientColors={['#F222E4', '#AC2CEB']} // green gradient
                           />
                        <DashboardCard
                            to="/event-management"
                            icon={eventIcon}
                            title="Event Management"
                            gradientColors={['#1CAB21', '#091E11']} // blue gradient
                        />
                        <DashboardCard
                            to="/monitor-students"
                            icon={monitorIcon}
                            title="Monitor Students"
                            gradientColors={['#3750E0', '#695AE1']} // pink to purple
/>
                        <DashboardCard
                            to="/explore-model"
                            icon={modelIcon}
                            title="Explore model"
                            gradientColors={['#F2AD22', '#EA371B']} // pink to purple
/>
                        
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
