import * as React from "react";
import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

/**
 * Interface for the individual navigation item (like Installation, Routing, etc.)
 */
export interface NavItem {
  title: string;
  url: string;
  isActive?: boolean; // 'isActive' is optional
}

/**
 * Interface for a main navigation section (like Getting Started, Building Your Application)
 */
export interface NavMainSection {
  title: string;
  url: string;
  items: NavItem[]; // An array of NavItem
}

/**
 * Interface for the entire 'data' object structure
 */
export interface NavData {
  navMain: NavMainSection[]; // An array of NavMainSection
}

type AppSidebarProps = React.ComponentPropsWithoutRef<typeof Sidebar> & {
  data: NavData; // Add your NavData prop here
};

export const AppSidebar = React.forwardRef<
  React.ElementRef<typeof Sidebar>, // This is the type of the underlying DOM element ref (e.g., HTMLDivElement)
  AppSidebarProps // This is the type of props your AppSidebar component accepts
>(({ data, ...props }, ref) => {
  // 'ref' is the second argument when using forwardRef
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-medium">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
});
