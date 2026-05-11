import * as XLSX from "xlsx";
import Papa from "papaparse";

export type ParsedTransaction = {
  date: string;
  amount: number;
  description: string;
  original_row_id: number;
};

export type BankType = "MAX" | "CAL" | "DISCOUNT" | "כללי";

// Check if a header matches potential synonyms
function isDateHeader(h: string) {
  return h.includes("תאריך");
}

function isAmountHeader(h: string) {
  return h.includes("סכום") || h.includes("חובה") || h.includes("זכות") || h.includes("חיוב");
}

function isDescHeader(h: string) {
  return h.includes("תיאור") || h.includes("עסק") || h.includes("פעולה") || h.includes("פרטים");
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

        let headerRowIdx = -1;
        let dateIdx = -1, amountIdx = -1, descIdx = -1;

        // Search for headers in the first 20 rows
        for (let i = 0; i < Math.min(rows.length, 20); i++) {
          const rowStrings = rows[i].map((c: any) => String(c || ""));
          
          dateIdx = rowStrings.findIndex(isDateHeader);
          amountIdx = rowStrings.findIndex(isAmountHeader);
          descIdx = rowStrings.findIndex(isDescHeader);

          if (dateIdx !== -1 && amountIdx !== -1 && descIdx !== -1) {
            headerRowIdx = i;
            break;
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

        const transactions: ParsedTransaction[] = [];

        for (let i = headerRowIdx + 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const dateRaw = row[dateIdx];
          const amountRaw = row[amountIdx];
          const descRaw = row[descIdx];

          if (!dateRaw || !descRaw) continue;

          const amount = parseAmount(amountRaw);
          const date = formatDate(dateRaw);
          const description = String(descRaw).trim();

          // Collect valid entries. We allow 0 amount just in case, but usually we care about actual values.
          if (description && date) {
            transactions.push({
              date,
              amount,
              description,
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
