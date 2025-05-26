
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CorrelationMethod } from "@/pages/Index";

interface MethodToggleProps {
  method: CorrelationMethod;
  onMethodChange: (method: CorrelationMethod) => void;
}

const MethodToggle = ({ method, onMethodChange }: MethodToggleProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Correlation Method</h3>
            <p className="text-sm text-gray-600">
              Choose between Pearson (linear) or Spearman (rank-based) correlation
            </p>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={method === 'pearson' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onMethodChange('pearson')}
              className={
                method === 'pearson'
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : 'hover:bg-gray-200'
              }
            >
              Pearson
            </Button>
            <Button
              variant={method === 'spearman' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onMethodChange('spearman')}
              className={
                method === 'spearman'
                  ? 'bg-violet-600 hover:bg-violet-700 text-white'
                  : 'hover:bg-gray-200'
              }
            >
              Spearman
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodToggle;
