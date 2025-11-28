"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
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
import { authClient } from "@/lib/better-auth/client"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Stocks",
      url: "/stocks",
      icon: IconListDetails,
    },
    {
      title: "Watchlist",
      url: "/watchlist",
      icon: IconChartBar,
    },
    {
      title: "Predict",
      url: "/predict",
      icon: IconFolder,
    },
    {
      title: "Our Team",
      url: "/ourteam",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],

  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession()
  const authenticatedUser = session?.user
  const resolvedUser = {
    name: authenticatedUser?.name || data.user.name,
    email: authenticatedUser?.email || data.user.email,
    avatar: authenticatedUser?.image || data.user.avatar,
  }

  const [searchInput, setSearchInput] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const symbol = searchInput.trim().toUpperCase()
    if (symbol) {
      router.push(`/stocks/${symbol}`)
      setSearchInput('')
    }
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Vibe Trading</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>

        <NavMain items={data.navMain} />
        <div className="px-4 py-3">
          <form onSubmit={handleSearch}>
            <input
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground"
              placeholder="Search stocks (e.g., AAPL)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>
        </div>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={resolvedUser} isAuthenticated={Boolean(authenticatedUser)} />
      </SidebarFooter>
    </Sidebar>
  )
}
