import * as XLSX from "xlsx";
import Papa from "papaparse";

export type ParsedTransaction = {
  date: string;
  amount: number;
  currency?: string;
  originalAmount?: number;
  transactionType?: string;
  description: string;
  category?: string;
  original_row_id: number;
};

export type BankType = "MAX" | "CAL" | "DISCOUNT" | "כללי";

// Check if a header matches potential synonyms
function isDateHeader(h: string) {
  return h.includes("תאריך");
}

function isAmountHeader(h: string) {
  const t = h.trim();
  return t === "סכום חיוב" || h.includes("סכום חיוב") || (!h.includes("מקורי") && (h.includes("סכום") || h.includes("חובה") || h.includes("זכות") || h.includes("חיוב")));
}

function isDescHeader(h: string) {
  const t = h.trim();
  if (t.includes("סוג") || t.includes("סכום") || t.includes("מטבע") || t.includes("תאריך")) return false;
  return t.includes("עסק") || t.includes("תיאור") || t.includes("פרטים") || t.includes("פעולה");
}

function isCategoryHeader(h: string) {
  return h.includes("קטגוריה");
}

function isNotesHeader(h: string) {
  return h.includes("הערות") || h.includes("פירוט");
}

function isTransactionTypeHeader(h: string) {
  return h.includes("סוג עסקה");
}

function isCurrencyHeader(h: string) {
  return h.includes("מטבע חיוב") || h.includes("מטבע עסקה");
}

function isOriginalAmountHeader(h: string) {
  return h.includes("סכום עסקה מקורי");
}

