import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
};