
import { useState } from "react";
import CSVUpload from "@/components/CSVUpload";
import CorrelationHeatmap from "@/components/CorrelationHeatmap";
import SummaryInsights from "@/components/SummaryInsights";
import MethodToggle from "@/components/MethodToggle";
import { useToast } from "@/hooks/use-toast";

export interface DataPoint {
  [key: string]: number | string;
}

export type CorrelationMethod = 'pearson' | 'spearman';

const Index = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [numericColumns, setNumericColumns] = useState<string[]>([]);
  const [method, setMethod] = useState<CorrelationMethod>('pearson');
  const { toast } = useToast();

  const handleDataUpload = (csvData: DataPoint[], columns: string[]) => {
    console.log('Data uploaded:', csvData.length, 'rows,', columns.length, 'numeric columns');
    setData(csvData);
    setNumericColumns(columns);
    calculateCorrelation(csvData, columns, method);
    toast({
      title: "Data uploaded successfully!",
      description: `Found ${columns.length} numeric columns with ${csvData.length} rows.`,
    });
  };

  const calculateCorrelation = (csvData: DataPoint[], columns: string[], correlationMethod: CorrelationMethod) => {
    console.log('Calculating correlation using method:', correlationMethod);
    const matrix: number[][] = [];
    
    for (let i = 0; i < columns.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < columns.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          const values1 = csvData.map(row => Number(row[columns[i]])).filter(val => !isNaN(val));
          const values2 = csvData.map(row => Number(row[columns[j]])).filter(val => !isNaN(val));
          
          if (correlationMethod === 'pearson') {
            matrix[i][j] = calculatePearsonCorrelation(values1, values2);
          } else {
            matrix[i][j] = calculateSpearmanCorrelation(values1, values2);
          }
        }
      }
    }
    
    setCorrelationMatrix(matrix);
  };

  const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const sumX = x.slice(0, n).reduce((a, b) => a + b, 0);
    const sumY = y.slice(0, n).reduce((a, b) => a + b, 0);
    const sumXY = x.slice(0, n).reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.slice(0, n).reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.slice(0, n).reduce((sum, yi) => sum + yi * yi, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  };

  const calculateSpearmanCorrelation = (x: number[], y: number[]): number => {
    const n = Math.min(x.length, y.length);
    if (n === 0) return 0;
    
    const xRanks = getRanks(x.slice(0, n));
    const yRanks = getRanks(y.slice(0, n));
    
    return calculatePearsonCorrelation(xRanks, yRanks);
  };

  const getRanks = (values: number[]): number[] => {
    const indexed = values.map((val, idx) => ({ val, idx }));
    indexed.sort((a, b) => a.val - b.val);
    
    const ranks = new Array(values.length);
    for (let i = 0; i < indexed.length; i++) {
      ranks[indexed[i].idx] = i + 1;
    }
    
    return ranks;
  };

  const handleMethodChange = (newMethod: CorrelationMethod) => {
    setMethod(newMethod);
    if (data.length > 0 && numericColumns.length > 0) {
      calculateCorrelation(data, numericColumns, newMethod);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-ibm">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CorrMatrix – Visual Correlation Studio
          </h1>
          <p className="text-gray-600">
            Upload a dataset and instantly visualize the correlation between numeric features using an interactive heatmap.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {data.length === 0 ? (
          <CSVUpload onDataUpload={handleDataUpload} />
        ) : (
          <div className="space-y-8">
            <MethodToggle method={method} onMethodChange={handleMethodChange} />
            
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <CorrelationHeatmap
                  correlationMatrix={correlationMatrix}
                  columns={numericColumns}
                  method={method}
                />
              </div>
              
              <div className="lg:col-span-1">
                <SummaryInsights
                  correlationMatrix={correlationMatrix}
                  columns={numericColumns}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p className="mb-2">Built by Your Name · Explore More Tools</p>
            <div className="flex justify-center space-x-4">
              <a href="#" className="text-violet-600 hover:text-violet-700 transition-colors">
                GitHub
              </a>
              <span>·</span>
              <a href="#" className="text-violet-600 hover:text-violet-700 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
