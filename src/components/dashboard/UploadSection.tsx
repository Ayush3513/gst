import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const UploadSection = () => {
  const { toast } = useToast();

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      // For now, we'll just show a success message
      // In a real application, you would process the file and extract invoice data
      toast({
        title: "File uploaded successfully",
        description: "Your invoice will be processed shortly.",
      });
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Card className="p-6">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Drag and drop your invoice files here, or{" "}
            <label className="text-primary hover:text-primary/80 cursor-pointer">
              browse
              <input
                type="file"
                className="hidden"
                accept=".pdf,.xlsx,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
              />
            </label>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports: PDF, Excel, CSV (Max 10MB)
          </p>
        </div>
      </div>
    </Card>
  );
};