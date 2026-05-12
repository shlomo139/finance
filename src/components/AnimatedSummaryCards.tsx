"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { getTransactionsAction } from "@/app/actions/data";

function AnimatedNumber({ value, colorClass }: { value: number, colorClass: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(v) {
        setDisplayValue(v);
      }
    });
    return () => controls.stop();
  }, [value]);

  return (
    <div className={`text-2xl md:text-3xl font-black ${colorClass}`} dir="ltr">
      ₪{displayValue.toFixed(0)}
    </div>
  );
}

export default function AnimatedSummaryCards() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Current month format YYYY-MM
    const d = new Date();
    const currentMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    getTransactionsAction(currentMonth).then(txs => {
      let inc = 0;
      let exp = 0;
      txs.forEach(t => {
        if (t.type === 'expense') exp += Math.abs(Number(t.amount));
        else inc += Math.abs(Number(t.amount));
      });
      setIncome(inc);
      setExpense(exp);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-24 w-full animate-pulse bg-black/5 rounded-3xl mb-6"></div>;

  const balance = income - expense;

  return (
    <div className="flex gap-2 w-full mb-6">
      <div className="flex-1 bg-white rounded-3xl p-3 md:p-4 shadow-sm border border-[var(--color-outline-variant)] flex flex-col items-center justify-center text-center">
        <p className="text-xs md:text-sm font-black text-[#3C74A6] mb-1">הכנסות (חודש נוכחי)</p>
        <AnimatedNumber value={income} colorClass="text-[#7AAB10]" />
      </div>
      <div className="flex-1 bg-white rounded-3xl p-3 md:p-4 shadow-sm border border-[var(--color-outline-variant)] flex flex-col items-center justify-center text-center">
        <p className="text-xs md:text-sm font-black text-[#3C74A6] mb-1">הוצאות (חודש נוכחי)</p>
        <AnimatedNumber value={expense} colorClass="text-[#E63946]" />
      </div>
      <div className="flex-1 bg-white rounded-3xl p-3 md:p-4 shadow-sm border border-[var(--color-outline-variant)] flex flex-col items-center justify-center text-center">
        <p className="text-xs md:text-sm font-black text-[#3C74A6] mb-1">מאזן (חודש נוכחי)</p>
        <AnimatedNumber value={balance} colorClass="text-[#F2AE2E]" />
      </div>
    </div>
  );
}
