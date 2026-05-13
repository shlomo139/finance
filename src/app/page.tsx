"use client";

import { useState, useEffect } from "react";
import { SignInButton, Show } from "@clerk/nextjs";
import Link from "next/link";
import LottieAnimation from "@/components/LottieAnimation";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    animation: "https://lottie.host/b2d17125-853e-4437-bf03-23c7895f11b8/WkCYSExZt8.lottie",
    title: <>עושים סדר ב<span className="text-[var(--color-primary)]">תקציב</span></>,
    text: "המערכת החכמה ביותר לשליטה בהוצאות המשפחתיות. קבלו תמונה מלאה וברורה של הכסף שלכם בקלות ובמהירות."
  },
  {
    id: 2,
    animation: "https://lottie.host/0042901e-9b4b-4fb5-90f8-5cb22e211c4c/jlL4tY34tK.lottie",
    title: "איך זה עובד?",
    text: "מעלים את פירוט העסקאות באקסל, ואנחנו מוציאים לכם מזה תובנות חכמות, מסדרים את הנתונים ומציגים לכם הכל על מגש של כסף."
  }
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[var(--color-background)] text-[var(--color-on-background)] overflow-hidden relative" dir="rtl">
      {/* Top Bar - Fixed */}
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:p-6 w-full bg-transparent">
        <div className="text-2xl font-black text-[#375657] max-w-4xl mx-auto w-full flex justify-between items-center">
          <div>FinanceApp</div>
          
          <div className="flex gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="bg-[#11EEF2] hover:bg-[#11EEF2]/80 text-[#375657] text-sm font-bold py-2 px-5 rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95">
                  כניסה לחשבון
                </button>
              </SignInButton>
            </Show>

          <Show when="signed-in">
            <Link href="/dashboard" className="bg-[#11EEF2] hover:bg-[#11EEF2]/80 text-[#375657] text-sm font-bold py-2 px-5 rounded-xl shadow-sm transition-all hover:shadow-md active:scale-95">
              המשך לאפליקציה
            </Link>
          </Show>
          </div>
        </div>
      </header>

      {/* Main Content - Carousel */}
      <main className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center max-w-4xl mx-auto relative pt-16">
        
        <AnimatePresence mode="wait">
          <motion.section
            key={currentSlide}
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="flex flex-col items-center absolute w-full px-6"
          >
            <LottieAnimation src={slides[currentSlide].animation} className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] mx-auto mb-2" />
            
            <h1 className="text-[36px] md:text-[48px] font-black mb-4 text-[#375657] leading-tight">
              {slides[currentSlide].title}
            </h1>
            
            <p className="text-[18px] md:text-[22px] text-[var(--color-on-surface-variant)] max-w-2xl leading-relaxed font-medium">
              {slides[currentSlide].text}
            </p>
          </motion.section>
        </AnimatePresence>

        {/* Indicators */}
        <div className="absolute bottom-12 flex gap-3 z-40">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-[#375657]" : "w-2 bg-[#375657]/30"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </main>
    </div>
  );
}
