"use client";

import { useState, useEffect } from "react";
import { getAvailableMonthsAction, getAvailableCategoriesAction } from "@/app/actions/data";

type Props = {
  selectedMonth: string;
  setSelectedMonth: (m: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  hideCategory?: boolean;
  hideMonth?: boolean;
  isTableMode?: boolean;
  onSortClick?: () => void;
  inline?: boolean;
  
  // Multi-select month mode
  multiMonthMode?: boolean;
  selectedMonths?: string[];
  setSelectedMonths?: (m: string[]) => void;
  
  // Multi-select category mode
  multiCategoryMode?: boolean;
  selectedCategories?: string[];
  setSelectedCategories?: (c: string[]) => void;
};

export default function ChartFilter({ 
  selectedMonth, 
  setSelectedMonth, 
  selectedCategory, 
  setSelectedCategory,
  hideCategory = false,
  hideMonth = false,
  isTableMode = false,
  onSortClick,
  inline = false,
  multiMonthMode = false,
  selectedMonths = [],
  setSelectedMonths,
  multiCategoryMode = false,
  selectedCategories = [],
  setSelectedCategories
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [months, setMonths] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // local state for popup
  const [localMonth, setLocalMonth] = useState(selectedMonth);
  const [localCategory, setLocalCategory] = useState(selectedCategory);
  const [localMonths, setLocalMonths] = useState<string[]>(selectedMonths);
  const [localCategories, setLocalCategories] = useState<string[]>(selectedCategories);

  useEffect(() => {
    getAvailableMonthsAction().then(setMonths);
    if (!hideCategory) {
      getAvailableCategoriesAction().then(setCategories);
    }
  }, [hideCategory]);

  useEffect(() => {
    if (isOpen) {
      setLocalMonth(selectedMonth);
      setLocalCategory(selectedCategory);
      setLocalMonths(selectedMonths);
      setLocalCategories(selectedCategories);
    }
  }, [isOpen, selectedMonth, selectedCategory, selectedMonths, selectedCategories]);

  const handleApply = () => {
    setSelectedMonth(localMonth);
    setSelectedCategory(localCategory);
    if (setSelectedMonths) setSelectedMonths(localMonths);
    if (setSelectedCategories) setSelectedCategories(localCategories);
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocalMonth("");
    setLocalCategory("");
    setLocalMonths([]);
    setLocalCategories([]);
    setSelectedMonth("");
    setSelectedCategory("");
    if (setSelectedMonths) setSelectedMonths([]);
    if (setSelectedCategories) setSelectedCategories([]);
    setIsOpen(false);
  };

  return (
    <>
      {isTableMode ? (
        <div className="flex gap-2 mb-4 w-full justify-end">
          <button 
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 bg-[#11EEF2] text-[#375657] hover:bg-[#11EEF2]/80 px-5 py-2.5 rounded-2xl text-sm font-bold active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            סינון
          </button>
          {onSortClick && (
            <button 
              onClick={onSortClick}
              className="flex items-center gap-1 bg-[#11EEF2] text-[#375657] hover:bg-[#11EEF2]/80 px-5 py-2.5 rounded-2xl text-sm font-bold active:scale-95 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
              מיון
            </button>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className={`${inline ? '' : 'absolute top-4 left-4 '}flex items-center justify-center w-9 h-9 bg-[#11EEF2] hover:bg-[#11EEF2]/80 text-[#375657] rounded-full active:scale-95 transition-all shadow-sm z-10 hover:scale-110`}
        >
          <span className="material-symbols-outlined text-[20px]">filter_list</span>
        </button>
      )}

      {/* Filter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" dir="rtl">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-black/10 flex justify-between items-center bg-[#375657] text-[#CFE8E8]">
              <h3 className="font-black text-lg">סינון נתונים</h3>
              <button onClick={() => setIsOpen(false)} className="material-symbols-outlined hover:text-black">close</button>
            </div>
            
            <div className="p-5 space-y-4">
              {!hideMonth && !multiMonthMode && (
                <div className="space-y-1 text-right">
                  <label className="text-sm font-bold text-[var(--color-on-surface-variant)] block">חודש</label>
                  <select 
                    value={localMonth}
                    onChange={(e) => setLocalMonth(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded-2xl px-3 py-3 text-[var(--color-on-surface)] focus:outline-none focus:border-[#11EEF2] transition-colors"
                  >
                    <option value="">כל החודשים</option>
                    {months.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              {!hideMonth && multiMonthMode && (
                <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-[var(--color-on-surface-variant)] block">חודשים להשוואה (סמן)</label>
                  <div className="flex flex-col gap-2 max-h-32 overflow-y-auto p-3 bg-black/5 rounded-2xl border border-black/10">
                    {months.length === 0 ? <span className="text-sm text-gray-500">אין חודשים</span> : months.map(m => (
                      <label key={m} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-[#11EEF2]"
                          checked={localMonths.includes(m)}
                          onChange={(e) => {
                            if (e.target.checked) setLocalMonths([...localMonths, m]);
                            else setLocalMonths(localMonths.filter(x => x !== m));
                          }}
                        />
                        <span className="text-[var(--color-on-surface)]">{m}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {!hideCategory && !multiCategoryMode && (
                <div className="space-y-1 text-right">
                  <label className="text-sm font-bold text-[var(--color-on-surface-variant)] block">קטגוריה</label>
                  <select 
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="w-full bg-black/5 border border-black/10 rounded-2xl px-3 py-3 text-[var(--color-on-surface)] focus:outline-none focus:border-[#11EEF2] transition-colors"
                  >
                    <option value="">כל הקטגוריות</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {!hideCategory && multiCategoryMode && (
                <div className="space-y-2 text-right">
                  <label className="text-sm font-bold text-[var(--color-on-surface-variant)] block">קטגוריות להצגה (סמן)</label>
                  <div className="flex flex-col gap-2 max-h-32 overflow-y-auto p-3 bg-black/5 rounded-2xl border border-black/10">
                    {categories.length === 0 ? <span className="text-sm text-gray-500">אין קטגוריות</span> : categories.map(c => (
                      <label key={c} className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-[#11EEF2]"
                          checked={localCategories.includes(c)}
                          onChange={(e) => {
                            if (e.target.checked) setLocalCategories([...localCategories, c]);
                            else setLocalCategories(localCategories.filter(x => x !== c));
                          }}
                        />
                        <span className="text-[var(--color-on-surface)]">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-[var(--color-outline-variant)] flex gap-3 bg-black/5">
              <button 
                onClick={handleApply}
                className="flex-1 bg-[#11EEF2] hover:bg-[#11EEF2]/80 text-[#375657] rounded-2xl py-3 font-bold active:scale-95 transition-all"
              >
                החל סינון
              </button>
              <button 
                onClick={handleClear}
                className="px-4 text-[var(--color-on-surface-variant)] font-bold active:scale-95 transition-all bg-white border border-[var(--color-outline-variant)] rounded-2xl hover:bg-black/5"
              >
                נקה
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
