import { ChevronRight } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import Link from 'next/link';

// Menu items.
const items = [
  {
    title: 'Users Management',
    baseHref: 'users-management',
    children: [
      { title: 'User', href: 'users' },
      { title: 'Roles', href: 'roles' },
    ],
  },
  {
    title: 'Cars',
    href: '#',
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="pt-12 pb-2">
        <SidebarMenu>
          {items.map((item, index) =>
            item.children ? (
              <Collapsible key={index} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      {item.title}
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children.map((child, index2) => (
                        <SidebarMenuSubItem key={index2}>
                          <Link href={`/panel/${item.baseHref}/${child.href}`}>
                            <SidebarMenuButton>{child.title}</SidebarMenuButton>
                          </Link>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton asChild>
                  <a href={item.href}>{item.title}</a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
