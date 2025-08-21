import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BarChartComponent = ({ data, title = "Income vs Expense" }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value)) * 1.2;

    return (
        <div className="bg-white h-64 rounded border shadow p-4">
            <h3 className="text-center font-semibold mb-2">{title}</h3>
             <ResponsiveContainer width="100%" height="90%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barCategoryGap="40%"
                >
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, maxValue]} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={index === 0 ? '#0088FE' : '#FF8042'} // first bar blue, second orange
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
