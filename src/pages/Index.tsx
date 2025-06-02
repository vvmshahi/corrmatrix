import { useState } from "react";
import CSVUpload from "@/components/CSVUpload";
import CorrelationHeatmap from "@/components/CorrelationHeatmap";
import SummaryInsights from "@/components/SummaryInsights";
import MethodToggle from "@/components/MethodToggle";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, BarChart3, Database, Github, Linkedin, Sparkles, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-400 p-2.5 rounded-xl shadow-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                CorrMatrix
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-slate-600 hover:text-orange-500 font-medium transition-colors">Home</a>
              <a href="#" className="text-slate-600 hover:text-orange-500 font-medium transition-colors">About</a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-orange-500 font-medium transition-colors flex items-center gap-1"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-orange-500 font-medium transition-colors flex items-center gap-1"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-red-50/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-orange-500" />
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wider">AI Intelligence Suite</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-8">
              <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Data Correlation
              </span>
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-400 to-orange-600 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transform your datasets into actionable insights with AI-powered correlation analysis. 
              Discover hidden patterns, eliminate redundant features, and accelerate your machine learning pipeline.
            </p>
            
            {data.length === 0 && (
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => document.querySelector('input[type="file"]')?.click()}
              >
                <Zap className="h-5 w-5 mr-2" />
                Get Started - Upload CSV
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section - Only show when no data */}
      {data.length === 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Three simple steps to unlock your data's potential
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Upload</h3>
                <p className="text-slate-600 leading-relaxed">
                  Upload your CSV and our AI automatically detects numeric columns and handles missing data with intelligent preprocessing.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Advanced Analytics</h3>
                <p className="text-slate-600 leading-relaxed">
                  Choose between Pearson and Spearman correlation methods with automatic multicollinearity detection and feature recommendations.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="bg-gradient-to-br from-orange-500 to-red-400 p-6 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Actionable Insights</h3>
                <p className="text-slate-600 leading-relaxed">
                  Get interactive visualizations and AI-powered recommendations to optimize your feature selection and model performance.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {data.length === 0 ? (
            <div className="max-w-2xl mx-auto">
              <CSVUpload onDataUpload={handleDataUpload} />
            </div>
          ) : (
            <div className="space-y-12 animate-fade-in">
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
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-400 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">CorrMatrix</span>
            </div>
            
            <p className="text-slate-400 mb-8 text-lg">
              Part of the AI Intelligence Suite · Built with AI ❤️ by Shahin
            </p>
            
            <div className="flex justify-center items-center space-x-8 text-sm mb-8">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-orange-400 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <span className="text-slate-600">•</span>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-orange-400 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
            
            <div className="border-t border-slate-800 pt-8 text-slate-500 text-sm">
              © 2024 CorrMatrix. Empowering data scientists with next-generation correlation intelligence.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
