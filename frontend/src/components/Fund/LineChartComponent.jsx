import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';

const LineChartComponent = ({ data, title = 'Management Trends' }) => {
    if (!data || data.length === 0) return (
        <div className="bg-white h-64 rounded border shadow p-4 flex items-center justify-center text-gray-500">No data</div>
    );

    // Find max value to adjust Y domain if needed
    const maxVal = Math.max(...data.map(d => Math.max(d.users || 0, d.events || 0))) * 1.2;

    return (
        <div className="bg-white h-64 rounded border shadow p-4">
            <h3 className="text-center font-semibold mb-2">{title}</h3>
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, Math.max(1, Math.ceil(maxVal))]} />
                    <Tooltip />
                    <Legend verticalAlign="top" height={24} />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="events" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;
