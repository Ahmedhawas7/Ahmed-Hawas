import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityFeed } from "@/components/activity-feed";
import { WalletActivity } from "@/components/wallet-activity";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import type { TwitterActivity, SvmTransaction, PointsHistory } from "@shared/schema";

export default function Activity() {
  const { data: twitterActivities = [], isLoading: twitterLoading } = useQuery<TwitterActivity[]>({
    queryKey: ["/api/twitter/activities"],
  });

  const { data: svmTransactions = [], isLoading: svmLoading } = useQuery<SvmTransaction[]>({
    queryKey: ["/api/svm/transactions"],
  });

  const { data: pointsHistory = [], isLoading: pointsLoading } = useQuery<PointsHistory[]>({
    queryKey: ["/api/points/history"],
  });

  return (
    <div className="space-y-6" data-testid="page-activity">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-activity">النشاط الكامل</h1>
        <p className="text-muted-foreground mt-1" data-testid="text-activity-subtitle">
          تصفح كل نشاطاتك ومعاملاتك
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">
            الكل
          </TabsTrigger>
          <TabsTrigger value="twitter" data-testid="tab-twitter">
            تويتر
          </TabsTrigger>
          <TabsTrigger value="wallet" data-testid="tab-wallet">
            المحفظة
          </TabsTrigger>
          <TabsTrigger value="points" data-testid="tab-points">
            النقاط
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <ActivityFeed activities={twitterActivities} isLoading={twitterLoading} />
            <WalletActivity transactions={svmTransactions} isLoading={svmLoading} />
          </div>
        </TabsContent>

        <TabsContent value="twitter">
          <ActivityFeed activities={twitterActivities} isLoading={twitterLoading} />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletActivity transactions={svmTransactions} isLoading={svmLoading} />
        </TabsContent>

        <TabsContent value="points">
          <Card>
            <CardHeader>
              <CardTitle>سجل النقاط</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3" data-testid="points-history">
                  {pointsLoading ? (
                    [...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-md border animate-pulse">
                        <div className="h-10 w-10 rounded-full bg-muted" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))
                  ) : pointsHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <p className="text-sm text-muted-foreground">لا يوجد سجل للنقاط حتى الآن</p>
                    </div>
                  ) : (
                    pointsHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center gap-3 p-3 rounded-md border hover-elevate"
                        data-testid={`points-entry-${entry.id}`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="font-mono font-bold text-sm">+{entry.points}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{entry.description}</span>
                            <Badge variant="outline" className="text-xs">
                              {entry.source === "twitter" ? "تويتر" : entry.source === "svm" ? "محفظة" : "مكافأة"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(entry.timestamp), {
                              addSuffix: true,
                              locale: ar,
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
