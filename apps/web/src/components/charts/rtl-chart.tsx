'use client';

import { useLocale } from 'next-intl';
import { useEffect, useRef } from 'react';

interface RTLChartProps {
  children: React.ReactNode;
  className?: string;
}

export function RTLChart({ children, className = '' }: RTLChartProps) {
  const locale = useLocale();
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && locale === 'ar') {
      // Apply RTL-specific chart styles
      const chartElement = chartRef.current;
      chartElement.style.direction = 'ltr'; // Keep charts in LTR for proper rendering
      
      // Mirror chart axes labels for RTL
      const axisLabels = chartElement.querySelectorAll('[class*="recharts-cartesian-axis-tick-value"]');
      axisLabels.forEach((label) => {
        (label as HTMLElement).style.textAnchor = 'start';
        (label as HTMLElement).style.direction = 'ltr';
      });

      // Mirror chart legends for RTL
      const legends = chartElement.querySelectorAll('[class*="recharts-legend"]');
      legends.forEach((legend) => {
        (legend as HTMLElement).style.direction = 'rtl';
        (legend as HTMLElement).style.textAlign = 'right';
      });

      // Mirror chart tooltips for RTL
      const tooltips = chartElement.querySelectorAll('[class*="recharts-tooltip"]');
      tooltips.forEach((tooltip) => {
        (tooltip as HTMLElement).style.direction = 'rtl';
        (tooltip as HTMLElement).style.textAlign = 'right';
      });
    }
  }, [locale]);

  return (
    <div 
      ref={chartRef}
      className={`rtl-chart ${className}`}
      style={{ direction: locale === 'ar' ? 'ltr' : 'ltr' }}
    >
      {children}
    </div>
  );
}
