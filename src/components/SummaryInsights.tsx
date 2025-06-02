
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Target, BarChart, Sparkles } from "lucide-react";

interface SummaryInsightsProps {
  correlationMatrix: number[][];
  columns: string[];
}

interface CorrelationPair {
  col1: string;
  col2: string;
  value: number;
}

const SummaryInsights = ({ correlationMatrix, columns }: SummaryInsightsProps) => {
  if (correlationMatrix.length === 0) return null;

  // Find strongest correlations
  const correlations: CorrelationPair[] = [];
  
  for (let i = 0; i < correlationMatrix.length; i++) {
    for (let j = i + 1; j < correlationMatrix[i].length; j++) {
      correlations.push({
        col1: columns[i],
        col2: columns[j],
        value: correlationMatrix[i][j]
      });
    }
  }

  correlations.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  const strongestPositive = correlations.find(c => c.value > 0.8);
  const strongestNegative = correlations.find(c => c.value < -0.5);
  const multicollinear = correlations.filter(c => Math.abs(c.value) > 0.9 && c.value !== 1);

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-800 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-400 p-2.5 rounded-xl shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">AI Insights</span>
          </CardTitle>
          <p className="text-slate-600 text-sm leading-relaxed">
            AI-powered analysis of feature relationships and recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Strongest positive correlation */}
          {strongestPositive ? (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200/50 hover:border-emerald-300/50 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-800 text-lg">Strongest Positive</span>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold px-3 py-1 rounded-lg">
                  {strongestPositive.value.toFixed(3)}
                </Badge>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <span className="font-semibold text-emerald-800">{strongestPositive.col1}</span> and{" "}
                <span className="font-semibold text-emerald-800">{strongestPositive.col2}</span> show 
                strong positive correlation — they increase together, indicating potential feature redundancy.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-400 p-2.5 rounded-xl">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-800 text-lg">Strongest Positive</span>
              </div>
              <p className="text-slate-600">
                No strong positive correlations detected (&gt; 0.8)
              </p>
            </div>
          )}

          {/* Strongest negative correlation */}
          {strongestNegative ? (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-xl border border-red-200/50 hover:border-red-300/50 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-2.5 rounded-xl shadow-lg">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-800 text-lg">Strongest Negative</span>
                <Badge className="bg-red-100 text-red-800 border-red-200 font-bold px-3 py-1 rounded-lg">
                  {strongestNegative.value.toFixed(3)}
                </Badge>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <span className="font-semibold text-red-800">{strongestNegative.col1}</span> and{" "}
                <span className="font-semibold text-red-800">{strongestNegative.col2}</span> demonstrate 
                strong negative correlation — as one increases, the other decreases consistently.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-400 p-2.5 rounded-xl">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-800 text-lg">Strongest Negative</span>
              </div>
              <p className="text-slate-600">
                No strong negative correlations detected (&lt; -0.5)
              </p>
            </div>
          )}

          {/* Multicollinearity warning */}
          {multicollinear.length > 0 ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200/50 hover:border-amber-300/50 transition-colors duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2.5 rounded-xl shadow-lg">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-800 text-lg">AI Recommendation</span>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed font-medium">
                🤖 High correlation detected (&gt; 0.9). Consider removing redundant features to improve model performance:
              </p>
              <div className="space-y-3">
                {multicollinear.slice(0, 3).map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/80 p-4 rounded-xl border border-amber-200/50 shadow-sm">
                    <span className="font-semibold text-slate-800">
                      {pair.col1} ↔ {pair.col2}
                    </span>
                    <Badge variant="outline" className="border-orange-400 text-orange-700 bg-orange-50 font-bold px-3 py-1">
                      {pair.value.toFixed(3)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-emerald-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-2.5 rounded-xl shadow-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-slate-800 text-lg">Feature Health</span>
              </div>
              <p className="text-slate-700 font-medium">
                ✅ Excellent! No multicollinearity issues detected — all correlations &lt; 0.9
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dataset Summary Card */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-800 flex items-center gap-3">
            <div className="bg-gradient-to-r from-orange-500 to-red-400 p-2.5 rounded-xl shadow-lg">
              <BarChart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Dataset Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/80 p-5 rounded-xl border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-orange-600 mb-2">{columns.length}</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Features</div>
            </div>
            <div className="bg-white/80 p-5 rounded-xl border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-red-600 mb-2">{correlations.length}</div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Correlations</div>
            </div>
            <div className="bg-white/80 p-5 rounded-xl border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {(correlations.reduce((sum, c) => sum + Math.abs(c.value), 0) / correlations.length).toFixed(3)}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Avg |r|</div>
            </div>
            <div className="bg-white/80 p-5 rounded-xl border border-orange-200/50 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {Math.max(...correlations.map(c => Math.abs(c.value))).toFixed(3)}
              </div>
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Max |r|</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryInsights;
