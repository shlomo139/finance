"use server";

import { db } from "@/db";
import { transactions } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc, and, gte, lte, sql, inArray, or } from "drizzle-orm";

export async function hasTransactionsAction() {
  const { userId } = await auth();
  if (!userId) return false;
  
  const countRes = await db.select({ count: sql<number>`count(*)` })
    .from(transactions)
    .where(eq(transactions.userId, userId));
    
  return Number(countRes[0].count) > 0;
}

export async function getTransactionsAction(month?: string | string[], category?: string | string[]) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const conditions = [eq(transactions.userId, userId)];

  if (category) {
    if (Array.isArray(category) && category.length > 0) {
      conditions.push(inArray(transactions.category, category));
    } else if (typeof category === 'string' && category !== "") {
      conditions.push(eq(transactions.category, category));
    }
  }

  if (month) {
    if (Array.isArray(month) && month.length > 0) {
      const monthConditions = month.map(m => {
        const [year, mo] = m.split('-');
        const startDate = new Date(Number(year), Number(mo) - 1, 1);
        const endDate = new Date(Number(year), Number(mo), 0, 23, 59, 59);
        return and(gte(transactions.date, startDate), lte(transactions.date, endDate));
      });
      // @ts-ignore
      conditions.push(or(...monthConditions));
    } else if (typeof month === 'string' && month !== "") {
      const [year, m] = month.split('-');
      const startDate = new Date(Number(year), Number(m) - 1, 1);
      const endDate = new Date(Number(year), Number(m), 0, 23, 59, 59);
      
      conditions.push(gte(transactions.date, startDate));
      conditions.push(lte(transactions.date, endDate));
    }
  }

  const data = await db.select()
    .from(transactions)
    .where(and(...conditions))
    .orderBy(desc(transactions.date));

  return data;
}

export async function getAvailableMonthsAction() {
  const { userId } = await auth();
  if (!userId) return [];
  
  const data = await db.select({
    month: sql<string>`TO_CHAR(${transactions.date}, 'YYYY-MM')`
  })
  .from(transactions)
  .where(eq(transactions.userId, userId))
  .groupBy(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`)
  .orderBy(desc(sql`TO_CHAR(${transactions.date}, 'YYYY-MM')`));
  
  return data.map(d => d.month).filter(Boolean);
}

export async function getAvailableCategoriesAction() {
  const { userId } = await auth();
  if (!userId) return [];

  const data = await db.select({
    category: transactions.category
  })
  .from(transactions)
  .where(eq(transactions.userId, userId))
  .groupBy(transactions.category);

  return data.map(d => d.category).filter(Boolean);
}
