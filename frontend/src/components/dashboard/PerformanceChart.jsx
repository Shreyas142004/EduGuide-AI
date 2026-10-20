import React from 'react';
import Card from '../common/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { BarChart2 } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const PerformanceChart = ({ data = [] }) => {
  const { isDark } = useTheme();

  const formattedData = data.map((d) => ({
    name: d.subjectName || d.name || 'Subject',
    score: d.percentage || d.score || 0,
    priority: d.priority || 'MEDIUM',
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white dark:bg-[#1D1533] border border-[#EDE9FE] dark:border-[#352750] p-3 rounded-2xl shadow-xl">
          <p className="font-semibold text-xs text-[#241A3D] dark:text-[#F5F3FF]">{label}</p>
          <p className="text-sm font-bold text-[#7C3AED] dark:text-[#A78BFA] mt-1">
            Recorded Score: {p.score}%
          </p>
          <span
            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              p.priority === 'HIGH'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                : p.priority === 'MEDIUM'
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}
          >
            {p.priority} Priority
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Academic Performance Overview" icon={BarChart2}>
      <div className="h-64 w-full">
        {formattedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-[#8B7EA8]">
            No subject score data recorded yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={isDark ? '#352750' : '#EDE9FE'}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: isDark ? '#C4B5FD' : '#5B4E7A', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: isDark ? '#C4B5FD' : '#5B4E7A', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={60}
                stroke="#EF4444"
                strokeDasharray="4 4"
                label={{ value: 'Weakness Threshold (60%)', fill: '#EF4444', fontSize: 10, position: 'top' }}
              />
              <ReferenceLine
                y={75}
                stroke="#10B981"
                strokeDasharray="4 4"
                label={{ value: 'Target Benchmark (75%)', fill: '#10B981', fontSize: 10, position: 'top' }}
              />
              <Bar
                dataKey="score"
                radius={[8, 8, 0, 0]}
                fill={isDark ? '#8B5CF6' : '#7C3AED'}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default PerformanceChart;
