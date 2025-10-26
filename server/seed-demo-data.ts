import { storage } from "./storage";

export async function seedDemoData() {
  const userId = "demo-user";
  
  // Create some demo Twitter activities
  const twitterActivities = [
    {
      userId,
      activityType: "tweet",
      tweetId: "1",
      tweetText: "متحمس للبدء في استخدام هذه المنصة الجديدة!",
      engagement: 15,
      pointsEarned: 10,
    },
    {
      userId,
      activityType: "like",
      tweetId: "2",
      tweetText: "معلومات رائعة عن تقنية البلوكتشين",
      engagement: 0,
      pointsEarned: 2,
    },
    {
      userId,
      activityType: "retweet",
      tweetId: "3",
      tweetText: "شارك هذا المقال المفيد مع متابعيك",
      engagement: 8,
      pointsEarned: 5,
    },
    {
      userId,
      activityType: "reply",
      tweetId: "4",
      tweetText: "شكراً على المعلومات القيمة!",
      engagement: 3,
      pointsEarned: 3,
    },
  ];

  for (const activity of twitterActivities) {
    await storage.createTwitterActivity(activity);
    await storage.updateUserPoints(userId, activity.pointsEarned);
    await storage.createPointsHistory({
      userId,
      source: "twitter",
      sourceId: null,
      points: activity.pointsEarned,
      description: `نشاط تويتر: ${activity.activityType}`,
    });
  }

  // Create some demo SVM transactions
  const svmTransactions = [
    {
      userId,
      transactionType: "receive",
      amount: "100.50",
      token: "SOL",
      signature: "5Kq9xJ8vN2mR4pL1wH3yB6zT7cA9dF8gE2sV4nM6rP3tU",
      pointsEarned: 15,
    },
    {
      userId,
      transactionType: "send",
      amount: "25.00",
      token: "SOL",
      signature: "8Mw2nB5xP9cR6lT3kH7yJ4zA1dE9fG2sV5mN8rQ4tU6p",
      pointsEarned: 10,
    },
    {
      userId,
      transactionType: "swap",
      amount: "50.00",
      token: "USDC",
      signature: "3Np7mC9xQ2dS8lU5kI1yK6zB3eF4gH9sW7nO2rR6tV8q",
      pointsEarned: 12,
    },
    {
      userId,
      transactionType: "stake",
      amount: "200.00",
      token: "SOL",
      signature: "9Qr3nD7xS5eT2mV8lJ4yL1zC6fG3hI2sX9oP5rU7tW4q",
      pointsEarned: 20,
    },
  ];

  for (const transaction of svmTransactions) {
    await storage.createSvmTransaction(transaction);
    await storage.updateUserPoints(userId, transaction.pointsEarned);
    await storage.createPointsHistory({
      userId,
      source: "svm",
      sourceId: null,
      points: transaction.pointsEarned,
      description: `معاملة محفظة: ${transaction.transactionType}`,
    });
  }

  // Create some additional demo users for leaderboard
  const demoUsers = [
    { username: "ahmed", displayName: "أحمد محمد", points: 250 },
    { username: "fatima", displayName: "فاطمة علي", points: 180 },
    { username: "omar", displayName: "عمر خالد", points: 320 },
    { username: "sara", displayName: "سارة حسن", points: 150 },
    { username: "khalid", displayName: "خالد عبدالله", points: 200 },
  ];

  for (const demoUser of demoUsers) {
    const user = await storage.createUser({
      username: demoUser.username,
      displayName: demoUser.displayName,
      email: `${demoUser.username}@example.com`,
      avatarUrl: null,
      twitterHandle: null,
      svmWalletAddress: null,
    });
    await storage.updateUserPoints(user.id, demoUser.points);
  }

  console.log("✅ Demo data seeded successfully!");
}
