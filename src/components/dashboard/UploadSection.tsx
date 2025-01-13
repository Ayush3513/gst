import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

export const UploadSection = () => {
  return (
    <Card className="p-6">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Drag and drop your invoice files here, or{" "}
            <button className="text-primary hover:text-primary/80">browse</button>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports: PDF, Excel, CSV (Max 10MB)
          </p>
        </div>
      </div>
    </Card>
  );
};