'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, History, Settings, LogOut, Droplets } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };


  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-primary bg-primary/10">
                <Droplets />
            </Button>
            <h1 className="font-bold text-lg text-foreground">
                Water Quality
            </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarGroup>
          {settings?.profile ? (
            <div className="flex items-center gap-3">
              <Avatar>
                 <AvatarImage src={settings.profile.avatarUrl ?? `https://picsum.photos/seed/${settings.profile.name}/40/40`} />
                 <AvatarFallback>{getInitials(settings.profile.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                  <p className="font-semibold text-sm truncate">{settings.profile.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{settings.profile.email}</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                  <Link href="/login">
                      <LogOut className="w-4 h-4" />
                  </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarFallback>??</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="text-sm font-semibold">Not Logged In</p>
                </div>
            </div>
          )}
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
