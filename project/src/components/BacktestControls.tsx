import React from 'react';
import { Play, Pause, Camera } from 'lucide-react';

interface BacktestControlsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onScreenshot: () => void;
}

export const BacktestControls: React.FC<BacktestControlsProps> = ({
  isPlaying,
  playbackSpeed,
  onPlayPause,
  onSpeedChange,
  onScreenshot,
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-bold text-white"
        onClick={onPlayPause}
      >
        {isPlaying ? (
          <>
            <Pause className="w-4 h-4" />
            Pause Backtest
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Run Backtest
          </>
        )}
      </button>
      
      <div className="flex items-center gap-3">
        <span className="text-white">Speed:</span>
        {[0.5, 1, 2].map((speed) => (
          <label
            key={speed}
            className="flex items-center gap-1 cursor-pointer"
          >
            <input
              type="radio"
              name="speed"
              checked={playbackSpeed === speed}
              onChange={() => onSpeedChange(speed)}
              className="text-yellow-600 focus:ring-yellow-600"
            />
            <span className="text-white">{speed}x</span>
          </label>
        ))}
      </div>

      <button
        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-bold text-white ml-auto"
        onClick={onScreenshot}
      >
        <Camera className="w-4 h-4" />
        Screenshot
      </button>
    </div>
  );
};