import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all transactions
  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = 1; // Using default user
      const transactions = await storage.getTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Add a new transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const userId = 1; // Using default user
      const result = insertTransactionSchema.safeParse({
        ...req.body,
        userId
      });

      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }

      const newTransaction = await storage.createTransaction(result.data);
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });

  // Get monthly summary
  app.get("/api/summary/:month/:year", async (req, res) => {
    try {
      const userId = 1; // Using default user
      const month = parseInt(req.params.month) - 1; // JS months are 0-indexed
      const year = parseInt(req.params.year);
      
      const summary = await storage.getMonthlySummary(userId, month, year);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch summary" });
    }
  });

  // Get balance
  app.get("/api/balance", async (req, res) => {
    try {
      const userId = 1; // Using default user
      const balance = await storage.getBalance(userId);
      res.json({ balance });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch balance" });
    }
  });

  // Get settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update settings
  app.post("/api/settings", async (req, res) => {
    try {
      const themeSchema = z.object({
        theme: z.enum(["dark", "light"])
      });
      
      const result = themeSchema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        return res.status(400).json({ message: validationError.message });
      }
      
      await storage.saveSettings(result.data.theme);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
