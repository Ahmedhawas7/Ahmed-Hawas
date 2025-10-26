import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ConnectionCard } from "@/components/connection-card";
import { Twitter, Wallet } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function Profile() {
  const { toast } = useToast();
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const updateConnections = useMutation({
    mutationFn: async (data: { twitterHandle?: string; svmWalletAddress?: string }) => {
      return await apiRequest("PATCH", "/api/user/connections", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث معلومات الاتصال",
      });
    },
    onError: () => {
      toast({
        title: "حدث خطأ",
        description: "فشل في تحديث المعلومات",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="page-profile">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-profile">الملف الشخصي</h1>
        <p className="text-muted-foreground mt-1" data-testid="text-profile-subtitle">
          إدارة حسابك واتصالاتك
        </p>
      </div>

      <Card data-testid="card-user-info">
        <CardHeader>
          <CardTitle data-testid="heading-user-info">معلومات المستخدم</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16" data-testid="avatar-user">
              <AvatarImage src={user?.avatarUrl || ""} />
              <AvatarFallback className="text-xl">
                {user?.displayName.slice(0, 2).toUpperCase() || "مس"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" data-testid="text-display-name">
                {user?.displayName || "مستخدم"}
              </h2>
              <p className="text-sm text-muted-foreground" data-testid="text-username">@{user?.username || "user"}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="font-mono" data-testid="badge-user-points">
                  {user?.totalPoints.toLocaleString("ar-EG") || 0} نقطة
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <ConnectionCard
          title="حساب تويتر"
          icon={<Twitter className="h-5 w-5 text-twitter" />}
          isConnected={!!user?.twitterHandle}
          connectedValue={user?.twitterHandle ? `@${user.twitterHandle}` : ""}
          placeholder="اسم المستخدم على تويتر"
          onConnect={(handle) => updateConnections.mutate({ twitterHandle: handle })}
          onDisconnect={() => updateConnections.mutate({ twitterHandle: "" })}
          isLoading={updateConnections.isPending}
        />
        <ConnectionCard
          title="محفظة SVM"
          icon={<Wallet className="h-5 w-5 text-solana" />}
          isConnected={!!user?.svmWalletAddress}
          connectedValue={user?.svmWalletAddress || ""}
          placeholder="عنوان المحفظة"
          onConnect={(address) => updateConnections.mutate({ svmWalletAddress: address })}
          onDisconnect={() => updateConnections.mutate({ svmWalletAddress: "" })}
          isLoading={updateConnections.isPending}
        />
      </div>
    </div>
  );
}
