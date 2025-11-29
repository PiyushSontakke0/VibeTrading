"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useRouter } from 'next/navigation'
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { Check, ChevronsUpDown } from "lucide-react"

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
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants"

// Mapping of symbols to company names for better search experience
const STOCK_NAMES: Record<string, string> = {
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corp.",
  GOOGL: "Alphabet Inc.",
  AMZN: "Amazon.com Inc.",
  TSLA: "Tesla Inc.",
  META: "Meta Platforms",
  NVDA: "NVIDIA Corp.",
  NFLX: "Netflix Inc.",
  ORCL: "Oracle Corp.",
  CRM: "Salesforce Inc.",
  ADBE: "Adobe Inc.",
  INTC: "Intel Corp.",
  AMD: "Adv. Micro Devices",
  PYPL: "PayPal Holdings",
  UBER: "Uber Technologies",
  ZOOM: "Zoom Technologies",
  SPOT: "Spotify Technology",
  SQ: "Block Inc.",
  SHOP: "Shopify Inc.",
  ROKU: "Roku Inc.",
  SNOW: "Snowflake Inc.",
  PLTR: "Palantir Technologies",
  COIN: "Coinbase Global",
  RBLX: "Roblox Corp.",
  DDOG: "Datadog Inc.",
  CRWD: "CrowdStrike Holdings",
  NET: "Cloudflare Inc.",
  OKTA: "Okta Inc.",
  TWLO: "Twilio Inc.",
  ZM: "Zoom Video Comm.",
  DOCU: "DocuSign Inc.",
  PTON: "Peloton Interactive",
  PINS: "Pinterest Inc.",
  SNAP: "Snap Inc.",
  LYFT: "Lyft Inc.",
  DASH: "DoorDash Inc.",
  ABNB: "Airbnb Inc.",
  RIVN: "Rivian Automotive",
  LCID: "Lucid Group",
  NIO: "NIO Inc.",
  XPEV: "XPeng Inc.",
  LI: "Li Auto Inc.",
  BABA: "Alibaba Group",
  JD: "JD.com Inc.",
  PDD: "PDD Holdings",
  TME: "Tencent Music",
  BILI: "Bilibili Inc.",
  DIDI: "DiDi Global",
  GRAB: "Grab Holdings",
  SE: "Sea Limited",
}

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

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const stockList = useMemo(() => {
    return POPULAR_STOCK_SYMBOLS.map(symbol => ({
      value: symbol,
      label: `${STOCK_NAMES[symbol] || symbol} (${symbol})`,
      searchTerm: `${STOCK_NAMES[symbol] || ''} ${symbol}`
    }))
  }, [])

  const handleSelectStock = (symbol: string) => {
    setValue(symbol)
    setOpen(false)
    router.push(`/stocks/${symbol}`)
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

        {/* Updated Search Section using Combobox */}
        <div className="px-4 py-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between bg-card text-muted-foreground hover:text-foreground border-border truncate"
              >
                {value
                  ? stockList.find((stock) => stock.value === value)?.label
                  : "Search stocks..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Type a stock or symbol..." />
                <CommandList>
                  <CommandEmpty>No stock found.</CommandEmpty>
                  <CommandGroup heading="Popular Stocks">
                    {stockList.map((stock) => (
                      <CommandItem
                        key={stock.value}
                        value={stock.searchTerm}
                        onSelect={() => handleSelectStock(stock.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === stock.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {stock.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={resolvedUser} isAuthenticated={Boolean(authenticatedUser)} />
      </SidebarFooter>
    </Sidebar>
  )
}