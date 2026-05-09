import { useRef, useState, useCallback, useEffect } from 'react';
import { formatTime } from '../../utils/formatTime';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  bufferedPercent: number;
  onSeek: (seconds: number) => void;
}

export function ProgressBar({ currentTime, duration, bufferedPercent, onSeek }: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const thumbnailRef = useRef<HTMLCanvasElement>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const getTimeFromX = useCallback(
    (clientX: number): number => {
      const track = trackRef.current;
      if (!track || !duration) return 0;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return ratio * duration;
    },
    [duration]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      setHoverTime(getTimeFromX(e.clientX));
      if (isDragging) onSeek(getTimeFromX(e.clientX));
    },
    [isDragging, getTimeFromX, onSeek]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      onSeek(getTimeFromX(e.clientX));
    },
    [getTimeFromX, onSeek]
  );

  // Touch support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      setIsDragging(true);
      onSeek(getTimeFromX(touch.clientX));
    },
    [getTimeFromX, onSeek]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      onSeek(getTimeFromX(touch.clientX));
    },
    [isDragging, getTimeFromX, onSeek]
  );

  // Global mouse events for drag
  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => onSeek(getTimeFromX(e.clientX));
    const onMouseUp = () => setIsDragging(false);
    const onTouchEnd = () => setIsDragging(false);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging, getTimeFromX, onSeek]);

  const hoverPercent = duration > 0 && hoverX !== null
    ? (hoverTime / duration) * 100
    : null;

  return (
    <div
      className="relative w-full group/pb cursor-pointer select-none px-0"
      style={{ paddingTop: 8, paddingBottom: 8 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setHoverX(null); }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="relative w-full overflow-hidden rounded-full"
        style={{
          height: isHovering || isDragging ? 8 : 4,
          backgroundColor: 'rgba(236,230,216,0.10)',
          transition: 'height 0.15s ease',
        }}
        role="slider"
        aria-label="Video progress"
        aria-valuenow={Math.round(currentTime)}
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        tabIndex={0}
      >
        {/* Buffered */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            width: `${bufferedPercent}%`,
            backgroundColor: 'rgba(236,230,216,0.3)',
          }}
        />
        {/* Progress */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${progressPercent}%`, backgroundColor: '#d6cfbe' }}
        />
      </div>

      {/* Hover scrubber thumb */}
      {(isHovering || isDragging) && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            left: `${progressPercent}%`,
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: '#d6cfbe',
            boxShadow: '0 0 0 2px rgba(236,230,216,0.4)',
          }}
        />
      )}

      {/* Hover time tooltip */}
      {isHovering && hoverX !== null && hoverPercent !== null && (
        <div
          className="absolute -top-8 pointer-events-none z-20"
          style={{
            left: hoverX,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-gray-900 text-white text-xs rounded px-1.5 py-0.5 whitespace-nowrap border border-gray-700">
            {formatTime(hoverTime)}
          </div>
        </div>
      )}

      {/* Hidden canvas for thumbnail (not rendered, just available for capture) */}
      <canvas ref={thumbnailRef} className="hidden" width={120} height={67} />
    </div>
  );
}
