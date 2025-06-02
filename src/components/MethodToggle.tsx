
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CorrelationMethod } from "@/pages/Index";
import { Settings, Zap } from "lucide-react";

interface MethodToggleProps {
  method: CorrelationMethod;
  onMethodChange: (method: CorrelationMethod) => void;
}

const MethodToggle = ({ method, onMethodChange }: MethodToggleProps) => {
  return (
    <Card className="bg-white rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-400 p-3 rounded-xl shadow-lg">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                Correlation Method
                <Zap className="h-4 w-4 text-orange-500" />
              </h3>
              <p className="text-slate-600 text-sm font-medium">
                Choose between linear (Pearson) or rank-based (Spearman) correlation analysis
              </p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 rounded-xl p-1.5 shadow-inner">
            <Button
              variant={method === 'pearson' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onMethodChange('pearson')}
              className={
                method === 'pearson'
                  ? 'bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold shadow-lg rounded-lg px-4 py-2'
                  : 'hover:bg-white hover:shadow-sm text-slate-600 font-medium rounded-lg px-4 py-2'
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
                  ? 'bg-gradient-to-r from-orange-500 to-red-400 hover:from-orange-600 hover:to-red-500 text-white font-semibold shadow-lg rounded-lg px-4 py-2'
                  : 'hover:bg-white hover:shadow-sm text-slate-600 font-medium rounded-lg px-4 py-2'
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
