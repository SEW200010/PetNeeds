import React, { useState } from 'react';
import DashboardCard from "../../components/Admin/DashboardCard";
import userIcon from "../../assets/Admin/image3.png";
import eventIcon from "../../assets/Admin/image2.png";
import monitorIcon from "../../assets/Admin/image1.png";
import modelIcon from "../../assets/Admin/image4.png";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import 'react-calendar/dist/Calendar.css';


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
                    <AdminSidebar date={date} setDate={setDate} eventDates={eventDates} />

                    {/* Right Panel */}
                    <div className="w-full md:w-3/4 px-4 py-6">
                        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Monitor Sessions</h1>
                        <p className="mb-4">Overview of contributions and engagement metrics.</p>

                        

                      

                        
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AdminDashboard;
