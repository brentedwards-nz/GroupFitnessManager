import HomeButton from "@/components/buttons/HomeButton";
import {
  AppSidebar,
  NavData,
} from "@/components/sidebars/sidebar-with-submenus";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProfileCard } from "@/components/cards/profile-card";

export default function Page() {
  const data: NavData = {
    navMain: [
      {
        title: "Instructor",
        url: "#",
        items: [
          {
            title: "Dashboard",
            url: "#",
          },
        ],
      },
      {
        title: "Club",
        url: "#",
        items: [
          {
            title: "Dashboard",
            url: "#",
          },
        ],
      },
      {
        title: "Admin",
        url: "#",
        items: [
          {
            title: "Profile",
            url: "#",
          },
          {
            title: "Configuration",
            url: "#",
          },
        ],
      },
    ],
  };

  return (
    <SidebarProvider>
      <AppSidebar data={data} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {" "}
            {/* ml-auto here pushes this div and its content to the right */}
            <Separator orientation="vertical" className="h-4" />{" "}
            {/* No mr-2 needed here as gap-2 on parent handles it */}
            <HomeButton />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <ProfileCard />

            <div className="bg-muted/50 aspect-video rounded-xl" />
            <div className="bg-muted/50 aspect-video rounded-xl" />
          </div>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
