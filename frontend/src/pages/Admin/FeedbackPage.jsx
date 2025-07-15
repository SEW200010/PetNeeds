import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/Admin/Header";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import StickyHeadTable from "../../components/Admin/StickyHeadTable";

const FeedbackPage = () => {
  const { id } = useParams(); // event ID
  const [feedbackData, setFeedbackData] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    fetch(`http://localhost:5000/participants?event_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFeedbackData(data);
        calculateAverageRating(data); // 👈 calculate after data is loaded
      })
      .catch((err) => {
        console.error("Error fetching feedback:", err);
        alert("Failed to load feedback.");
        setError("Failed to fetch feedback.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const calculateAverageRating = (data) => {
    const ratings = data.map((item) => Number(item.rating)).filter((r) => !isNaN(r));
    const total = ratings.reduce((sum, r) => sum + r, 0);
    const average = ratings.length ? (total / ratings.length).toFixed(2) : null;
    setAvgRating(average);
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-[65px]">
        <div className="flex flex-col md:flex-row">
          <AdminSidebar date={date} setDate={setDate} eventDates={[]} />
          <main className="flex-1 p-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Event Management</h1>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-6">Feedback Details</h3>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-600 font-semibold">{error}</p>
            ) : (
              <div className="bg-white rounded-md shadow p-4 overflow-x-auto">
                <p className="text-lg font-semibold mb-4">
                  Average Rating: {avgRating !== null ? `${avgRating}` : "Not available"}
                </p>
                <StickyHeadTable
                  columns={[
                    { id: "id", label: "ID" },
                    { id: "name", label: "Name" },
                    { id: "submitted_date", label: "Submitted Date" },
                    { id: "feedback", label: "Feedback" },
                    { id: "suggestions", label: "Suggestions" },
                    { id: "rating", label: "Rating" },
                  ]}
                  rows={feedbackData.map((item, index) => ({
                    id: item.id || index + 1,
                    name: item.Name,
                    submitted_date: item["submitted date"] || item.submitted_date,
                    feedback: item.feedback,
                    suggestions: item.suggestions,
                    rating: item.rating,
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

export default FeedbackPage;
