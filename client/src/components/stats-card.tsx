import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
  testId?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, description, testId }: StatsCardProps) {
  return (
    <Card data-testid={`card-${testId || 'stat'}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <div className="text-sm font-medium text-muted-foreground" data-testid={`label-${testId || 'stat'}`}>{title}</div>
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono" data-testid={testId}>
          {value}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend.isPositive ? "text-chart-2" : "text-destructive"}`} data-testid={`trend-${testId || 'stat'}`}>
            {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(trend.value)}%</span>
            <span className="text-muted-foreground">من الأسبوع الماضي</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1" data-testid={`desc-${testId || 'stat'}`}>{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
