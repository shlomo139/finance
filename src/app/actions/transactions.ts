"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { ParsedTransaction, BankType } from "@/utils/parser";

export async function saveTransactionsAction(
  parsedTransactions: ParsedTransaction[],
  bank: BankType
) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  if (!parsedTransactions || parsedTransactions.length === 0) {
    return { success: true, count: 0 };
  }

  // Convert the parsed transactions to the DB schema format
  const dbTransactions = parsedTransactions.map((pt) => {
    // Parse "DD/MM/YYYY" to Date object if it exists
    let dateObj = new Date();
    if (pt.date) {
      const parts = pt.date.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts;
        dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      }
    }
    
    // Determine type (expense vs income) - positive in credit cards is an expense
    const type = pt.amount > 0 ? "expense" : "income";
    
    return {
      userId,
      amount: Math.abs(pt.amount).toString(), 
      type,
      transactionType: pt.transactionType || null,
      category: pt.category || "כללי",
      currency: pt.currency || null,
      originalAmount: pt.originalAmount ? Math.abs(pt.originalAmount).toString() : null,
      businessName: pt.description || "",
      date: dateObj,
    };
  });

  // Batch insert into the database
  await db.insert(transactions).values(dbTransactions);
  
  return { success: true, count: dbTransactions.length };
}
