
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

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
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-violet-600" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strongest positive correlation */}
        {strongestPositive ? (
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-gray-900">Strongest Positive</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {strongestPositive.value.toFixed(3)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{strongestPositive.col1}</span> and{" "}
              <span className="font-medium">{strongestPositive.col2}</span> show strong positive correlation
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              <span className="font-semibold text-gray-900">Strongest Positive</span>
            </div>
            <p className="text-sm text-gray-600">
              No strong positive correlations found ({"> 0.8"})
            </p>
          </div>
        )}

        {/* Strongest negative correlation */}
        {strongestNegative ? (
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="font-semibold text-gray-900">Strongest Negative</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {strongestNegative.value.toFixed(3)}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">{strongestNegative.col1}</span> and{" "}
              <span className="font-medium">{strongestNegative.col2}</span> show strong negative correlation
            </p>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-gray-400" />
              <span className="font-semibold text-gray-900">Strongest Negative</span>
            </div>
            <p className="text-sm text-gray-600">
              No strong negative correlations found ({"< -0.5"})
            </p>
          </div>
        )}

        {/* Multicollinearity warning */}
        {multicollinear.length > 0 ? (
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-gray-900">Multicollinearity Alert</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              High correlation detected ({"> 0.9"}). Consider removing one feature:
            </p>
            <div className="space-y-2">
              {multicollinear.slice(0, 3).map((pair, idx) => (
                <div key={idx} className="flex items-center justify-between bg-orange-50 p-2 rounded">
                  <span className="text-sm font-medium">
                    {pair.col1} ↔ {pair.col2}
                  </span>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    {pair.value.toFixed(3)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-gray-900">Multicollinearity</span>
            </div>
            <p className="text-sm text-gray-600">
              No multicollinearity issues detected (all correlations {"< 0.9"})
            </p>
          </div>
        )}

        {/* Summary stats */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-semibold text-gray-900 mb-3">Dataset Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Features:</span>
              <span className="font-medium ml-2">{columns.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Correlations:</span>
              <span className="font-medium ml-2">{correlations.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Avg |r|:</span>
              <span className="font-medium ml-2">
                {(correlations.reduce((sum, c) => sum + Math.abs(c.value), 0) / correlations.length).toFixed(3)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Max |r|:</span>
              <span className="font-medium ml-2">
                {Math.max(...correlations.map(c => Math.abs(c.value))).toFixed(3)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryInsights;
