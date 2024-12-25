import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { takeScreenshot } from '../utils/screenshot';

interface ChartProps {
  data: any[];
  interval: string;
  visibleDataPoints: number;
  onChartReady: (chart: IChartApi) => void;
}

export const Chart: React.FC<ChartProps> = ({ 
  data, 
  interval, 
  visibleDataPoints,
  onChartReady 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B2B' },
        horzLines: { color: '#2B2B2B' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });

    seriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Notify parent component that chart is ready
    onChartReady(chartRef.current);

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [onChartReady]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      const visibleData = data.slice(0, visibleDataPoints);
      seriesRef.current.setData(visibleData);
      
      if (visibleData.length > 0) {
        chartRef.current?.timeScale().fitContent();
      }
    }
  }, [data, visibleDataPoints]);

  return <div ref={chartContainerRef} className="w-full" />;
};