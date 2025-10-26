import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowDownLeft, ArrowUpRight, Repeat, Coins } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import type { SvmTransaction } from "@shared/schema";

interface WalletActivityProps {
  transactions: SvmTransaction[];
  isLoading?: boolean;
}

export function WalletActivity({ transactions, isLoading }: WalletActivityProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-solana/20 flex items-center justify-center">
              <Coins className="h-3 w-3 text-solana" />
            </div>
            نشاط المحفظة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "send":
        return <ArrowUpRight className="h-4 w-4 text-destructive" />;
      case "receive":
        return <ArrowDownLeft className="h-4 w-4 text-chart-2" />;
      case "swap":
        return <Repeat className="h-4 w-4 text-chart-3" />;
      case "stake":
        return <Coins className="h-4 w-4 text-chart-1" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case "send":
        return "إرسال";
      case "receive":
        return "استلام";
      case "swap":
        return "مبادلة";
      case "stake":
        return "تخزين";
      default:
        return type;
    }
  };

  return (
    <Card className="h-full flex flex-col" data-testid="card-wallet-activity">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="heading-wallet-activity">
          <div className="h-5 w-5 rounded-full bg-solana/20 flex items-center justify-center">
            <Coins className="h-3 w-3 text-solana" />
          </div>
          نشاط المحفظة
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4" data-testid="wallet-activity-feed">
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Coins className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">لا توجد معاملات حتى الآن</p>
                <p className="text-xs text-muted-foreground mt-1">قم بربط محفظة SVM للبدء</p>
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex gap-3 rounded-md border p-3 hover-elevate"
                  data-testid={`transaction-${tx.id}`}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {getTransactionIcon(tx.transactionType)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">
                            {getTransactionLabel(tx.transactionType)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            +{tx.pointsEarned} نقطة
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-mono font-semibold">
                            {tx.amount} {tx.token}
                          </span>
                        </div>
                        {tx.signature && (
                          <p className="text-xs text-muted-foreground font-mono truncate mt-1">
                            {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(tx.timestamp), {
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
  );
}
