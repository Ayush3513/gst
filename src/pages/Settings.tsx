import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your Email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" placeholder="Company Name" />
              </div>
              <Button>Save Changes</Button>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                "Email Notifications",
                "SMS Alerts",
                "Desktop Notifications",
                "Due Date Reminders",
              ].map((setting) => (
                <div key={setting} className="flex items-center justify-between">
                  <Label htmlFor={setting}>{setting}</Label>
                  <Switch id={setting} />
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
            <div className="space-y-4">
              {["Tally", "Zoho", "QuickBooks"].map((integration) => (
                <div
                  key={integration}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{integration}</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your {integration} account
                    </p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;