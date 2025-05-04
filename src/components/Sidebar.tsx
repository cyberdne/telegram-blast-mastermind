
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  MessageSquare,
  Clock,
  Users,
  Target,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react";
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItem> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 text-sm font-medium",
        active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      <Icon className={cn("h-4 w-4", active ? "text-foreground" : "text-muted-foreground")} />
      <span className="truncate">{label}</span>
    </Button>
  );
};

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
    { icon: Phone, label: "Accounts", id: "accounts" },
    { icon: MessageSquare, label: "Messages", id: "messages" },
    { icon: Target, label: "Target Groups", id: "targets" },
    { icon: Clock, label: "Schedules", id: "schedules" },
    { icon: BarChart, label: "Reports", id: "reports" },
    { icon: Users, label: "Subscriptions", id: "subscriptions" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold">Navigation</h2>
        )}
      </div>
      <Button
        variant="outline"
        size="icon"
        className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-background p-0 shadow-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
        <span className="sr-only">
          {collapsed ? "Expand sidebar" : "Collapse sidebar"}
        </span>
      </Button>
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={collapsed ? "" : item.label}
              active={activeSection === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </div>
      </nav>
      <div className="flex flex-col gap-3 border-t p-4">
        {!collapsed && (
          <div className="rounded-md bg-muted p-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-promotion-success animate-pulse"></div>
              <span className="text-xs">System Online</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
