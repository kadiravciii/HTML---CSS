import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Chart } from './components/Chart';
import { BacktestControls } from './components/BacktestControls';
import { fetchSymbols } from './services/binanceApi';
import { takeScreenshot } from './utils/screenshot';
import { IChartApi } from 'lightweight-charts';
import { useBacktest } from './hooks/useBacktest';

function App() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [interval, setInterval] = useState('1h');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const chartRef = useRef<IChartApi | null>(null);

  const {
    chartData,
    visibleDataPoints,
    isPlaying,
    playbackSpeed,
    isLoading,
    loadChartData,
    handlePlayPause,
    handleSpeedChange
  } = useBacktest({
    selectedSymbol,
    interval
  });

  useEffect(() => {
    const loadSymbols = async () => {
      const availableSymbols = await fetchSymbols();
      setSymbols(availableSymbols);
      if (availableSymbols.length > 0) {
        setSelectedSymbol(availableSymbols[0]);
      }
    };
    loadSymbols();
  }, []);

  useEffect(() => {
    if (selectedSymbol) {
      loadChartData();
    }
  }, [selectedSymbol, interval]);

  const handleScreenshot = async () => {
    if (chartRef.current) {
      await takeScreenshot(chartRef.current);
    }
  };

  const handleChartReady = (chart: IChartApi) => {
    chartRef.current = chart;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Select Coin</label>
            <select
              className="w-full p-2 bg-gray-800 rounded"
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
            >
              {symbols.map((symbol) => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2">Interval</label>
            <select
              className="w-full p-2 bg-gray-800 rounded"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
            >
              <option value="1s">1 Second</option>
              <option value="1h">1 Hour</option>
              <option value="3h">3 Hours</option>
            </select>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <input
              type="datetime-local"
              className="w-full p-2 bg-gray-800 rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate || new Date().toISOString().slice(0, 16)}
            />
          </div>
          
          <div>
            <label className="block mb-2">End Date</label>
            <input
              type="datetime-local"
              className="w-full p-2 bg-gray-800 rounded"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              max={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <BacktestControls
          isPlaying={isPlaying}
          playbackSpeed={playbackSpeed}
          onPlayPause={() => handlePlayPause(startDate, endDate)}
          onSpeedChange={handleSpeedChange}
          onScreenshot={handleScreenshot}
        />

        <div className="bg-gray-800 p-4 rounded-lg">
          {isLoading ? (
            <div className="h-[500px] flex items-center justify-center">
              Loading...
            </div>
          ) : (
            <Chart 
              data={chartData} 
              interval={interval}
              visibleDataPoints={visibleDataPoints}
              onChartReady={handleChartReady}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;