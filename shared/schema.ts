import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  email: text("email"),
  avatarUrl: text("avatar_url"),
  twitterHandle: text("twitter_handle"),
  svmWalletAddress: text("svm_wallet_address"),
  totalPoints: integer("total_points").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Twitter activities
export const twitterActivities = pgTable("twitter_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  activityType: text("activity_type").notNull(), // tweet, retweet, like, reply
  tweetId: text("tweet_id"),
  tweetText: text("tweet_text"),
  engagement: integer("engagement").default(0), // likes + retweets + replies
  pointsEarned: integer("points_earned").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// SVM wallet transactions
export const svmTransactions = pgTable("svm_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  transactionType: text("transaction_type").notNull(), // send, receive, swap, stake
  amount: text("amount").notNull(), // stored as string to handle big numbers
  token: text("token").notNull(),
  signature: text("signature"),
  pointsEarned: integer("points_earned").notNull().default(0),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Points history
export const pointsHistory = pgTable("points_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  source: text("source").notNull(), // twitter, svm, bonus
  sourceId: varchar("source_id"), // reference to activity or transaction
  points: integer("points").notNull(),
  description: text("description").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  role: text("role").notNull(), // user or assistant
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalPoints: true,
  createdAt: true,
});

export const insertTwitterActivitySchema = createInsertSchema(twitterActivities).omit({
  id: true,
  timestamp: true,
});

export const insertSvmTransactionSchema = createInsertSchema(svmTransactions).omit({
  id: true,
  timestamp: true,
});

export const insertPointsHistorySchema = createInsertSchema(pointsHistory).omit({
  id: true,
  timestamp: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

// Update user schema for connections
export const updateUserConnectionsSchema = z.object({
  twitterHandle: z.string().optional(),
  svmWalletAddress: z.string().optional(),
});

// Chat request schema
export const chatRequestSchema = z.object({
  message: z.string().min(1),
  userId: z.string(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTwitterActivity = z.infer<typeof insertTwitterActivitySchema>;
export type TwitterActivity = typeof twitterActivities.$inferSelect;

export type InsertSvmTransaction = z.infer<typeof insertSvmTransactionSchema>;
export type SvmTransaction = typeof svmTransactions.$inferSelect;

export type InsertPointsHistory = z.infer<typeof insertPointsHistorySchema>;
export type PointsHistory = typeof pointsHistory.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type UpdateUserConnections = z.infer<typeof updateUserConnectionsSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;

// Dashboard stats type
export type DashboardStats = {
  totalPoints: number;
  twitterEngagement: number;
  walletTransactions: number;
  currentRank: number;
  pointsToday: number;
  pointsWeek: number;
};

// Leaderboard entry type
export type LeaderboardEntry = {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  totalPoints: number;
  trend: "up" | "down" | "same";
};
