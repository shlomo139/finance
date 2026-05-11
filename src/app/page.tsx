"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import UploadModal from "@/components/UploadModal";

export default function Home() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <TopAppBar />
      
      <main className="max-w-[768px] mx-auto min-h-[calc(100vh-144px)] flex flex-col items-center justify-center px-[1.25rem] pb-24 text-center">
        {/* Large Breathing Advisor Avatar */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-full blur-3xl animate-breathe"></div>
          <div className="w-48 h-48 rounded-full bg-[var(--color-surface-container)] shadow-2xl flex items-center justify-center relative z-10 animate-breathe border-4 border-white">
            <img
              alt="Financial Advisor Bot"
              className="w-32 h-32"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw9GUwQDU5NI1XTBVf_pD8aqVOmZlTDRsXN8kIdujroMEwWLAoqO7Eytvc2de2h0t7uYMalhUch2SmoZgbB7LY135U4bZHbGkQMuj2NxjJMbfcwk25QX1N1Qcd7vtD4jmgZqkSdqDSyGBHYuKFte5mV-bod2Vvg09IV9zQ5ZiWtynsPvch3u7Esm0t9rGP5yj1lFspy2ZegVsefpM6cf0akttuPH__Cja9ZOuWIVeo_eTL4TcAaUA61-9ZKvK5bSQX2iWy8jrV7q0"
            />
          </div>
        </div>

        {/* Greeting Section */}
        <div className="space-y-4 max-w-sm">
          <h2 className="text-[24px] font-bold leading-[32px] text-[var(--color-on-surface)] tracking-tight">
            היי, ברוכים הבאים!<br/> מתחילים לעשות סדר בכסף.
          </h2>
          <p className="text-[18px] leading-[26px] text-[var(--color-on-surface-variant)]">
            לחצו על הפלוס למטה כדי להוסיף את ההוצאות הראשונות שלכם.
          </p>
        </div>

        {/* Floating Indicator Arrow (Visual Cue) */}
        <div className="mt-12 flex flex-col items-center text-[var(--color-primary-container)] animate-bounce">
          <span className="material-symbols-outlined text-4xl text-[var(--color-primary)]">arrow_downward</span>
        </div>
      </main>

      <BottomNavBar onOpenUpload={() => setIsUploadModalOpen(true)} />
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </>
  );
}
