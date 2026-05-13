"use client";

import { useState, useEffect } from "react";
import BottomNavBar from "@/components/BottomNavBar";
import TopAppBar from "@/components/TopAppBar";
import UploadModal from "@/components/UploadModal";
import LottieAnimation from "@/components/LottieAnimation";
import { hasTransactionsAction } from "@/app/actions/data";
import IncomeVsExpenseChart from "@/components/charts/IncomeVsExpenseChart";
import CategoryDonutChart from "@/components/charts/CategoryDonutChart";
import MonthOverMonthChart from "@/components/charts/MonthOverMonthChart";

import AnimatedSummaryCards from "@/components/AnimatedSummaryCards";

export default function DashboardPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [hasData, setHasData] = useState<boolean | null>(null);

  useEffect(() => {
    hasTransactionsAction().then(setHasData);
  }, []);

  return (
    <>
      <TopAppBar />
      <main className="max-w-[768px] mx-auto min-h-[calc(100vh-144px)] flex flex-col px-[1.25rem] pb-28 pt-6">
        
        {hasData === null ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        ) : hasData === false ? (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-10">
              <LottieAnimation src="https://lottie.host/b2d17125-853e-4437-bf03-23c7895f11b8/WkCYSExZt8.lottie" className="w-64 h-64 mx-auto" />
            </div>
            <div className="space-y-4 max-w-sm">
              <h2 className="text-[24px] font-bold leading-[32px] text-[var(--color-on-surface)] tracking-tight">
                היי, ברוכים הבאים!<br/> מתחילים לעשות סדר בכסף.
              </h2>
              <p className="text-[18px] leading-[26px] text-[var(--color-on-surface-variant)]">
                לחצו על הפלוס למטה כדי להוסיף את ההוצאות הראשונות שלכם.
              </p>
            </div>
            <div className="mt-12 flex flex-col items-center text-[var(--color-primary-container)] animate-bounce">
              <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">arrow_downward</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full pb-8">
            <div className="flex flex-col items-center justify-center text-center mb-6">
              <h1 className="text-3xl font-black text-[#375657]">דשבורד ראשי</h1>
              <p className="text-lg font-bold text-[var(--color-on-surface-variant)] mt-1">
                סקירה כללית של המצב הפיננסי שלך
              </p>
            </div>
            
            <AnimatedSummaryCards />
            
            <IncomeVsExpenseChart />
            <CategoryDonutChart />
            <MonthOverMonthChart />
            
          </div>
        )}

      </main>

      <BottomNavBar onOpenUpload={() => setIsUploadModalOpen(true)} />
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </>
  );
}
