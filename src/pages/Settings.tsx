import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProfileSettings {
  name: string;
  email: string;
  company: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsAlerts: boolean;
  desktopNotifications: boolean;
  dueDateReminders: boolean;
}

interface IntegrationStatus {
  [key: string]: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Profile settings state
  const [profile, setProfile] = useState<ProfileSettings>({
    name: "",
    email: "",
    company: "",
  });

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: false,
    smsAlerts: false,
    desktopNotifications: false,
    dueDateReminders: false,
  });

  // Integration status
  const [integrations, setIntegrations] = useState<IntegrationStatus>({
    Tally: false,
    Zoho: false,
    QuickBooks: false,
  });

  // Profile settings mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (newProfile: ProfileSettings) => {
      // In a real app, you would update this in your database
      console.log("Updating profile:", newProfile);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return newProfile;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile settings.",
        variant: "destructive",
      });
    },
  });

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    toast({
      title: "Notification Settings Updated",
      description: `${key} has been ${notifications[key] ? "disabled" : "enabled"}.`,
    });
  };

  // Handle integration connection
  const handleIntegrationToggle = (integration: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration]: !prev[integration],
    }));
    toast({
      title: `${integration} ${integrations[integration] ? "Disconnected" : "Connected"}`,
      description: `Successfully ${integrations[integration] ? "disconnected from" : "connected to"} ${integration}.`,
    });
  };

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
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your Name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Your Email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Company Name"
                  value={profile.company}
                  onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{key.replace(/([A-Z])/g, ' $1').trim()}</Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={() => handleNotificationToggle(key as keyof NotificationSettings)}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Integration Settings</h2>
            <div className="space-y-4">
              {Object.entries(integrations).map(([integration, connected]) => (
                <div
                  key={integration}
                  className="flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium">{integration}</h3>
                    <p className="text-sm text-muted-foreground">
                      {connected ? "Connected" : "Connect your"} {integration} account
                    </p>
                  </div>
                  <Button
                    variant={connected ? "destructive" : "outline"}
                    onClick={() => handleIntegrationToggle(integration)}
                  >
                    {connected ? "Disconnect" : "Connect"}
                  </Button>
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