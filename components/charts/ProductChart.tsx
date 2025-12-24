"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useEffect, useState } from "react";

export default function ProductChart({ data }: { data: any[] }) {
  // 1. SAFETY FIX: Wait for browser to load
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If not loaded yet, show a gray placeholder box (prevents invisible collapse)
  if (!isMounted) {
    return <div className="bg-white p-6 border rounded shadow-sm h-96 animate-pulse"></div>;
  }

  // If no data, show empty state
  if (!data || data.length === 0) {
    return (
        <div className="p-6 border rounded shadow-sm text-center text-gray-500 h-96 flex items-center justify-center">
            No products available to display.
        </div>
    );
  }

  return (
    <div className="bg-white p-6 border rounded shadow-sm">
      <h2 className="text-xl font-bold mb-4">Stock Levels</h2>
      
      {/* 2. HEIGHT FIX: Hardcoded style ensures it can't collapse to 0px */}
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(value: number) => `${value}`} 
            />
            <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar 
                dataKey="stock" 
                fill="#2563eb" 
                radius={[4, 4, 0, 0]} 
                barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}