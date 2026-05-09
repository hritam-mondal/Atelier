import { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';

interface VideoOverlayProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  shortcutHint?: string;
}

export function VideoOverlay({ isPlaying, onTogglePlay, shortcutHint }: VideoOverlayProps) {
  const flashTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  return (
    <>
      {/* Centre click-to-toggle area — does NOT cover the control bar (bottom 64px) */}
      <div
        className="absolute inset-x-0 top-0 cursor-pointer"
        style={{ bottom: 64, zIndex: 10 }}
        onClick={onTogglePlay}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
        role="button"
        tabIndex={-1}
      >
        {/* Big centred play icon when paused */}
        {!isPlaying && (
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 72,
                height: 72,
                backgroundColor: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                border: '2px solid rgba(255,255,255,0.25)',
              }}
            >
              <Play
                size={32}
                aria-hidden="true"
                style={{ fill: 'white', color: 'white', marginLeft: 4 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Keyboard shortcut toast */}
      {shortcutHint && (
        <div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none select-none"
          style={{ bottom: 80, zIndex: 40 }}
        >
          <div className="bg-black/80 text-white text-sm font-medium rounded px-3 py-1.5 whitespace-nowrap">
            {shortcutHint}
          </div>
        </div>
      )}
    </>
  );
}
