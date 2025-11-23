import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { ChartConfig, DataRow } from '../types';

interface ChartRendererProps {
  config: ChartConfig;
  data: DataRow[];
}

// Palette matching the "Skillset" Dashboard image (Dark grays, Soft Blacks, one Indigo accent)
const COLORS = ['#1e293b', '#64748b', '#94a3b8', '#6366f1', '#cbd5e1', '#000000'];

const ChartRenderer: React.FC<ChartRendererProps> = ({ config, data }) => {
  if (!config) return null;
  const { type, xAxisKey, dataKeys = [] } = config;

  // Safety check for dataKeys
  const keys = Array.isArray(dataKeys) ? dataKeys : [];

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#334155' }}
              cursor={{fill: '#f1f5f9'}}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            {keys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={COLORS[index % COLORS.length]} 
                radius={[6, 6, 6, 6]} 
                barSize={40}
              />
            ))}
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            {keys.map((key, index) => (
              <Line 
                key={key} 
                type="monotone" 
                dataKey={key} 
                stroke={COLORS[index % COLORS.length]} 
                strokeWidth={3}
                dot={{ r: 0, fill: COLORS[index % COLORS.length] }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey={xAxisKey} stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} dy={10} />
            <YAxis stroke="#64748b" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip 
               contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
            {keys.map((key, index) => (
              <Area 
                key={key} 
                type="monotone" 
                dataKey={key} 
                fill={COLORS[index % COLORS.length]} 
                stroke={COLORS[index % COLORS.length]} 
                fillOpacity={0.2}
              />
            ))}
          </AreaChart>
        );
      case 'pie':
        const pieKey = keys[0] || '';
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey={pieKey}
              nameKey={xAxisKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
          </PieChart>
        );
      case 'scatter':
        const scatterYKey = keys[0] || '';
        return (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis type="category" dataKey={xAxisKey} name={xAxisKey} stroke="#64748b" axisLine={false} tickLine={false} dy={10} />
            <YAxis type="number" dataKey={scatterYKey} name={scatterYKey} stroke="#64748b" axisLine={false} tickLine={false} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} 
               contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Scatter name={config.title} data={data} fill={COLORS[0]} />
          </ScatterChart>
        );
      default:
        return <div className="flex items-center justify-center h-full text-slate-400">Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartRenderer;