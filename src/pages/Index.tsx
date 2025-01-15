import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { StatusTimeline } from "@/components/dashboard/StatusTimeline";
import { RecentInvoices } from "@/components/dashboard/RecentInvoices";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-gray-500 mt-2">
            Here's what's happening with your ITC claims
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadSection />
          <StatusTimeline analyticsData={analyticsData} />
        </div>
        
        <RecentInvoices />
      </div>
    </DashboardLayout>
  );
};

export default Index;