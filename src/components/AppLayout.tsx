import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { PageTransition } from "@/components/PageTransition";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </SidebarProvider>
  );
}

export function PageHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="h-12 flex items-center border-b border-border bg-card px-4 shrink-0 gap-2">
      <SidebarTrigger />
      {children}
    </header>
  );
}
