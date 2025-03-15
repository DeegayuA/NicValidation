"use client"

import * as React from "react"
import { useSession } from "next-auth/react"  // Import useSession
import {
  BookOpen,
  User,
  Command,
  Frame,
  HandCoins,
  Map,
  PieChart,
  Send,
  Settings2,
  House,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Webpage",
      url: "/",
      icon: House,
      isActive: true,
      items: [
        {
          title: "Homepage",
          url: "/web",
        },
        {
          title: "About",
          url: "/web/about",
        },
        {
          title: "Contact",
          url: "/web/contact",
        },
      ],
    },
    {
      title: "User",
      url: "#",
      icon: User,
      items: [
        {
          title: "Login",
          url: "/login",
        },
        {
          title: "Signup",
          url: "/signup",
        },
        {
          title: "Forgot Password",
          url: "/forgot",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Settings Panel (not working)",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Donate",
      url: "/web/donate",
      icon: HandCoins,
    },
    {
      title: "Feedback",
      url: "/web/feedback",
      icon: Send,
    },
  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession(); // Get session data

  if (status === "loading") {
    return <p>Loading...</p>; // Show loading state while session is being fetched
  }

  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin Dashboard </span>
                  <span className="truncate text-xs">See everything</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* Pass session data to NavUser */}
        {session ? (
          <NavUser
            user={{
              name: session.user?.name ?? "Guest", // Fallback in case name is missing
              email: session.user?.email ?? "No email", // Fallback in case email is missing
              avatar: session.user?.image ?? "/avatars/default-avatar.png", // Fallback image URL
            }}
          />
        ) : (
          <p>Please log in</p>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}