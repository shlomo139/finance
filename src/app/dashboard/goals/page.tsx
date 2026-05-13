"use client";

import BottomNavBar from "@/components/BottomNavBar";
import TopAppBar from "@/components/TopAppBar";

export default function GoalsPage() {
  return (
    <>
      <TopAppBar />
      <main className="max-w-[768px] mx-auto min-h-[calc(100vh-144px)] flex flex-col items-center justify-center px-[1.25rem] pb-28 pt-6">
        <div className="flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[120px] text-[#11EEF2] mb-6">paid</span>
          <h1 className="text-3xl font-black text-[#375657]">ניהול חסכונות ויעדים</h1>
          <p className="text-lg font-bold text-[var(--color-on-surface-variant)] mt-2">
            האזור הזה עדיין בבנייה. בקרוב תוכלו להגדיר יעדים ולעקוב אחרי החסכונות שלכם כאן!
          </p>
        </div>
      </main>
      <BottomNavBar />
    </>
  );
}
