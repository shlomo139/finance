"use client";

import { useState } from "react";
import TopAppBar from "@/components/TopAppBar";
import BottomNavBar from "@/components/BottomNavBar";
import UploadModal from "@/components/UploadModal";

export default function SavingsPage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <>
      <TopAppBar />
      
      <main className="max-w-[768px] mx-auto min-h-[calc(100vh-144px)] flex flex-col items-center justify-center px-[1.25rem] pb-28 pt-6 text-center">
        <span className="material-symbols-outlined text-6xl text-[var(--color-primary)] mb-4">savings</span>
        <h1 className="text-3xl font-black text-[var(--color-on-surface)] mb-2">יעדים וחסכונות</h1>
        <p className="text-lg font-bold text-[var(--color-on-surface-variant)]">
          אזור זה יכיל בעתיד הגדרת מטרות ויעדי חיסכון משפחתיים.
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
