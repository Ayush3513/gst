import { Card } from "@/components/ui/card";

const invoices = [
  {
    id: 1,
    supplier: "ABC Corp",
    amount: "₹25,000",
    status: "Verified",
    date: "2024-02-15",
  },
  {
    id: 2,
    supplier: "XYZ Ltd",
    amount: "₹18,500",
    status: "Pending",
    date: "2024-02-14",
  },
  {
    id: 3,
    supplier: "PQR Industries",
    amount: "₹32,000",
    status: "Processing",
    date: "2024-02-13",
  },
];

export const RecentInvoices = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
      <div className="space-y-4">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p className="font-medium">{invoice.supplier}</p>
              <p className="text-sm text-gray-500">{invoice.date}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">{invoice.amount}</p>
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