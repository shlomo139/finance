import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: text("type").notNull(), // 'expense' or 'income'
  transactionType: text("transaction_type"), // e.g., 'רגילה', 'תשלומים'
  category: text("category").notNull(),
  currency: text("currency"), // e.g., '₪'
  originalAmount: numeric("original_amount", { precision: 12, scale: 2 }), // סכום עסקה מקורי
  businessName: text("business_name"),
  date: timestamp("date", { mode: 'date' }).notNull().defaultNow(),
});
