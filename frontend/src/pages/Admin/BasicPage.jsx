import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import StickyHeadTable from "../../components/Admin/StickyHeadTable";

const BasicPage = () => {
  const { id } = useParams(); // event ID
  const [participantData, setParticipantData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`http://localhost:5000/participants?event_id=${id}`);
        if (!res.ok) throw new Error("Error fetching details");
        const data = await res.json();
        setParticipantData(data);
        setError(null);
        console.log("Fetched data:", data);
      } catch (err) {
        console.error("Failed to load details:", err);
        setError("Failed to load details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id]);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-[65px]">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar date={date} setDate={setDate} eventDates={[]} />
          <main className="flex-1 p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Event Management</h1>
            <br></br>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-6">Participants Details</h3>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-600 font-semibold">{error}</p>
            ) : (
              <div className="bg-white rounded-md shadow p-4 overflow-x-auto">
                <StickyHeadTable
                  columns={[
                    { id: "id", label: "ID" },
                    { id: "name", label: "Name" },
                    { id: "userid", label: "UserID" },
                    { id: "email", label: "Email" },
                    { id: "status", label: "Status" },
                  ]}
                  rows={participantData.map((item) => ({
                    id: item.id || item.ID,
                    name: item.Name || item.name,
                    userid: item.UserID || item.userid,
                    email: item.Email || item.email,
                    status: item.status || item.Status,
                  }))}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default BasicPage;
