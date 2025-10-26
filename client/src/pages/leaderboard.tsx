import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LeaderboardEntry } from "@shared/schema";

export default function Leaderboard() {
  const { data: leaderboard = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-chart-2" />;
      case "down":
        return <TrendingDown className="h-3 w-3 text-destructive" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
          <Trophy className="h-5 w-5" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400/20 text-gray-600 dark:text-gray-400">
          <Trophy className="h-5 w-5" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400">
          <Trophy className="h-5 w-5" />
        </div>
      );
    }
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <span className="font-mono font-semibold text-sm">#{rank}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6" data-testid="page-leaderboard">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-leaderboard">لوحة المتصدرين</h1>
        <p className="text-muted-foreground mt-1" data-testid="text-leaderboard-subtitle">
          تنافس مع أفضل المستخدمين
        </p>
      </div>

      <Card data-testid="card-leaderboard">
        <CardHeader>
          <CardTitle className="flex items-center gap-2" data-testid="heading-leaderboard-title">
            <Trophy className="h-5 w-5 text-primary" />
            الترتيب العام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" data-testid="leaderboard-list">
            {isLoading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-md border animate-pulse">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                  <div className="h-6 w-20 bg-muted rounded" />
                </div>
              ))
            ) : leaderboard.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">لا يوجد مستخدمون في الترتيب حتى الآن</p>
              </div>
            ) : (
              leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 p-4 rounded-md border hover-elevate ${
                    entry.rank <= 3 ? "bg-card" : ""
                  }`}
                  data-testid={`leaderboard-entry-${entry.rank}`}
                >
                  {getRankBadge(entry.rank)}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={entry.avatarUrl || ""} />
                    <AvatarFallback>
                      {entry.displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{entry.displayName}</span>
                      <Badge variant="outline" className="text-xs gap-1">
                        {getTrendIcon(entry.trend)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">@{entry.username}</p>
                  </div>
                  <div className="text-left">
                    <div className="font-mono font-bold text-lg">
                      {entry.totalPoints.toLocaleString("ar-EG")}
                    </div>
                    <p className="text-xs text-muted-foreground">نقطة</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
