import { NavData } from "@/components/sidebars/sidebar-with-submenus";

const menuDefinition: NavData = {
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      items: [],
    },
    {
      title: "Instructor",
      url: "/dashboard/instructor",
      items: [
        {
          title: "AI",
          url: "/dashboard/instructor/ai",
        },
        {
          title: "Profile",
          url: "/dashboard/instructor/profile",
        },
      ],
    },
    {
      title: "Club",
      url: "/dashboard/club",
      items: [
        {
          title: "Overview",
          url: "/dashboard/club/overview",
        },
      ],
    },
    {
      title: "Admin",
      url: "/dashboard/admin",
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
    {
      title: "AI",
      url: "/dashboard/ai",
      items: [
        {
          title: "Chatbot",
          url: "/dashboard/ai/chatbot",
        },
      ],
    },
  ],
};

export const mainMenu: NavData = menuDefinition;
