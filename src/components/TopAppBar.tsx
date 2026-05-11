"use client";

import { UserButton } from "@clerk/nextjs";

export default function TopAppBar() {
  return (
    <header className="w-full top-0 sticky z-40 bg-[var(--color-background)]">
      <div className="flex flex-row-reverse justify-between items-center px-5 h-16 w-full max-w-[768px] mx-auto">
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-surface-container-high)] border-2 border-[var(--color-primary)]">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--color-surface-container-low)] active:scale-95 transition-all duration-200">
          <span className="material-symbols-outlined text-[var(--color-on-surface-variant)]">notifications</span>
        </button>
      </div>
    </header>
  );
}
