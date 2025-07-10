import React, { useEffect, useState } from "react";

const ParticipantsTable = ({ eventId }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/participants?event_id=${eventId}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [eventId]);

  return (
    <div>
      <h2>Participants for Event ID: {eventId}</h2>
      <table border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>UserID</th>
            <th>Email</th>
            <th>Submitted Date</th>
            <th>Feedback</th>
            <th>Suggestions</th>
            <th>Rating</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.Name}</td>
              <td>{row.UserID}</td>
              <td>{row.Email}</td>
              <td>{row["submitted date"]}</td>
              <td>{row.feedback}</td>
              <td>{row.suggestions}</td>
              <td>{row.rating}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantsTable;
