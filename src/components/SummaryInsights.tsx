
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Target, BarChart } from "lucide-react";

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
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200/60 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-800 flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Key Insights</span>
          </CardTitle>
          <p className="text-slate-600 text-sm leading-relaxed">
            Statistical analysis of feature relationships in your dataset
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Strongest positive correlation */}
          {strongestPositive ? (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-xl border border-emerald-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-lg">Strongest Positive</span>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-semibold">
                  {strongestPositive.value.toFixed(3)}
                </Badge>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <span className="font-medium text-emerald-800">{strongestPositive.col1}</span> and{" "}
                <span className="font-medium text-emerald-800">{strongestPositive.col2}</span> demonstrate 
                strong positive correlation, indicating they move together
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-slate-400 p-2 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-lg">Strongest Positive</span>
              </div>
              <p className="text-slate-600">
                No strong positive correlations detected ({"> 0.8"})
              </p>
            </div>
          )}

          {/* Strongest negative correlation */}
          {strongestNegative ? (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-xl border border-red-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-red-500 p-2 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-lg">Strongest Negative</span>
                <Badge className="bg-red-100 text-red-800 border-red-200 font-semibold">
                  {strongestNegative.value.toFixed(3)}
                </Badge>
              </div>
              <p className="text-slate-700 leading-relaxed">
                <span className="font-medium text-red-800">{strongestNegative.col1}</span> and{" "}
                <span className="font-medium text-red-800">{strongestNegative.col2}</span> show 
                strong negative correlation, moving in opposite directions
              </p>
            </div>
          ) : (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-slate-400 p-2 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-lg">Strongest Negative</span>
              </div>
              <p className="text-slate-600">
                No strong negative correlations detected ({"< -0.5"})
              </p>
            </div>
          )}

          {/* Multicollinearity warning */}
          {multicollinear.length > 0 ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-lg">Multicollinearity Alert</span>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                High correlation detected ({"> 0.9"}). Consider removing redundant features to improve model performance:
              </p>
              <div className="space-y-3">
                {multicollinear.slice(0, 3).map((pair, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white/70 p-3 rounded-lg border border-amber-200/30">
                    <span className="font-medium text-slate-800">
                      {pair.col1} ↔ {pair.col2}
                    </span>
                    <Badge variant="outline" className="border-amber-400 text-amber-700 bg-amber-50 font-semibold">
                      {pair.value.toFixed(3)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-xl border border-emerald-200/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-slate-800 text-lg">Multicollinearity Status</span>
              </div>
              <p className="text-slate-700">
                ✓ No multicollinearity issues detected - all correlations {"< 0.9"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dataset Summary Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200/60 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-slate-800 flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
              <BarChart className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Dataset Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 p-4 rounded-lg border border-indigo-200/30">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{columns.length}</div>
              <div className="text-sm font-medium text-slate-600">Features</div>
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-indigo-200/30">
              <div className="text-2xl font-bold text-purple-600 mb-1">{correlations.length}</div>
              <div className="text-sm font-medium text-slate-600">Correlations</div>
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-indigo-200/30">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {(correlations.reduce((sum, c) => sum + Math.abs(c.value), 0) / correlations.length).toFixed(3)}
              </div>
              <div className="text-sm font-medium text-slate-600">Avg |r|</div>
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-indigo-200/30">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {Math.max(...correlations.map(c => Math.abs(c.value))).toFixed(3)}
              </div>
              <div className="text-sm font-medium text-slate-600">Max |r|</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryInsights;
