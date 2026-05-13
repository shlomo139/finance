"use client";

import { useEffect, useState } from "react";
import { getTransactionsAction } from "@/app/actions/data";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import ChartFilter from "../ChartFilter";

export default function MonthOverMonthChart() {
  const [data, setData] = useState<any[]>([]);
  const [category, setCategory] = useState("");
  const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTransactionsAction("", category).then(txs => {
      const expenses = txs.filter(t => t.type === "expense");
      
      const grouped = new Map();
      expenses.forEach(t => {
        const d = new Date(t.date);
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        
        if (!grouped.has(m)) grouped.set(m, 0);
        grouped.set(m, grouped.get(m) + Math.abs(Number(t.amount)));
      });
      
      let chartData = Array.from(grouped.entries()).map(([month, amount]) => ({ month, amount }));
      chartData.sort((a, b) => a.month.localeCompare(b.month)); // chronological

      // Filter by selectedMonths if any
      if (selectedMonths.length > 0) {
        chartData = chartData.filter(d => selectedMonths.includes(d.month));
      }
      
      setData(chartData);
      setLoading(false);
    });
  }, [category, selectedMonths]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-outline-variant)] relative overflow-hidden">
      
      <div className="bg-[#375657] w-full px-4 py-3 flex justify-between items-center relative border-b border-[var(--color-outline-variant)]">
        <h2 className="text-lg font-black text-[#CFE8E8] m-0 leading-none">השוואת הוצאות לאורך זמן</h2>
        <div className="z-10 flex gap-2">
          <ChartFilter 
            selectedMonth={""} setSelectedMonth={() => {}}
            selectedCategory={category} setSelectedCategory={setCategory}
            hideMonth={false}
            multiMonthMode={true}
            selectedMonths={selectedMonths}
            setSelectedMonths={setSelectedMonths}
            inline={true}
          />
        </div>
      </div>

      <div className="p-4">
        {loading ? (
        <div className="h-64 flex items-center justify-center text-[var(--color-on-surface-variant)]">טוען נתונים...</div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-[var(--color-on-surface-variant)]">אין נתונים להצגה</div>
      ) : (
        <div className="h-64 w-full mt-4" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₪${v}`} width={60}/>
              <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(v) => `₪${Number(v).toFixed(0)}`} labelStyle={{color: '#1e293b'}}/>
              <Line type="monotone" dataKey="amount" stroke="#DB3800" strokeWidth={3} dot={{r: 4, fill: '#DB3800'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      </div>
    </div>
  );
}
