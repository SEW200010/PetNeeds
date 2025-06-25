import React, { useState } from 'react';
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import MonitorSessionTable from "../../components/Admin/StickyHeadTable";

import 'react-calendar/dist/Calendar.css';



const AdminDashboard = () => {
    const [date, setDate] = useState(new Date());

    // Example event dates (you can later fetch or generate these)
    const eventDates = [
        new Date(2025, 5, 25),
        new Date(2025, 5, 30)
    ];

    const columns = [
  { id: 'name', label: 'Session Name', minWidth: 170 },
  { id: 'participants', label: 'Participants', minWidth: 100, align: 'right' },
  {
    id: 'date',
    label: 'Date',
    minWidth: 170,
    align: 'right',
    format: (value) => new Date(value).toLocaleDateString(),
  },
];

const rows = [
  { name: 'Session A', participants: 25, date: '2025-06-20' },
  { name: 'Session B', participants: 40, date: '2025-06-22' },
  { name: 'Session C', participants: 15, date: '2025-06-24' },
   { name: 'Session A', participants: 25, date: '2025-06-20' },
  { name: 'Session B', participants: 40, date: '2025-06-22' },
  { name: 'Session C', participants: 15, date: '2025-06-24' },
   { name: 'Session A', participants: 25, date: '2025-06-20' },
  { name: 'Session B', participants: 40, date: '2025-06-22' },
  { name: 'Session C', participants: 15, date: '2025-06-24' },
   { name: 'Session A', participants: 25, date: '2025-06-20' },
  { name: 'Session B', participants: 40, date: '2025-06-22' },
  { name: 'Session C', participants: 15, date: '2025-06-24' },
   { name: 'Session A', participants: 25, date: '2025-06-20' },
  { name: 'Session B', participants: 40, date: '2025-06-22' },
  { name: 'Session C', participants: 15, date: '2025-06-24' },
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

                    <MonitorSessionTable columns={columns} rows={rows} />


                      

                        
                    </div>
                </div>
            </main>

        </div>
    );
};

export default AdminDashboard;
