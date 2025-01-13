import { Card } from "@/components/ui/card";

export const StatusTimeline = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">ITC Verification Status</h3>
      <div className="relative">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-success">Done</span>
          <span className="text-sm font-medium text-warning">Process</span>
          <span className="text-sm font-medium text-gray-400">Pending</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-success rounded-full"
            style={{ width: "66%" }}
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm">
            <span>GSTR1</span>
            <span>GSTR 2B</span>
            <span>Pending</span>
          </div>
        </div>
      </div>
    </Card>
  );
};