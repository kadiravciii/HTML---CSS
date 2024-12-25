import { useState, useRef, useEffect } from 'react';
import { fetchKlines } from '../services/binanceApi';

interface UseBacktestProps {
  selectedSymbol: string;
  interval: string;
}

export const useBacktest = ({ selectedSymbol, interval }: UseBacktestProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [visibleDataPoints, setVisibleDataPoints] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const pausedPointRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  const loadChartData = async (start?: number, end?: number) => {
    setIsLoading(true);
    try {
      const data = await fetchKlines(selectedSymbol, interval, start, end);
      setChartData(data);
      // Only reset visible points if we're loading new data, not during backtest
      if (!start && !end) {
        setVisibleDataPoints(data.length);
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
    setIsLoading(false);
  };

  const handleBacktest = async (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    try {
      await loadChartData(start, end);
      // Resume from pause point or start from beginning
      setVisibleDataPoints(isPlaying ? pausedPointRef.current : 0);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error running backtest:', error);
    }
  };

  const handlePlayPause = (startDate: string, endDate: string) => {
    if (!isPlaying) {
      if (visibleDataPoints === 0 || visibleDataPoints === chartData.length) {
        handleBacktest(startDate, endDate);
      } else {
        setIsPlaying(true);
      }
    } else {
      pausedPointRef.current = visibleDataPoints;
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
    // Don't reset the chart, just update the speed
  };

  useEffect(() => {
    // Animation loop
    const animate = (timestamp: number) => {
      let lastUpdate = 0;
      
      if (isPlaying && visibleDataPoints < chartData.length) {
        const delay = 100 / playbackSpeed;
        
        if (timestamp - lastUpdate >= delay) {
          setVisibleDataPoints(prev => Math.min(prev + 1, chartData.length));
          lastUpdate = timestamp;
        }
        
        animationFrameRef.current = requestAnimationFrame(animate);
      } else if (visibleDataPoints >= chartData.length) {
        setIsPlaying(false);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, visibleDataPoints, chartData.length, playbackSpeed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    chartData,
    visibleDataPoints,
    isPlaying,
    playbackSpeed,
    isLoading,
    loadChartData,
    handlePlayPause,
    handleSpeedChange
  };
};