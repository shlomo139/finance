"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type BottomNavBarProps = {
  onOpenUpload?: () => void;
};

export default function BottomNavBar({ onOpenUpload }: { onOpenUpload?: () => void }) {
  const pathname = usePathname();

  const getTabClass = (path: string) => {
    const isActive = pathname === path;
    return `flex flex-col items-center justify-center w-14 transition-all duration-300 ${
      isActive 
        ? "text-[#375657] scale-110 font-bold drop-shadow-md" 
        : "text-[#375657]/70 hover:text-[#375657] hover:scale-110 active:scale-90"
    }`;
  };

  return (
    <nav className="fixed bottom-0 w-full z-40 bg-[#58F3F6] border-t border-black/10 pb-safe rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center h-20 px-6 max-w-[768px] mx-auto relative">
        
        <Link href="/dashboard" className={getTabClass("/dashboard")}>
          <span className="material-symbols-outlined text-2xl mb-1">home</span>
          <span className="text-[10px] font-medium">בית</span>
        </Link>
        
        <Link href="/dashboard/transactions" className={getTabClass("/dashboard/transactions")}>
          <span className="material-symbols-outlined text-2xl mb-1">table_chart</span>
          <span className="text-[10px] font-medium">טבלאות</span>
        </Link>

        {/* Prominent Central FAB */}
        <div className="relative -top-8">
          <button 
            onClick={onOpenUpload}
            className="w-14 h-14 bg-[#375657] text-[#CFE8E8] rounded-full shadow-lg flex items-center justify-center active:scale-90 hover:scale-110 transition-all duration-300 border-4 border-[#58F3F6] cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>

        <Link href="/dashboard/insights" className={getTabClass("/dashboard/insights")}>
          <span className="material-symbols-outlined text-2xl mb-1">lightbulb</span>
          <span className="text-[10px] font-medium">תובנות</span>
        </Link>

        <Link href="/dashboard/goals" className={getTabClass("/dashboard/goals")}>
          <span className="material-symbols-outlined text-2xl mb-1">paid</span>
          <span className="text-[10px] font-medium">חסכונות</span>
        </Link>

      </div>
    </nav>
  );
}
