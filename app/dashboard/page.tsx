'use client'
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { VotingEligibilityChart } from "./piechart"
import { BirthdayBarChart } from "./barchart"
import Last5Files from "./Last5Files"

export default function Page() {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
            <Last5Files/>
              <div className="grid auto-rows-min gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
             
                <BirthdayBarChart/>
                <VotingEligibilityChart/>
            
                
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
