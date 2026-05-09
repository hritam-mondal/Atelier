import { useState, useRef } from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { Tooltip } from '../shared/Tooltip';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({ volume, isMuted, onVolumeChange, onToggleMute }: VolumeControlProps) {
  const [showSlider, setShowSlider] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const effectiveVolume = isMuted ? 0 : volume;

  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  const show = () => {
    clearTimeout(hideTimer.current);
    setShowSlider(true);
  };
  const hide = () => {
    hideTimer.current = setTimeout(() => setShowSlider(false), 300);
  };

  return (
    <div
      className="relative flex items-center gap-1"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <Tooltip content={isMuted ? 'Unmute (M)' : 'Mute (M)'} position="top">
        <button
          onClick={onToggleMute}
          className="p-1 rounded text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <VolumeIcon size={18} aria-hidden="true" />
        </button>
      </Tooltip>

      {/* Horizontal slider */}
      <div
        className={`
          flex items-center overflow-hidden transition-all duration-200
          ${showSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'}
        `}
      >
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={effectiveVolume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-full h-1 accent-violet-500 cursor-pointer"
          aria-label="Volume"
          aria-valuenow={Math.round(effectiveVolume * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {showSlider && (
        <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
          {Math.round(effectiveVolume * 100)}%
        </span>
      )}
    </div>
  );
}
