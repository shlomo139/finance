"use client";

import { useState } from "react";
import BottomNavBar from "@/components/BottomNavBar";
import TopAppBar from "@/components/TopAppBar";
import UploadModal from "@/components/UploadModal";

export default function InsightsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <TopAppBar />
      <main className="max-w-[768px] mx-auto min-h-[calc(100vh-144px)] flex flex-col items-center justify-center px-[1.25rem] pb-28 pt-6 text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--color-primary)] mb-4">insights</span>
        <h1 className="text-3xl font-black text-[var(--color-on-surface)] mb-2">תובנות חכמות</h1>
        <p className="text-lg font-bold text-[var(--color-on-surface-variant)]">
          אזור זה יכיל בעתיד סוכן AI ותובנות אוטומטיות על ההוצאות שלך.
        </p>
      </main>

      <BottomNavBar onOpenUpload={() => setIsUploadModalOpen(true)} />
      
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </>
  );
}
