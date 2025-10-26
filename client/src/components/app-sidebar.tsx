import { LayoutDashboard, Trophy, MessageSquare, User, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    title: "Dashboard",
    titleAr: "لوحة التحكم",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Activity",
    titleAr: "النشاط",
    url: "/activity",
    icon: TrendingUp,
  },
  {
    title: "Leaderboard",
    titleAr: "الترتيب",
    url: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "Profile",
    titleAr: "الملف الشخصي",
    url: "/profile",
    icon: User,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3" data-testid="sidebar-header">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">Activity Tracker</span>
            <span className="text-xs text-muted-foreground">تتبع النشاط</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>القائمة الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={location === item.url ? "bg-sidebar-accent" : ""}
                    data-testid={`link-${item.title.toLowerCase()}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.titleAr}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 rounded-md border p-3" data-testid="sidebar-user-info">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" />
            <AvatarFallback>مس</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col">
            <span className="text-sm font-medium" data-testid="text-sidebar-username">مستخدم تجريبي</span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs" data-testid="badge-sidebar-points">
                <span className="font-mono">0</span> نقطة
              </Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
