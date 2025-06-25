import React, { useState } from 'react';
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import MonitorSessionTable from "../../components/Admin/StickyHeadTable";
import 'react-calendar/dist/Calendar.css';
import { useEffect } from 'react';
import axios from 'axios';


const MonitoreSession = () => {
    const [date, setDate] = useState(new Date());

    // Example event dates (you can later fetch or generate these)
    const eventDates = [
        new Date(2025, 5, 25),
        new Date(2025, 5, 30)
    ];
    const [sessionData, setSessionData] = useState([]);

    const columns = [
        { id: 'courseCode', label: 'Course Code', minWidth: 100 },
        { id: 'lectureTitle', label: 'Lecture Title', minWidth: 170 },
        { id: 'attendees', label: 'Attendees', minWidth: 80, align: 'right' },
        { id: 'lecturer', label: 'Lecturer', minWidth: 150 },
        { id: 'location', label: 'Location', minWidth: 150 },
        {
            id: 'time',
            label: 'Time',
            minWidth: 150,
            format: (value) => new Date(value).toLocaleString()
        },
        { id: 'details', label: 'Details', minWidth: 200 }
    ];

    useEffect(() => {
        axios.get('http://localhost:5000/sessions')
            .then(res => {
                setSessionData(res.data);
            })
            .catch(err => {
                console.error('Failed to fetch sessions:', err);
            });
    }, [])

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

                        <MonitorSessionTable columns={columns} rows={sessionData} />

                    </div>
                </div>
            </main>

        </div>
    );
};

export default MonitoreSession;
