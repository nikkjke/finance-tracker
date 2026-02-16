import { useState } from 'react';
import type { ChartDataPoint } from '../../types';
import { categoryColors } from '../../data/mockData';

interface DonutChartProps {
  data: ChartDataPoint[];
  size?: number;
}

export default function DonutChart({ data, size = 240 }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = Object.values(categoryColors);
  let cumulativePercent = 0;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const segments = data.map((point, index) => {
    const percent = (point.value / total) * 100;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return {
      ...point,
      percent,
      startPercent,
      color: colors[index % colors.length],
    };
  });

  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  // Get the hovered segment for center display
  const hoveredSeg = hoveredIndex !== null ? segments[hoveredIndex] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative mx-auto"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 200 200"
          width={size}
          height={size}
          className="-rotate-90"
          style={{ display: 'block' }}
        >
          {segments.map((seg, i) => {
            const dashLength = (seg.percent / 100) * circumference;
            const dashOffset = -(seg.startPercent / 100) * circumference;
            const isHovered = hoveredIndex === i;
            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? 26 : 20}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-300 cursor-pointer"
                style={{
                  filter: isHovered ? 'brightness(1.15)' : 'none',
                  opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            );
          })}
        </svg>
        <div
          className="absolute z-10 text-center pointer-events-none transition-all duration-300"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {hoveredSeg ? (
            <>
              <div
                className="mx-auto mb-1 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: hoveredSeg.color }}
              />
              <p className="text-lg font-bold text-surface-900 dark:text-white sm:text-xl">
                ${hoveredSeg.value.toLocaleString()}
              </p>
              <p className="text-xs font-medium text-surface-600 dark:text-surface-300">
                {hoveredSeg.label}
              </p>
              <p className="text-[10px] text-surface-400 sm:text-xs">
                {hoveredSeg.percent.toFixed(1)}%
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-surface-900 dark:text-white sm:text-3xl">
                ${total.toLocaleString()}
              </p>
              {/* <p className="text-xs text-surface-400 sm:text-sm">Total</p> */}
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 rounded-md px-1.5 py-0.5 cursor-pointer transition-all duration-200 ${
              hoveredIndex === i
                ? 'bg-surface-100 dark:bg-surface-700/50'
                : 'hover:bg-surface-50 dark:hover:bg-surface-800/50'
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <span className="text-xs text-surface-600 dark:text-surface-400">
              {seg.label}
            </span>
            <span className="text-xs font-medium text-surface-900 dark:text-white ml-auto">
              ${seg.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
