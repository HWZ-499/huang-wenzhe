import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../context/AppContext';

const StatsChart: React.FC = () => {
  const { data } = useApp();

  // Generate last 7 days data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const stat = data.stats.find(s => s.date === dateStr);
    
    return {
      name: d.toLocaleDateString('zh-CN', { weekday: 'short' }),
      value: stat?.checkedIn ? 1 : 0.1, // 0.1 for visual placeholder
      isCompleted: !!stat?.checkedIn,
      fullDate: dateStr
    };
  });

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#D6BC96', fontSize: 12 }} 
            dy={10}
          />
          <YAxis hide domain={[0, 1]} />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-warm-800 text-warm-50 text-xs py-1 px-2 rounded-lg shadow-xl">
                    {payload[0].payload.isCompleted ? '已打卡' : '未打卡'}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isCompleted ? '#F97316' : '#EFE5D1'} 
                className="transition-all duration-500 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;