
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CorrelationMethod } from "@/pages/Index";

interface CorrelationHeatmapProps {
  correlationMatrix: number[][];
  columns: string[];
  method: CorrelationMethod;
}

const CorrelationHeatmap = ({ correlationMatrix, columns, method }: CorrelationHeatmapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const getColorForCorrelation = (value: number): string => {
    if (value === 1) return '#7c3aed'; // Diagonal - violet
    if (value > 0) {
      const intensity = Math.abs(value);
      const red = Math.round(255 - (255 - 124) * intensity);
      const green = Math.round(255 - (255 - 58) * intensity);
      const blue = Math.round(255 - (255 - 237) * intensity);
      return `rgb(${red}, ${green}, ${blue})`;
    } else {
      const intensity = Math.abs(value);
      const red = Math.round(255 - (255 - 59) * intensity);
      const green = Math.round(255 - (255 - 130) * intensity);
      const blue = Math.round(255 - (255 - 246) * intensity);
      return `rgb(${red}, ${green}, ${blue})`;
    }
  };

  const downloadHeatmap = () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 800;
    canvas.height = 800;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `correlation-heatmap-${method}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  if (correlationMatrix.length === 0) return null;

  const cellSize = Math.min(400 / columns.length, 40);
  const totalSize = cellSize * columns.length;
  const labelOffset = 100;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-gray-900">
          Correlation Heatmap ({method === 'pearson' ? 'Pearson' : 'Spearman'})
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadHeatmap}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export PNG
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <svg
            ref={svgRef}
            width={totalSize + labelOffset * 2}
            height={totalSize + labelOffset * 2}
            className="min-w-max"
          >
            {/* Column labels (top) */}
            {columns.map((col, i) => (
              <text
                key={`col-${i}`}
                x={labelOffset + i * cellSize + cellSize / 2}
                y={labelOffset - 10}
                textAnchor="middle"
                fontSize="12"
                fill="#374151"
                transform={`rotate(-45, ${labelOffset + i * cellSize + cellSize / 2}, ${labelOffset - 10})`}
              >
                {col.length > 10 ? col.substring(0, 10) + '...' : col}
              </text>
            ))}

            {/* Row labels (left) */}
            {columns.map((col, i) => (
              <text
                key={`row-${i}`}
                x={labelOffset - 10}
                y={labelOffset + i * cellSize + cellSize / 2 + 4}
                textAnchor="end"
                fontSize="12"
                fill="#374151"
              >
                {col.length > 10 ? col.substring(0, 10) + '...' : col}
              </text>
            ))}

            {/* Heatmap cells */}
            {correlationMatrix.map((row, i) =>
              row.map((value, j) => (
                <g key={`cell-${i}-${j}`}>
                  <rect
                    x={labelOffset + j * cellSize}
                    y={labelOffset + i * cellSize}
                    width={cellSize}
                    height={cellSize}
                    fill={getColorForCorrelation(value)}
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x={labelOffset + j * cellSize + cellSize / 2}
                    y={labelOffset + i * cellSize + cellSize / 2 + 4}
                    textAnchor="middle"
                    fontSize={cellSize > 30 ? "10" : "8"}
                    fill={Math.abs(value) > 0.5 ? "white" : "#374151"}
                    fontWeight="500"
                  >
                    {value.toFixed(2)}
                  </text>
                </g>
              ))
            )}

            {/* Color scale legend */}
            <g>
              <text x={totalSize + labelOffset + 20} y={labelOffset + 20} fontSize="12" fill="#374151" fontWeight="600">
                Scale
              </text>
              {[-1, -0.5, 0, 0.5, 1].map((val, idx) => (
                <g key={val}>
                  <rect
                    x={totalSize + labelOffset + 20}
                    y={labelOffset + 40 + idx * 20}
                    width={15}
                    height={15}
                    fill={getColorForCorrelation(val)}
                    stroke="#ddd"
                  />
                  <text
                    x={totalSize + labelOffset + 45}
                    y={labelOffset + 52 + idx * 20}
                    fontSize="10"
                    fill="#374151"
                  >
                    {val.toFixed(1)}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationHeatmap;
