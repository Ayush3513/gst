import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Phone, Mail } from "lucide-react";

const Support = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="text-muted-foreground mt-2">
            Get help with your ITC related queries
          </p>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {[
            {
              title: "Chat Support",
              description: "Chat with our support team",
              icon: MessageSquare,
              action: "Start Chat",
            },
            {
              title: "Phone Support",
              description: "Call our support line",
              icon: Phone,
              action: "Call Now",
            },
            {
              title: "Email Support",
              description: "Email our support team",
              icon: Mail,
              action: "Send Email",
            },
          ].map((support) => (
            <Card key={support.title} className="p-6">
              <support.icon className="h-6 w-6 text-primary" />
              <h3 className="text-lg font-semibold mt-4">{support.title}</h3>
              <p className="text-muted-foreground mt-2">{support.description}</p>
              <Button className="mt-4">{support.action}</Button>
            </Card>
          ))}
        </div>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
          <form className="space-y-4">
            <div>
              <Input placeholder="Your Name" />
            </div>
            <div>
              <Input type="email" placeholder="Your Email" />
            </div>
            <div>
              <Textarea placeholder="Describe your issue" />
            </div>
            <Button>Submit Request</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Support;