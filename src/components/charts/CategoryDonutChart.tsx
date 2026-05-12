"use client";

import { useEffect, useState } from "react";
import { getTransactionsAction } from "@/app/actions/data";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ChartFilter from "../ChartFilter";
import { getCategoryColor, getCategoryIcon } from "@/utils/colors";

export default function CategoryDonutChart() {
  const [data, setData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAllCategoriesOpen, setIsAllCategoriesOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    getTransactionsAction(month).then(txs => {
      const expenses = txs.filter(t => t.type === "expense");
      
      const grouped = new Map();
      expenses.forEach(t => {
        const cat = t.category || "כללי";
        if (!grouped.has(cat)) grouped.set(cat, 0);
        grouped.set(cat, grouped.get(cat) + Math.abs(Number(t.amount)));
      });
      
      let chartData = Array.from(grouped.entries()).map(([name, value]) => ({ name, value }));
      chartData.sort((a,b) => b.value - a.value);
      setAllData(chartData);
      
      if (chartData.length > 5) {
        const top5 = chartData.slice(0, 5);
        const others = chartData.slice(5).reduce((sum, curr) => sum + curr.value, 0);
        setData([...top5, { name: "קטגוריות נוספות", value: others, isOther: true }]);
      } else {
        setData(chartData);
      }

      setLoading(false);
    });
  }, [month]);

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-4 mt-4" dir="rtl">
        {payload.map((entry: any, index: number) => {
          const isOther = entry.payload.isOther;
          const icon = isOther ? "more_horiz" : getCategoryIcon(entry.value);
          const color = isOther ? "#94a3b8" : getCategoryColor(entry.value);
          
          return (
            <li key={`item-${index}`} className="flex items-center gap-1 text-sm text-[var(--color-on-surface)]">
              <span 
                className="material-symbols-outlined text-[20px]" 
                style={{ color }}
              >
                {icon}
              </span>
              <span className="font-medium text-xs">{entry.value}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-outline-variant)] relative overflow-hidden">
      
      <div className="bg-[#EBF3FD] w-full px-4 py-3 flex justify-between items-center relative border-b border-[var(--color-outline-variant)]">
        <h2 className="text-lg font-black text-[#3C74A6] m-0 leading-none">הוצאות לפי קטגוריה</h2>
        <div className="flex items-center gap-2 z-10">
          <button 
            onClick={() => setIsAllCategoriesOpen(true)}
            className="bg-[#034AA6]/10 text-[#034AA6] text-xs font-bold px-3 py-1.5 rounded-full hover:bg-[#034AA6]/20 transition-colors"
          >
            לכל הקטגוריות
          </button>
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
        <div className="h-64 flex items-center justify-center text-[var(--color-on-surface-variant)]">אין הוצאות לטווח זה</div>
      ) : (
        <div className="h-72 w-full mt-6" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isOther ? "#EBF3FD" : getCategoryColor(entry.name)} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₪${Number(v).toFixed(0)}`} labelStyle={{color: '#1e293b'}}/>
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      </div>
      {/* All Categories Modal */}
      {isAllCategoriesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-[var(--color-outline-variant)] flex justify-between items-center bg-[#3C74A6] text-white shrink-0">
              <h3 className="font-bold text-lg">כל הקטגוריות</h3>
              <button onClick={() => setIsAllCategoriesOpen(false)} className="material-symbols-outlined text-white/80 hover:text-white">close</button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-3">
              {allData.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-black/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
                      style={{ backgroundColor: getCategoryColor(cat.name) }}
                    >
                      <span className="material-symbols-outlined text-[20px]">{getCategoryIcon(cat.name)}</span>
                    </div>
                    <span className="font-bold text-[var(--color-on-surface)]">{cat.name}</span>
                  </div>
                  <span className="font-black text-[#E63946]">₪{cat.value.toFixed(0)}</span>
                </div>
              ))}
              {allData.length === 0 && (
                <div className="text-center text-[var(--color-on-surface-variant)] py-4">אין נתונים</div>
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--color-outline-variant)] bg-black/5 shrink-0">
              <button 
                onClick={() => setIsAllCategoriesOpen(false)}
                className="w-full bg-[#F2AE2E] text-white rounded-xl py-3 font-bold active:scale-95 transition-all"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
