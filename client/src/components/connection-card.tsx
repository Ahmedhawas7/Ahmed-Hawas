import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

interface ConnectionCardProps {
  title: string;
  icon: React.ReactNode;
  isConnected: boolean;
  connectedValue?: string;
  placeholder: string;
  onConnect: (value: string) => void;
  onDisconnect: () => void;
  isLoading?: boolean;
}

export function ConnectionCard({
  title,
  icon,
  isConnected,
  connectedValue,
  placeholder,
  onConnect,
  onDisconnect,
  isLoading,
}: ConnectionCardProps) {
  const [value, setValue] = useState("");

  const handleConnect = () => {
    if (value.trim()) {
      onConnect(value.trim());
      setValue("");
    }
  };

  return (
    <Card data-testid="card-connection">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2" data-testid="heading-connection">
          <div className="flex items-center gap-2">
            {icon}
            <span>{title}</span>
          </div>
          {isConnected ? (
            <Badge variant="secondary" className="gap-1" data-testid="badge-connected">
              <CheckCircle2 className="h-3 w-3 text-chart-2" />
              متصل
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1" data-testid="badge-disconnected">
              <XCircle className="h-3 w-3 text-muted-foreground" />
              غير متصل
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-3">
            <div className="rounded-md border p-3 bg-muted/50" data-testid="text-connected-value">
              <p className="text-sm font-mono break-all">{connectedValue}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={onDisconnect}
              disabled={isLoading}
              data-testid="button-disconnect"
            >
              قطع الاتصال
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConnect()}
              disabled={isLoading}
              data-testid="input-connection"
            />
            <Button
              className="w-full"
              onClick={handleConnect}
              disabled={!value.trim() || isLoading}
              data-testid="button-connect"
            >
              ربط الحساب
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
