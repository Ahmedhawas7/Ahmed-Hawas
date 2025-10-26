import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/stats-card";
import { ActivityFeed } from "@/components/activity-feed";
import { WalletActivity } from "@/components/wallet-activity";
import { Trophy, TrendingUp, Twitter, Wallet } from "lucide-react";
import type { DashboardStats, TwitterActivity, SvmTransaction } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { data: twitterActivities = [], isLoading: twitterLoading } = useQuery<TwitterActivity[]>({
    queryKey: ["/api/twitter/activities"],
  });

  const { data: svmTransactions = [], isLoading: svmLoading } = useQuery<SvmTransaction[]>({
    queryKey: ["/api/svm/transactions"],
  });

  return (
    <div className="space-y-6" data-testid="page-dashboard">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-dashboard">
          لوحة التحكم
        </h1>
        <p className="text-muted-foreground mt-1" data-testid="text-dashboard-subtitle">
          نظرة عامة على نشاطك ونقاطك
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي النقاط"
          value={statsLoading ? "..." : stats?.totalPoints.toLocaleString("ar-EG") || "0"}
          icon={Trophy}
          testId="stat-total-points"
        />
        <StatsCard
          title="التفاعل على تويتر"
          value={statsLoading ? "..." : stats?.twitterEngagement.toLocaleString("ar-EG") || "0"}
          icon={Twitter}
          description="إعجابات وإعادات تغريد"
          testId="stat-twitter-engagement"
        />
        <StatsCard
          title="معاملات المحفظة"
          value={statsLoading ? "..." : stats?.walletTransactions.toLocaleString("ar-EG") || "0"}
          icon={Wallet}
          testId="stat-wallet-transactions"
        />
        <StatsCard
          title="ترتيبك"
          value={statsLoading ? "..." : `#${stats?.currentRank || "-"}`}
          icon={TrendingUp}
          testId="stat-current-rank"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ActivityFeed activities={twitterActivities} isLoading={twitterLoading} />
        <WalletActivity transactions={svmTransactions} isLoading={svmLoading} />
      </div>
    </div>
  );
}
