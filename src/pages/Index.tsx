
import { useState } from "react";
import CSVUpload from "@/components/CSVUpload";
import CorrelationHeatmap from "@/components/CorrelationHeatmap";
import SummaryInsights from "@/components/SummaryInsights";
import MethodToggle from "@/components/MethodToggle";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, BarChart3, Database } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 font-ibm">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/70 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                CorrMatrix
              </h1>
            </div>
            <h2 className="text-xl lg:text-2xl font-medium text-slate-600 mb-4">
              Visual Correlation Studio
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
              Upload your dataset and instantly visualize feature relationships through interactive correlation heatmaps. 
              Make informed decisions about feature selection with enterprise-grade statistical insights.
            </p>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      {data.length === 0 && (
        <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 border-b border-slate-200/50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Smart Upload</h3>
                <p className="text-slate-600">Automatically detects numeric columns and handles missing data</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Advanced Analytics</h3>
                <p className="text-slate-600">Pearson & Spearman correlations with multicollinearity detection</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Interactive Visualization</h3>
                <p className="text-slate-600">Dynamic heatmaps with hover insights and export capabilities</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">
        {data.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <CSVUpload onDataUpload={handleDataUpload} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="max-w-2xl mx-auto">
              <MethodToggle method={method} onMethodChange={handleMethodChange} />
            </div>
            
            <div className="grid xl:grid-cols-4 gap-8">
              <div className="xl:col-span-3">
                <CorrelationHeatmap
                  correlationMatrix={correlationMatrix}
                  columns={numericColumns}
                  method={method}
                />
              </div>
              
              <div className="xl:col-span-1">
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
      <footer className="bg-slate-900 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">CorrMatrix</span>
            </div>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Empowering data scientists with professional-grade correlation analysis tools
            </p>
            <div className="flex justify-center items-center space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 font-medium">
                GitHub
              </a>
              <span className="text-slate-600">•</span>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 font-medium">
                LinkedIn
              </a>
              <span className="text-slate-600">•</span>
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors duration-200 font-medium">
                Documentation
              </a>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-slate-500 text-sm">
              © 2024 CorrMatrix. Built for data professionals who demand excellence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
