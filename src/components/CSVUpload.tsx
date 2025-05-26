
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DataPoint } from "@/pages/Index";

interface CSVUploadProps {
  onDataUpload: (data: DataPoint[], numericColumns: string[]) => void;
}

const CSVUpload = ({ onDataUpload }: CSVUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    console.log('Processing file:', file.name);

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      
      if (lines.length < 2) {
        toast({
          title: "Invalid CSV",
          description: "CSV must have at least a header row and one data row.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows: DataPoint[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        if (values.length === headers.length) {
          const row: DataPoint = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          rows.push(row);
        }
      }

      // Identify numeric columns
      const numericColumns: string[] = [];
      headers.forEach(header => {
        const numericValues = rows.map(row => Number(row[header])).filter(val => !isNaN(val));
        if (numericValues.length > rows.length * 0.8) { // At least 80% numeric values
          numericColumns.push(header);
        }
      });

      if (numericColumns.length < 2) {
        toast({
          title: "Insufficient numeric columns",
          description: "CSV must have at least 2 numeric columns for correlation analysis.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      console.log('Found numeric columns:', numericColumns);
      onDataUpload(rows, numericColumns);
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast({
        title: "Error processing file",
        description: "Please check your CSV format and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-violet-500 bg-violet-50"
                : "border-gray-300 hover:border-violet-400"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload CSV File
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Upload a CSV with numeric columns to explore feature relationships.
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Choose File"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Drag and drop is supported
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVUpload;
