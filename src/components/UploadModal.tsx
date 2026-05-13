"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { parseBankFile, ParsedTransaction, BankType } from "@/utils/parser";
import { saveTransactionsAction } from "@/app/actions/transactions";
import LottieAnimation from "@/components/LottieAnimation";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    bank: BankType;
    count: number;
    fileName: string;
  } | null>(null);

  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionText, setTransitionText] = useState("מעבדים את הנתונים...");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setError(null);
    setSuccessData(null);
    setIsParsing(true);
    
    const file = acceptedFiles[0];
    const result = await parseBankFile(file);
    
    setIsParsing(false);
    
    if (result.error) {
      setError(result.error);
      return;
    } 
    
    // Save to Database
    setIsSaving(true);
    try {
      await saveTransactionsAction(result.transactions, result.bank);
      
      setSuccessData({
        bank: result.bank,
        count: result.transactions.length,
        fileName: file.name
      });
    } catch (err: any) {
      console.error(err);
      setError("אירעה שגיאה בשמירת הנתונים: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    },
    maxFiles: 1
  });

  const handleDashboardClick = () => {
    setIsTransitioning(true);
    let step = 0;
    const texts = ["מעבדים את הנתונים...", "בונים את הטבלאות...", "מנתחים את המספרים..."];
    
    const interval = setInterval(() => {
      step++;
      if (step < texts.length) {
        setTransitionText(texts[step]);
      }
    }, 1200);

    setTimeout(() => {
      clearInterval(interval);
      window.location.href = '/dashboard';
    }, 3800);
  };

  // Reset state when modal is closed manually
  useEffect(() => {
    if (!isOpen) {
      setIsTransitioning(false);
      setTransitionText("מעבדים את הנתונים...");
      setSuccessData(null);
      setError(null);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isTransitioning ? undefined : onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {isTransitioning ? (
              <div className="flex flex-col items-center justify-center py-10 min-h-[300px]">
                <LottieAnimation src="https://lottie.host/0042901e-9b4b-4fb5-90f8-5cb22e211c4c/jlL4tY34tK.lottie" className="w-64 h-64 mb-4" />
                <motion.h3 
                  key={transitionText}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-xl font-black text-[#375657] transition-all"
                >
                  {transitionText}
                </motion.h3>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[20px] font-black text-[#375657]">העלאת נתונים</h2>
                  <button 
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-[#375657] hover:bg-black/10 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-600 flex items-start gap-3 border border-red-100">
                    <span className="material-symbols-outlined mt-1">error</span>
                    <p className="text-[14px] leading-relaxed font-bold">{error}</p>
                  </div>
                )}

                {successData ? (
                  <div className="mb-4 text-center flex flex-col items-center">
                    {/* Animated V */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", bounce: 0.5 }}
                      className="w-20 h-20 rounded-full bg-[#CDF22A] text-white flex items-center justify-center shadow-lg mb-6"
                    >
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="material-symbols-outlined text-5xl font-bold"
                      >
                        check
                      </motion.span>
                    </motion.div>

                    {/* File box with remove option */}
                    <div className="flex items-center justify-between w-full max-w-sm bg-black/5 p-4 rounded-xl mb-6 shadow-sm border border-black/10">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#375657]">description</span>
                        <span className="text-[14px] font-bold text-[#375657] truncate max-w-[200px]" dir="ltr">
                          {successData.fileName}
                        </span>
                      </div>
                      <button onClick={() => setSuccessData(null)} className="text-[#375657] hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>

                    <h3 className="text-[20px] font-black text-[#375657] mb-2">
                      הקובץ נותח ונשמר בהצלחה!
                    </h3>
                    <p className="text-[16px] text-gray-500 font-medium mb-8">
                      נשמרו {successData.count} פעולות בחשבון שלך.
                    </p>

                    <div className="flex flex-col gap-3 w-full">
                      <button 
                        onClick={handleDashboardClick}
                        className="w-full py-3 px-4 rounded-2xl bg-[#58F3F6] text-[#375657] font-bold shadow-md hover:bg-[#58F3F6]/80 active:scale-95 transition-all text-center"
                      >
                        ללוח הבקרה
                      </button>
                      <button 
                        onClick={() => setSuccessData(null)}
                        className="w-full py-3 px-4 rounded-2xl border-2 border-[#58F3F6] text-[#375657] font-bold shadow-sm hover:bg-[#58F3F6]/10 active:scale-95 transition-all text-center"
                      >
                        להוסיף קובץ נוסף
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`
                      relative overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200
                      ${isDragActive ? 'border-[#58F3F6] bg-[#58F3F6]/5' : 'border-[#375657]/30 bg-black/5 hover:bg-black/10'}
                      ${(isParsing || isSaving) ? 'opacity-50 pointer-events-none' : ''}
                    `}
                  >
                    <input {...getInputProps()} />
                    
                    {(isParsing || isSaving) ? (
                      <div className="flex flex-col items-center justify-center space-y-4 py-8">
                        <div className="w-12 h-12 border-4 border-[#58F3F6]/30 border-t-[#58F3F6] rounded-full animate-spin"></div>
                        <p className="text-[#375657] font-bold">
                          {isParsing ? 'מנתח את הקובץ במכשיר שלך...' : 'שומר נתונים בענן...'}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#375657] mb-2 shadow-sm border border-black/5">
                          <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                        </div>
                        <p className="text-[16px] font-black text-[#375657] leading-relaxed">
                          גרור לכאן קבצי אקסל או CSV של מקס, כאל או דיסקונט. 
                        </p>
                        <p className="text-[14px] text-gray-500 font-medium">
                          המערכת מסננת פרטים אישיים לשמירה על פרטיותך.
                        </p>
                        <button className="mt-4 py-2.5 px-6 rounded-2xl bg-[#58F3F6] hover:bg-[#58F3F6]/80 text-[#375657] text-[14px] font-bold shadow-sm hover:scale-105 active:scale-95 transition-all">
                          או בחרו קובץ מתוך המכשיר
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            <div className="pb-8"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
