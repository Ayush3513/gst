import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const UploadSection = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);

      const { data: { data: extractedData }, error } = await supabase.functions.invoke(
        'process-invoice',
        {
          body: formData,
        }
      );

      if (error) throw error;

      toast({
        title: "Invoice processed successfully",
        description: `Extracted data for invoice ${extractedData.invoice_number}`,
      });

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['recent-invoices'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error processing invoice",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [toast, queryClient]);

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
        className={`border-2 border-dashed border-gray-300 rounded-lg p-12 text-center ${
          isUploading ? 'opacity-50' : ''
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {isUploading ? (
              "Processing invoice..."
            ) : (
              <>
                Drag and drop your invoice files here, or{" "}
                <label className="text-primary hover:text-primary/80 cursor-pointer">
                  browse
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                      }
                    }}
                    disabled={isUploading}
                  />
                </label>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Supports: PDF, JPG, PNG (Max 10MB)
          </p>
        </div>
      </div>
    </Card>
  );
};