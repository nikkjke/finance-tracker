import { useState } from 'react';
import { TrendingDown } from 'lucide-react';
import type { ChartDataPoint } from '../../types';

interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
}

export default function BarChart({ data, height = 200, color = '#22c55e' }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Handle empty data state
  if (data.length === 0 || data.every(d => d.value === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 rounded-lg border border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800/50" style={{ minHeight: height }}>
        {/* Icon container with subtle background */}
        <div className="relative mb-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800 ring-1 ring-surface-200 dark:ring-surface-700">
            <TrendingDown size={32} className="text-surface-300 dark:text-surface-600" />
          </div>
          {/* Decorative dot */}
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-surface-200 dark:bg-surface-700" />
        </div>

        {/* Text */}
        <h3 className="text-base font-semibold text-surface-700 dark:text-surface-300 mb-1.5 text-center">
          No spending data
        </h3>
        <p className="text-sm text-surface-400 dark:text-surface-500 max-w-xs text-center leading-relaxed">
          Start adding expenses to see your spending activity
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="w-full">
      {/* Bars row */}
      <div className="flex items-end justify-between gap-2" style={{ height }}>
        {data.map((point, index) => {
          const barHeight = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
          const percentage = total > 0 ? ((point.value / total) * 100).toFixed(1) : '0';
          const isHovered = hoveredIndex === index;
          return (
            <div
              key={index}
              className="relative flex-1 group"
              style={{ height: '100%' }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip - positioned just above the bar */}
              {isHovered && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  style={{ bottom: `calc(${barHeight}% + 8px)` }}
                >
                  <div className="rounded-lg bg-surface-900 dark:bg-surface-700 px-3 py-2 text-center shadow-lg whitespace-nowrap">
                    <p className="text-xs font-semibold text-white">{point.label}</p>
                    <p className="text-sm font-bold text-white">${point.value.toLocaleString()}</p>
                    <p className="text-[10px] text-surface-300">{percentage}% of total</p>
                  </div>
                  <div className="mx-auto h-0 w-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-surface-900 dark:border-t-surface-700" />
                </div>
              )}
              <div
                className="absolute bottom-0 left-0 right-0 rounded-t-md transition-all duration-300 ease-out"
                style={{
                  height: `${barHeight}%`,
                  minHeight: '4px',
                  backgroundColor: color,
                  opacity: isHovered ? 1 : 0.75 + (index / data.length) * 0.2,
                  transform: isHovered ? 'scaleY(1.03)' : 'scaleY(1)',
                  transformOrigin: 'bottom',
                  boxShadow: isHovered ? '0 0 12px rgba(34, 197, 94, 0.5)' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 mt-2 border-t border-surface-200 dark:border-surface-700 pt-2">
        {data.map((point, index) => (
          <div key={index} className="flex-1 text-center">
            <span className={`text-xs transition-colors ${
              hoveredIndex === index
                ? 'text-success-500 font-medium'
                : 'text-surface-400'
            }`}>{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
