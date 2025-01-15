import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const RecentInvoices = () => {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ['recent-invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-12 bg-gray-200 rounded-lg mb-3"></div>
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
      <div className="space-y-4">
        {invoices?.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{invoice.supplier_name}</p>
              <p className="text-sm text-gray-500">
                {new Date(invoice.invoice_date).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">₹{invoice.amount.toLocaleString('en-IN')}</p>
              <p
                className={`text-sm ${
                  invoice.status === "Verified"
                    ? "text-success"
                    : invoice.status === "Processing"
                    ? "text-warning"
                    : "text-gray-500"
                }`}
              >
                {invoice.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};