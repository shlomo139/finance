"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export default function TopAppBar() {
  const { user } = useUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'בוקר טוב,' : hour < 18 ? 'צהריים טובים,' : 'ערב טוב,';

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#F2B950] shadow-sm flex items-center justify-between px-4 transition-all duration-300">
      
      {/* Right Side: Welcome Message & Avatar */}
      <div className="flex items-center gap-3">
        {user ? (
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-[#3C74A6] shadow-sm hover:scale-105 transition-transform"
              }
            }}
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#3C74A6]">person</span>
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-xs text-[#034AA6]/80 font-medium">{greeting}</span>
          <span className="text-sm font-black text-[#034AA6]">
            {user ? user.firstName || 'משתמש' : 'אורח'}
          </span>
        </div>
      </div>

      {/* Left Side: Actions */}
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full hover:bg-black/5 flex items-center justify-center transition-colors text-[#3C74A6] relative">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#E63946] rounded-full border border-[#F2B950]"></span>
        </button>
      </div>

    </header>
  );
}
