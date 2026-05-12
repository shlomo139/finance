"use client";

import React, { useState, useEffect, useMemo } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import UploadModal from "@/components/UploadModal";
import { getTransactionsAction } from "@/app/actions/data";
import ChartFilter from "@/components/ChartFilter";
import { getCategoryColor, getCategoryIcon } from "@/utils/colors";

export default function TransactionsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting state
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortField, setSortField] = useState<string>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Expandable rows state
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setLoading(true);
    getTransactionsAction(months.length > 0 ? months : undefined, categories.length > 0 ? categories : undefined).then(txs => {
      setTransactions(txs);
      setLoading(false);
    });
  }, [months, categories]);

  const toggleRow = (id: number) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "date") {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortField === "amount") {
        aVal = Number(a.amount);
        bVal = Number(b.amount);
      } else if (sortField === "businessName" || sortField === "category") {
        aVal = String(aVal || "").toLowerCase();
        bVal = String(bVal || "").toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [transactions, sortField, sortOrder]);

  return (
    <>
      <TopAppBar />
      
      <main className="max-w-[768px] mx-auto min-h-[calc(100vh-144px)] flex flex-col px-[1.25rem] pb-28 pt-6">
        <div className="flex flex-col items-center justify-center text-center mb-6">
          <h1 className="text-3xl font-black text-[#3C74A6]">היסטוריית תנועות</h1>
          <p className="text-lg font-bold text-[var(--color-on-surface-variant)] mt-1">
            מעקב אחר כלל ההוצאות וההכנסות במקום אחד
          </p>
        </div>
        
        <ChartFilter 
          selectedMonth={""} setSelectedMonth={() => {}}
          selectedCategory={""} setSelectedCategory={() => {}}
          multiMonthMode={true}
          selectedMonths={months}
          setSelectedMonths={setMonths}
          multiCategoryMode={true}
          selectedCategories={categories}
          setSelectedCategories={setCategories}
          isTableMode={true}
          onSortClick={() => setIsSortOpen(true)}
        />
        
        <div className="bg-white rounded-3xl shadow-sm border border-[var(--color-outline-variant)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-[#EBF3FD] text-[#3C74A6] uppercase border-b-2 border-black/10">
                <tr>
                  <th className="px-4 py-3 font-black">תאריך</th>
                  <th className="px-4 py-3 font-black">בית עסק</th>
                  <th className="px-4 py-3 font-black text-center">קטגוריה</th>
                  <th className="px-4 py-3 font-black text-left">סכום</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-on-surface-variant)]">
                      טוען נתונים...
                    </td>
                  </tr>
                ) : sortedTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[var(--color-on-surface-variant)]">
                      אין עסקאות להצגה
                    </td>
                  </tr>
                ) : (
                  sortedTransactions.map((t, index) => {
                    const prevT = index > 0 ? sortedTransactions[index - 1] : null;
                    const showCategoryHeader = sortField === "category" && (!prevT || prevT.category !== t.category);

                    return (
                      <React.Fragment key={t.id}>
                        {showCategoryHeader && (
                          <tr className="bg-black/5 border-b-2 border-black/10">
                            <td colSpan={4} className="px-4 py-2 text-right">
                              <div className="flex items-center gap-3">
                                <span 
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm"
                                  style={{ backgroundColor: getCategoryColor(t.category) }}
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    {getCategoryIcon(t.category)}
                                  </span>
                                </span>
                                <span className="font-black text-lg text-[var(--color-on-surface)]">
                                  {t.category || "כללי"}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )}
                        <tr 
                          onClick={() => toggleRow(t.id)}
                          className="border-b border-[var(--color-outline-variant)] last:border-0 hover:bg-black/5 cursor-pointer transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            {new Date(t.date).toLocaleDateString('he-IL')}
                          </td>
                          <td className="px-4 py-3 font-medium text-[var(--color-on-surface)]">
                            {t.businessName || "לא ידוע"}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span 
                              className="w-8 h-8 rounded-full inline-flex items-center justify-center text-white shadow-sm"
                              style={{ backgroundColor: getCategoryColor(t.category) }}
                              title={t.category || "כללי"}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {getCategoryIcon(t.category)}
                              </span>
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-left font-bold whitespace-nowrap ${t.type === 'expense' ? 'text-[var(--color-error)]' : 'text-[var(--color-success)]'}`}>
                            {t.type === 'expense' ? '-' : '+'}₪{Math.abs(Number(t.amount)).toFixed(2)}
                          </td>
                        </tr>
                        {expandedRows[t.id] && (
                          <tr className="bg-black/5 border-b border-[var(--color-outline-variant)]">
                            <td colSpan={4} className="px-4 py-4 text-xs text-[var(--color-on-surface-variant)]">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="font-bold">סכום מקורי:</span> {t.originalAmount ? t.originalAmount : "לא זמין"}
                                </div>
                                <div>
                                  <span className="font-bold">מטבע מקורי:</span> {t.currency || "₪"}
                                </div>
                                <div>
                                  <span className="font-bold">סוג עסקה:</span> {t.transactionType || "רגיל"}
                                </div>
                                <div>
                                  <span className="font-bold">סיווג:</span> {t.type === 'expense' ? 'הוצאה' : 'הכנסה'}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Sort Modal */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-black/10 flex justify-between items-center bg-[#EBF3FD] text-[#3C74A6]">
              <h3 className="font-black text-lg">מיון נתונים</h3>
              <button onClick={() => setIsSortOpen(false)} className="material-symbols-outlined hover:text-black">close</button>
            </div>
            
            <div className="p-5 space-y-4 text-right">
              <div className="space-y-1">
                <label className="text-sm font-bold text-[var(--color-on-surface-variant)] block">מיין לפי</label>
                <select 
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value)}
                  className="w-full bg-black/5 border border-black/10 rounded-2xl px-3 py-3 text-[var(--color-on-surface)] focus:outline-none focus:border-[#F2AE2E] transition-colors"
                >
                  <option value="date">תאריך</option>
                  <option value="businessName">בית עסק (א-ב)</option>
                  <option value="category">קטגוריה</option>
                  <option value="amount">סכום</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-[var(--color-on-surface-variant)] block">סדר</label>
                <select 
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as "asc"|"desc")}
                  className="w-full bg-black/5 border border-black/10 rounded-2xl px-3 py-3 text-[var(--color-on-surface)] focus:outline-none focus:border-[#F2AE2E] transition-colors"
                >
                  <option value="desc">יורד (גבוה לנמוך / חדש לישן)</option>
                  <option value="asc">עולה (נמוך לגבוה / ישן לחדש)</option>
                </select>
              </div>
            </div>
            
            <div className="p-4 border-t border-[var(--color-outline-variant)] bg-black/5">
              <button 
                onClick={() => setIsSortOpen(false)}
                className="w-full bg-[#034AA6] hover:bg-[#3C74A6] text-white rounded-2xl py-3 font-bold active:scale-95 transition-all"
              >
                החל מיון
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavBar onOpenUpload={() => setIsUploadModalOpen(true)} />
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </>
  );
}
