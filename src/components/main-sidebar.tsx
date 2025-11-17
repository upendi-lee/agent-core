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
    label: '대시보드',
    icon: Home,
  },
  {
    href: '/schedule',
    label: '일정',
    icon: Calendar,
  },
  {
    href: '/notes',
    label: '노트',
    icon: Notebook,
  },
  {
    href: '/tasks',
    label: '작업',
    icon: ListTodo,
  },
  {
    href: '/meetings',
    label: '회의',
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
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-primary">에이전트</span>
          <span className="text-sm font-semibold text-primary">코어</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{
                  children: item.label,
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Settings />
              <span>설정</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
