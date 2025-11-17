'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  Home,
  ListTodo,
  MicVocal,
  Notebook,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { AgentCoreIcon } from '@/components/icons';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    href: '/',
    label: 'Dashboard',
    icon: Home,
  },
  {
    href: '/schedule',
    label: 'Schedule',
    icon: Calendar,
  },
  {
    href: '/notes',
    label: 'Notes',
    icon: Notebook,
  },
  {
    href: '/tasks',
    label: 'Tasks',
    icon: ListTodo,
  },
  {
    href: '/meetings',
    label: 'Meetings',
    icon: MicVocal,
  },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="group-data-[variant=sidebar]:bg-sidebar group-data-[variant=sidebar]:text-sidebar-foreground"
    >
      <SidebarHeader className="flex items-center gap-2">
        <AgentCoreIcon className="size-8 shrink-0" />
        <span className="text-lg font-semibold text-primary">Agent Core</span>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <a>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
