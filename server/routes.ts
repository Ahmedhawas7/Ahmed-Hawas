import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertTwitterActivitySchema,
  insertSvmTransactionSchema,
  updateUserConnectionsSchema,
  chatRequestSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User endpoints
  app.get("/api/user", async (req, res) => {
    try {
      const userId = "demo-user"; // In a real app, get from session
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.patch("/api/user/connections", async (req, res) => {
    try {
      const userId = "demo-user";
      const validated = updateUserConnectionsSchema.parse(req.body);
      const user = await storage.updateUserConnections(userId, validated);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const userId = "demo-user";
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Twitter activity endpoints
  app.get("/api/twitter/activities", async (req, res) => {
    try {
      const userId = "demo-user";
      const activities = await storage.getTwitterActivities(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/twitter/activities", async (req, res) => {
    try {
      const userId = "demo-user";
      const validated = insertTwitterActivitySchema.parse({
        ...req.body,
        userId,
      });
      const activity = await storage.createTwitterActivity(validated);

      // Add points to user and history
      await storage.updateUserPoints(userId, activity.pointsEarned);
      await storage.createPointsHistory({
        userId,
        source: "twitter",
        sourceId: activity.id,
        points: activity.pointsEarned,
        description: `نشاط تويتر: ${activity.activityType}`,
      });

      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // SVM wallet endpoints
  app.get("/api/svm/transactions", async (req, res) => {
    try {
      const userId = "demo-user";
      const transactions = await storage.getSvmTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/svm/transactions", async (req, res) => {
    try {
      const userId = "demo-user";
      const validated = insertSvmTransactionSchema.parse({
        ...req.body,
        userId,
      });
      const transaction = await storage.createSvmTransaction(validated);

      // Add points to user and history
      await storage.updateUserPoints(userId, transaction.pointsEarned);
      await storage.createPointsHistory({
        userId,
        source: "svm",
        sourceId: transaction.id,
        points: transaction.pointsEarned,
        description: `معاملة محفظة: ${transaction.transactionType}`,
      });

      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid request" });
    }
  });

  // Points history
  app.get("/api/points/history", async (req, res) => {
    try {
      const userId = "demo-user";
      const history = await storage.getPointsHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch points history" });
    }
  });

  // Leaderboard
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Chat endpoint with OpenAI
  app.post("/api/chat", async (req, res) => {
    try {
      const validated = chatRequestSchema.parse(req.body);
      const { message, userId } = validated;

      // Save user message
      const userMessage = await storage.createChatMessage({
        userId,
        role: "user",
        content: message,
      });

      // Get user data for context
      const user = await storage.getUser(userId);
      const stats = await storage.getDashboardStats(userId);
      const twitterActivities = await storage.getTwitterActivities(userId);
      const svmTransactions = await storage.getSvmTransactions(userId);

      // Call OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `أنت مساعد ذكي لمنصة تتبع النشاط. تساعد المستخدمين في فهم نشاطهم ونقاطهم. معلومات المستخدم الحالية:
- الاسم: ${user?.displayName}
- إجمالي النقاط: ${stats.totalPoints}
- الترتيب: ${stats.currentRank}
- التفاعل على تويتر: ${stats.twitterEngagement}
- معاملات المحفظة: ${stats.walletTransactions}
- نقاط اليوم: ${stats.pointsToday}
- نقاط هذا الأسبوع: ${stats.pointsWeek}
- حساب تويتر متصل: ${user?.twitterHandle ? "نعم (@" + user.twitterHandle + ")" : "لا"}
- محفظة SVM متصلة: ${user?.svmWalletAddress ? "نعم" : "لا"}

أجب بطريقة ودية ومفيدة باللغة العربية. قدم نصائح حول كيفية كسب المزيد من النقاط إذا سُئلت.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error("OpenAI API request failed");
      }

      const data = await response.json();
      const assistantContent = data.choices[0].message.content;

      // Save assistant message
      const assistantMessage = await storage.createChatMessage({
        userId,
        role: "assistant",
        content: assistantContent,
      });

      res.json({ userMessage, assistantMessage });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
