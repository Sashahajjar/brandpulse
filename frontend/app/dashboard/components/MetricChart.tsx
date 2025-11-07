'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface MetricChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  type?: 'line' | 'bar';
  title: string;
  description?: string;
  color?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  valueFormatter?: (value: number) => string;
}

export default function MetricChart({ 
  data, 
  type = 'line', 
  title,
  description,
  color = '#8b7355',
  yAxisLabel,
  xAxisLabel,
  valueFormatter
}: MetricChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  // Default formatters
  const formatValue = valueFormatter || ((value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toFixed(1);
  });

  const formatTooltipValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)} million`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} thousand`;
    }
    return `${value.toFixed(2)}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-1">{`${xAxisLabel || 'Period'}: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${yAxisLabel || 'Value'}: ${formatTooltipValue(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
      className="rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            fontSize={12}
            label={{ 
              value: xAxisLabel || 'Time Period', 
              position: 'insideBottom', 
              offset: -5,
              style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 11 }
            }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={formatValue}
            label={{ 
              value: yAxisLabel || 'Value', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 11 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            iconType="line"
          />
          <DataComponent
            type="monotone"
            dataKey="value"
            name={yAxisLabel || 'Value'}
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.6}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6 }}
          />
        </ChartComponent>
      </ResponsiveContainer>
      
      {data.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No data available for this metric
        </div>
      )}
    </motion.div>
  );
}
