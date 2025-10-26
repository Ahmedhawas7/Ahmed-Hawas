import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Twitter, Heart, Repeat2, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import type { TwitterActivity } from "@shared/schema";

interface ActivityFeedProps {
  activities: TwitterActivity[];
  isLoading?: boolean;
}

export function ActivityFeed({ activities, isLoading }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-twitter" />
            نشاط تويتر
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-3 w-3" />;
      case "retweet":
        return <Repeat2 className="h-3 w-3" />;
      case "reply":
        return <MessageCircle className="h-3 w-3" />;
      default:
        return <Twitter className="h-3 w-3" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "tweet":
        return "نشر تغريدة";
      case "like":
        return "إعجاب";
      case "retweet":
        return "إعادة تغريد";
      case "reply":
        return "رد";
      default:
        return type;
    }
  };

  return (
    <Card className="h-full flex flex-col" data-testid="card-twitter-activity">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="heading-twitter-activity">
          <Twitter className="h-5 w-5 text-twitter" />
          نشاط تويتر
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4" data-testid="twitter-activity-feed">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Twitter className="h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">لا يوجد نشاط حتى الآن</p>
                <p className="text-xs text-muted-foreground mt-1">قم بربط حساب تويتر للبدء</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 rounded-md border p-3 hover-elevate"
                  data-testid={`activity-${activity.id}`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {getActivityIcon(activity.activityType)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">
                            {getActivityLabel(activity.activityType)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            +{activity.pointsEarned} نقطة
                          </Badge>
                        </div>
                        {activity.tweetText && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {activity.tweetText}
                          </p>
                        )}
                        {activity.engagement > 0 && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {activity.engagement}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.timestamp), {
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
