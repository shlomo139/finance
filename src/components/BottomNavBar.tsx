type BottomNavBarProps = {
  onOpenUpload?: () => void;
};

export default function BottomNavBar({ onOpenUpload }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface-container)] shadow-[0_-4px_12px_rgba(0,0,0,0.08)] rounded-t-3xl">
      <div className="flex flex-row-reverse justify-around items-center w-full max-w-[768px] mx-auto px-4 pb-3 pt-4 relative">
        {/* Insights Item */}
        <button className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:scale-110 active:scale-90 transition-all duration-300 w-16">
          <span className="material-symbols-outlined text-2xl">insights</span>
        </button>
        {/* Dashboard Item */}
        <button className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:scale-110 active:scale-90 transition-all duration-300 w-16">
          <span className="material-symbols-outlined text-2xl">list_alt</span>
        </button>
        {/* Prominent Central FAB */}
        <div className="relative -top-8">
          <button 
            onClick={onOpenUpload}
            className="w-14 h-14 bg-[var(--color-primary-container)] text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 hover:scale-110 transition-all duration-300 border-4 border-[var(--color-background-warm)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-3xl">add</span>
          </button>
        </div>
        {/* History Item */}
        <button className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:scale-110 active:scale-90 transition-all duration-300 w-16">
          <span className="material-symbols-outlined text-2xl">leaderboard</span>
        </button>
        {/* Home Item */}
        <button className="flex flex-col items-center justify-center text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:scale-110 active:scale-90 transition-all duration-300 w-16">
          <span className="material-symbols-outlined text-2xl">home</span>
        </button>
      </div>
    </nav>
  );
}
