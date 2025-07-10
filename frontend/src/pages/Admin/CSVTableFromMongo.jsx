import React, { useEffect, useState } from "react";

const CSVTableFromMongo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/participants")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch participants:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Loading participants...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Participant List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              {data[0] &&
                Object.keys(data[0]).map((key, idx) => (
                  <th key={idx} className="border px-4 py-2 text-left capitalize">
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((participant, index) => (
              <tr key={index} className="border-t hover:bg-gray-50">
                {Object.values(participant).map((val, idx) => (
                  <td key={idx} className="border px-4 py-2">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CSVTableFromMongo;
