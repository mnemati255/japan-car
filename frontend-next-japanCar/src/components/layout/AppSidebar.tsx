'use client';

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
import { usePathname } from 'next/navigation';

// Menu items.
const items = [
  {
    title: 'Users Management',
    baseHref: 'users-management',
    children: [
      { title: 'Users', href: 'users' },
      { title: 'Roles', href: 'roles' },
    ],
  },
  {
    title: 'Cars',
    href: 'cars',
  },
];

export default function AppSidebar() {
  // Variables
  const pathname = usePathname();
  console.log(pathname);

  return (
    <Sidebar>
      <SidebarContent className="pt-12 pb-2 px-2">
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
                      {item.children.map((child, index2) => {
                        const href = `/panel/${item.baseHref}/${child.href}`;
                        return (
                          <SidebarMenuSubItem key={index2}>
                            <Link href={href}>
                              <SidebarMenuButton
                                className={`${
                                  pathname.includes(href)
                                    ? 'bg-gray-200 hover:bg-gray-200!'
                                    : ''
                                }`}
                              >
                                {child.title}
                              </SidebarMenuButton>
                            </Link>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={index}>
                <Link href={`/panel/${item.href}`}>
                  <SidebarMenuButton
                    className={`${
                      pathname.includes(item.href) ? 'bg-gray-200 hover:bg-gray-200!' : ''
                    }`}
                  >
                    {item.title}
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
