import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { Card } from "@/components/ui/card";

const Upload = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Invoices</h1>
          <p className="text-muted-foreground mt-2">
            Upload your invoices from various sources for ITC processing
          </p>
        </div>
        <div className="grid gap-6">
          <UploadSection />
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Supported Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Tally", "Zoho", "QuickBooks"].map((integration) => (
                <Card key={integration} className="p-4 text-center">
                  <h3 className="font-medium">{integration}</h3>
                  <button className="text-primary text-sm mt-2">Connect</button>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Upload;