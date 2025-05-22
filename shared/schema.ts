import { pgTable, text, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  amount: text("amount").notNull(), // Modifié en text pour éviter les problèmes de conversion
  description: text("description").notNull(),
  type: text("type").notNull(), // "revenus", "dépenses", "investissement"
  recipient: text("recipient"),
  date: timestamp("date").defaultNow().notNull(),
  userId: integer("user_id").notNull(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
