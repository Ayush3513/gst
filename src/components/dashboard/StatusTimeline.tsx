import { Card } from "@/components/ui/card";

interface AnalyticsData {
  gstr1_status: string;
  gstr2b_status: string;
  total_itc_amount: number;
  verified_itc_amount: number;
}

interface StatusTimelineProps {
  analyticsData?: AnalyticsData;
}

export const StatusTimeline = ({ analyticsData }: StatusTimelineProps) => {
  if (!analyticsData) return null;

  const progress = (analyticsData.verified_itc_amount / analyticsData.total_itc_amount) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">ITC Verification Status</h3>
      <div className="relative">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${analyticsData.gstr1_status === 'Verified' ? 'text-success' : 'text-warning'}`}>
            {analyticsData.gstr1_status}
          </span>
          <span className={`text-sm font-medium ${analyticsData.gstr2b_status === 'Verified' ? 'text-success' : 'text-warning'}`}>
            {analyticsData.gstr2b_status}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-success rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm">
            <span>GSTR1</span>
            <span>GSTR 2B</span>
            <span>₹{analyticsData.verified_itc_amount.toLocaleString('en-IN')} / ₹{analyticsData.total_itc_amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};