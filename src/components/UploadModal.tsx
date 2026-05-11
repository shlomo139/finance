"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { parseBankFile, ParsedTransaction, BankType } from "@/utils/parser";

type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    bank: BankType;
    count: number;
  } | null>(null);

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
    } else {
      console.log("Parsed Data:", result.transactions);
      setSuccessData({
        bank: result.bank,
        count: result.transactions.length
      });
      // Here we would eventually save to DB in Step 3
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface-container-lowest)] rounded-t-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[20px] font-bold text-[var(--color-on-surface)]">העלאת נתונים</h2>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-xl bg-[var(--color-error-container)] text-[var(--color-on-error-container)] flex items-start gap-3">
                <span className="material-symbols-outlined text-[var(--color-error)] mt-1">error</span>
                <p className="text-[14px] leading-relaxed">{error}</p>
              </div>
            )}

            {successData ? (
              <div className="mb-4 p-6 rounded-2xl bg-[var(--color-surface-container)] text-center space-y-4">
                <div className="w-16 h-16 bg-[var(--color-success-olive)] rounded-full flex items-center justify-center mx-auto text-white shadow-lg mb-4">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h3 className="text-[18px] font-bold text-[var(--color-on-surface)]">
                  קובץ {successData.bank} נותח בהצלחה!
                </h3>
                <p className="text-[var(--color-on-surface-variant)]">
                  זוהו {successData.count} פעולות ללא פרטים מזהים.
                </p>
                <button 
                  onClick={onClose}
                  className="mt-6 w-full py-3 px-6 rounded-xl bg-[var(--color-primary)] text-white font-medium shadow-md hover:bg-[var(--color-primary-container)] active:scale-95 transition-all"
                >
                  המשך
                </button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`
                  relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200
                  ${isDragActive ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-[var(--color-outline)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-container-high)]'}
                  ${isParsing ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <input {...getInputProps()} />
                
                {isParsing ? (
                  <div className="flex flex-col items-center justify-center space-y-4 py-8">
                    <div className="w-12 h-12 border-4 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                    <p className="text-[var(--color-primary)] font-medium">מנתח את הקובץ במכשיר שלך...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-highest)] flex items-center justify-center text-[var(--color-primary)] mb-2 shadow-inner">
                      <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                    </div>
                    <p className="text-[16px] font-medium text-[var(--color-on-surface)] leading-relaxed">
                      גרור לכאן קבצי אקסל או CSV של מקס, כאל או דיסקונט. 
                    </p>
                    <p className="text-[14px] text-[var(--color-on-surface-variant)]">
                      המערכת מסננת פרטים אישיים לשמירה על פרטיותך.
                    </p>
                    <button className="mt-4 py-2.5 px-6 rounded-full bg-[var(--color-primary-container)] text-white text-[14px] font-medium shadow-sm hover:scale-105 active:scale-95 transition-all">
                      או בחרו קובץ מתוך המכשיר
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className="pb-8"></div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
