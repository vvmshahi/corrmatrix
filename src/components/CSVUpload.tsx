import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Sparkles, FileText } from "lucide-react";
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
      <Card className="w-full max-w-lg mx-auto bg-white rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent className="p-8">
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? "border-orange-400 bg-gradient-to-br from-orange-50 to-red-50 scale-105"
                : "border-slate-300 hover:border-orange-300 hover:bg-orange-50/50"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex justify-center mb-6">
              {isProcessing ? (
                <div className="bg-gradient-to-r from-orange-500 to-red-400 p-4 rounded-2xl animate-pulse">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-orange-500 to-red-400 p-4 rounded-2xl shadow-lg">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {isProcessing ? "Processing Your Data..." : "Upload Your Dataset"}
            </h3>
            
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">
              Drop your CSV file here or click to browse. Our AI will automatically detect numeric features and prepare your correlation analysis.
            </p>
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold px-8 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              <FileText className="h-5 w-5 mr-2" />
              {isProcessing ? "Processing..." : "Choose File"}
            </Button>
            
            <p className="text-sm text-slate-500 mt-4 font-medium">
              Supports CSV files • Drag & drop enabled • AI-powered detection
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
