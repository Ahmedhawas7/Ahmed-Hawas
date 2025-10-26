import {
  type User,
  type InsertUser,
  type TwitterActivity,
  type InsertTwitterActivity,
  type SvmTransaction,
  type InsertSvmTransaction,
  type PointsHistory,
  type InsertPointsHistory,
  type ChatMessage,
  type InsertChatMessage,
  type DashboardStats,
  type LeaderboardEntry,
  type UpdateUserConnections,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserConnections(userId: string, connections: UpdateUserConnections): Promise<User | undefined>;
  updateUserPoints(userId: string, points: number): Promise<User | undefined>;

  // Twitter activity methods
  getTwitterActivities(userId: string): Promise<TwitterActivity[]>;
  createTwitterActivity(activity: InsertTwitterActivity): Promise<TwitterActivity>;

  // SVM transaction methods
  getSvmTransactions(userId: string): Promise<SvmTransaction[]>;
  createSvmTransaction(transaction: InsertSvmTransaction): Promise<SvmTransaction>;

  // Points history methods
  getPointsHistory(userId: string): Promise<PointsHistory[]>;
  createPointsHistory(entry: InsertPointsHistory): Promise<PointsHistory>;

  // Chat messages methods
  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Dashboard stats
  getDashboardStats(userId: string): Promise<DashboardStats>;

  // Leaderboard
  getLeaderboard(): Promise<LeaderboardEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private twitterActivities: Map<string, TwitterActivity>;
  private svmTransactions: Map<string, SvmTransaction>;
  private pointsHistory: Map<string, PointsHistory>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.users = new Map();
    this.twitterActivities = new Map();
    this.svmTransactions = new Map();
    this.pointsHistory = new Map();
    this.chatMessages = new Map();

    // Create demo user
    const demoUser: User = {
      id: "demo-user",
      username: "demo",
      displayName: "مستخدم تجريبي",
      email: "demo@example.com",
      avatarUrl: null,
      twitterHandle: null,
      svmWalletAddress: null,
      totalPoints: 0,
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      totalPoints: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserConnections(
    userId: string,
    connections: UpdateUserConnections
  ): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      ...connections,
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserPoints(userId: string, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser = {
      ...user,
      totalPoints: user.totalPoints + points,
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getTwitterActivities(userId: string): Promise<TwitterActivity[]> {
    return Array.from(this.twitterActivities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createTwitterActivity(
    insertActivity: InsertTwitterActivity
  ): Promise<TwitterActivity> {
    const id = randomUUID();
    const activity: TwitterActivity = {
      ...insertActivity,
      id,
      timestamp: new Date(),
    };
    this.twitterActivities.set(id, activity);
    return activity;
  }

  async getSvmTransactions(userId: string): Promise<SvmTransaction[]> {
    return Array.from(this.svmTransactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createSvmTransaction(
    insertTransaction: InsertSvmTransaction
  ): Promise<SvmTransaction> {
    const id = randomUUID();
    const transaction: SvmTransaction = {
      ...insertTransaction,
      id,
      timestamp: new Date(),
    };
    this.svmTransactions.set(id, transaction);
    return transaction;
  }

  async getPointsHistory(userId: string): Promise<PointsHistory[]> {
    return Array.from(this.pointsHistory.values())
      .filter((entry) => entry.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createPointsHistory(insertEntry: InsertPointsHistory): Promise<PointsHistory> {
    const id = randomUUID();
    const entry: PointsHistory = {
      ...insertEntry,
      id,
      timestamp: new Date(),
    };
    this.pointsHistory.set(id, entry);
    return entry;
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter((msg) => msg.userId === userId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      ...insertMessage,
      id,
      timestamp: new Date(),
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const user = this.users.get(userId);
    const twitterActivities = await this.getTwitterActivities(userId);
    const svmTransactions = await this.getSvmTransactions(userId);
    const pointsHistory = await this.getPointsHistory(userId);

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const pointsToday = pointsHistory
      .filter((p) => new Date(p.timestamp) > oneDayAgo)
      .reduce((sum, p) => sum + p.points, 0);

    const pointsWeek = pointsHistory
      .filter((p) => new Date(p.timestamp) > oneWeekAgo)
      .reduce((sum, p) => sum + p.points, 0);

    const twitterEngagement = twitterActivities.reduce((sum, a) => sum + (a.engagement || 0), 0);

    // Calculate rank
    const allUsers = Array.from(this.users.values()).sort(
      (a, b) => b.totalPoints - a.totalPoints
    );
    const currentRank = allUsers.findIndex((u) => u.id === userId) + 1;

    return {
      totalPoints: user?.totalPoints || 0,
      twitterEngagement,
      walletTransactions: svmTransactions.length,
      currentRank: currentRank || 0,
      pointsToday,
      pointsWeek,
    };
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const allUsers = Array.from(this.users.values()).sort(
      (a, b) => b.totalPoints - a.totalPoints
    );

    return allUsers.map((user, index) => ({
      rank: index + 1,
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      totalPoints: user.totalPoints,
      trend: "same" as const, // In a real app, this would be calculated from historical data
    }));
  }
}

export const storage = new MemStorage();