function parseAmount(amountStr: string | number): number {
  if (typeof amountStr === "number") return amountStr;
  if (!amountStr) return 0;
  const cleaned = amountStr.replace(/[^\d.-]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function formatDate(dateVal: any): string {
  if (!dateVal) return "";
  if (typeof dateVal === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const dateObj = new Date(excelEpoch.getTime() + dateVal * 86400000);
    const d = String(dateObj.getDate()).padStart(2, "0");
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
  }
  return String(dateVal).trim();
}

export async function parseBankFile(file: File): Promise<{
  bank: BankType;
  transactions: ParsedTransaction[];
  error?: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        let rows: any[] = [];

        if (file.name.toLowerCase().endsWith(".csv")) {
          const csvData = Papa.parse(data as string, { header: false, skipEmptyLines: true });
          rows = csvData.data as any[];
        } else {
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.SheetNames[0];
          rows = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { header: 1, defval: "" });
        }

        if (rows.length === 0) {
          return resolve({ bank: "כללי", transactions: [], error: "הקובץ ריק או פגום" });
        }

        let maxMatches = 0;
        let headerRowIdx = -1;
        let bestIndices = { dateIdx: -1, amountIdx: -1, descIdx: -1, categoryIdx: -1, notesIdx: -1, typeIdx: -1, currencyIdx: -1, originalAmountIdx: -1 };

        // Pass 1: Scoring algorithm to find the true header row (ignores junk rows)
        for (let i = 0; i < Math.min(rows.length, 30); i++) {
          const rowStrings = rows[i].map((c: any) => String(c || "").trim());
          
          // Strict search for date to prioritize transaction date over billing date
          let dIdx = rowStrings.findIndex((h: string) => {
             const t = h.replace(/\s+/g, ' ');
             return t === "תאריך עסקה" || t === "תאריך העסקה";
          });
          if (dIdx === -1) dIdx = rowStrings.findIndex(isDateHeader);
          const aIdx = rowStrings.findIndex(isAmountHeader);
          
          // Strict search for business name first
          let bIdx = rowStrings.findIndex((h: string) => {
             const t = h.replace(/\s+/g, ' ');
             return t === "שם בית העסק" || t === "שם העסק" || t === "בית עסק" || t === "שם כרטיס";
          });
          if (bIdx === -1) bIdx = rowStrings.findIndex(isDescHeader);

          const cIdx = rowStrings.findIndex(isCategoryHeader);
          const tIdx = rowStrings.findIndex(isTransactionTypeHeader);
          
          let matches = 0;
          if (dIdx !== -1) matches++;
          if (aIdx !== -1) matches++;
          if (bIdx !== -1) matches++;
          if (cIdx !== -1) matches++;
          if (tIdx !== -1) matches++;

          // A real header row should have at least Date, Amount, and Desc.
          if (matches > maxMatches && dIdx !== -1 && aIdx !== -1 && bIdx !== -1) {
            maxMatches = matches;
            headerRowIdx = i;
            bestIndices = {
              dateIdx: dIdx,
              amountIdx: aIdx,
              descIdx: bIdx,
              categoryIdx: cIdx,
              typeIdx: tIdx,
              notesIdx: rowStrings.findIndex(isNotesHeader),
              currencyIdx: rowStrings.findIndex(isCurrencyHeader),
              originalAmountIdx: rowStrings.findIndex(isOriginalAmountHeader)
            };
          }
        }

        if (headerRowIdx === -1) {
          return resolve({
            bank: "כללי",
            transactions: [],
            error: "אופס, לא מצאתי בקובץ עמודות של תאריך, סכום ותיאור. תוכל לוודא שזהו קובץ אשראי או תדפיס בנק תקין?",
          });
        }

        // Detect Bank Type roughly based on headers if we want, else GENERAL
        const headersStr = rows[headerRowIdx].join(" ");
        let bank: BankType = "כללי";
        if (headersStr.includes("מקס") || (headersStr.includes("שם בית עסק") && headersStr.includes("סכום חיוב"))) {
            bank = "MAX";
        } else if (headersStr.includes("כאל") || headersStr.toLowerCase().includes("cal") || (headersStr.includes("שם העסק") && headersStr.includes("סכום עסקה"))) {
            bank = "CAL";
        } else if (headersStr.includes("דיסקונט") || (headersStr.includes("תאריך ערך") && headersStr.includes("תיאור הפעולה"))) {
            bank = "DISCOUNT";
        }

        const { dateIdx, amountIdx, descIdx, categoryIdx, notesIdx, typeIdx, currencyIdx, originalAmountIdx } = bestIndices;
        const transactions: ParsedTransaction[] = [];

        for (let i = headerRowIdx + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const dateRaw = row[dateIdx];
          const amountRaw = row[amountIdx];
          const descRaw = row[descIdx];
          const categoryRaw = categoryIdx !== -1 ? row[categoryIdx] : "";
          const notesRaw = notesIdx !== -1 ? row[notesIdx] : "";
          const typeRaw = typeIdx !== -1 ? row[typeIdx] : "";
          const currencyRaw = currencyIdx !== -1 ? row[currencyIdx] : "";
          const originalAmountRaw = originalAmountIdx !== -1 ? row[originalAmountIdx] : amountRaw;

          if (!dateRaw || !descRaw) continue;

          const amount = parseAmount(amountRaw);
          const originalAmount = parseAmount(originalAmountRaw);
          const date = formatDate(dateRaw);
          let description = String(descRaw).trim();
          const category = String(categoryRaw).trim();
          const notes = String(notesRaw).trim();

          if (notes && notes.length > 0) {
             description = `${description} - ${notes}`;
          }

          // Collect valid entries. We allow 0 amount just in case, but usually we care about actual values.
          if (description && date) {
            transactions.push({
              date,
              amount,
              currency: String(currencyRaw).trim(),
              originalAmount,
              transactionType: String(typeRaw).trim(),
              description,
              category,
              original_row_id: i + 1,
            });
          }
        }

        if (transactions.length === 0) {
           return resolve({ bank, transactions: [], error: "הקובץ זוהה, אך לא נמצאו שורות עם נתונים תקינים לחילוץ." });
        }

        resolve({ bank, transactions });
      } catch (err: any) {
        resolve({ bank: "כללי", transactions: [], error: "שגיאה בפענוח הקובץ: " + err.message });
      }
    };

    reader.onerror = () => {
      resolve({ bank: "כללי", transactions: [], error: "שגיאה בקריאת הקובץ" });
    };

    if (file.name.toLowerCase().endsWith(".csv")) {
      reader.readAsText(file, "utf-8");
    } else {
      reader.readAsArrayBuffer(file);
    }
  });
}
