"use client";

import { useEffect, useState } from "react";
import { getTransactionsAction } from "@/app/actions/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import ChartFilter from "../ChartFilter";

export default function IncomeVsExpenseChart() {
  const [data, setData] = useState<any[]>([]);
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTransactionsAction(month, category).then(txs => {
      const grouped = new Map();
      txs.forEach(t => {
        const d = new Date(t.date);
        const key = month 
          ? `${d.getDate()}/${d.getMonth()+1}` 
          : `${d.getMonth()+1}/${d.getFullYear().toString().slice(-2)}`;
        
        if (!grouped.has(key)) {
          grouped.set(key, { name: key, income: 0, expense: 0 });
        }
        
        const entry = grouped.get(key);
        const amount = Number(t.amount);
        if (t.type === "income") {
          entry.income += amount;
        } else {
          entry.expense += amount;
        }
      });
      
      const chartData = Array.from(grouped.values()).map(d => ({
        ...d,
        balance: d.income - d.expense
      }));
      
      if (!month) {
        chartData.reverse(); // oldest to newest
      } else {
        chartData.sort((a,b) => {
          const ad = parseInt(a.name.split("/")[0]);
          const bd = parseInt(b.name.split("/")[0]);
          return ad - bd;
        });
      }
      
      setData(chartData);
      setLoading(false);
    });
  }, [month, category]);

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex justify-center gap-4 text-xs mt-2" dir="rtl">
        {payload.map((entry: any, index: number) => {
          let icon = "";
          if (entry.value === "הוצאות") icon = "trending_down";
          else if (entry.value === "הכנסות") icon = "trending_up";
          else if (entry.value === "מאזן") icon = "balance";
          
          return (
            <li key={`item-${index}`} className="flex items-center gap-1" style={{ color: entry.color }}>
              <span className="material-symbols-outlined text-[16px]">{icon}</span>
              <span className="font-bold">{entry.value}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-outline-variant)] relative overflow-hidden">
      
      <div className="bg-[#375657] w-full px-4 py-3 flex justify-between items-center relative border-b border-[var(--color-outline-variant)]">
        <h2 className="text-lg font-black text-[#CFE8E8] m-0 leading-none">הכנסות מול הוצאות</h2>
        <div className="z-10 flex gap-2">
          <ChartFilter 
            selectedMonth={month} setSelectedMonth={setMonth}
            selectedCategory={""} setSelectedCategory={() => {}}
            hideCategory={true}
            inline={true}
          />
        </div>
      </div>

      <div className="p-4">
        {loading ? (
        <div className="h-64 flex items-center justify-center text-[var(--color-on-surface-variant)]">טוען נתונים...</div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-[var(--color-on-surface-variant)]">אין נתונים לטווח זה</div>
      ) : (
        <div className="h-64 w-full mt-4" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₪${v}`} width={60}/>
              <Tooltip cursor={{fill: '#f1f5f9'}} formatter={(v) => `₪${Number(v).toFixed(0)}`} labelStyle={{color: '#1e293b'}}/>
              <Legend content={renderLegend} />
              <Bar dataKey="expense" name="הוצאות" fill="#DB3800" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="income" name="הכנסות" fill="#CDF22A" radius={[4, 4, 0, 0]} maxBarSize={30} />
              <Bar dataKey="balance" name="מאזן" fill="#11EEF2" radius={[4, 4, 0, 0]} maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      </div>
    </div>
  );
}
