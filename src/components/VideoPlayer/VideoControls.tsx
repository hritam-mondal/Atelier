import { Play, Pause, SkipForward, SkipBack, Maximize, Minimize, PictureInPicture2 } from 'lucide-react';
import { VolumeControl } from './VolumeControl';
import { SpeedSelector } from './SpeedSelector';
import { QualitySelector } from './QualitySelector';
import { ProgressBar } from './ProgressBar';
import { Tooltip } from '../shared/Tooltip';
import { formatTime } from '../../utils/formatTime';
import type { VideoPlayerControls } from '../../types/course';

interface VideoControlsProps {
  controls: VideoPlayerControls;
  lectureTitle: string;
}

export function VideoControls({ controls, lectureTitle }: VideoControlsProps) {
  const {
    isPlaying, duration, currentTime, bufferedPercent,
    volume, isMuted, playbackRate, isFullscreen, isPiP,
    togglePlay, seek, setVolume, toggleMute,
    setPlaybackRate, toggleFullscreen, togglePiP,
    skipForward, skipBackward,
  } = controls;

  return (
    <div
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)',
      }}
    >
      {/* Progress bar */}
      <div className="px-2">
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          bufferedPercent={bufferedPercent}
          onSeek={seek}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-1 px-3 pb-2">
        {/* Skip back */}
        <Tooltip content="Skip back 10s (J)" position="top">
          <button
            onClick={() => skipBackward(10)}
            className="p-1.5 rounded text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none transition-colors"
            aria-label="Skip back 10 seconds"
          >
            <SkipBack size={18} aria-hidden="true" />
          </button>
        </Tooltip>

        {/* Play/Pause */}
        <Tooltip content={isPlaying ? 'Pause (Space)' : 'Play (Space)'} position="top">
          <button
            onClick={togglePlay}
            className="p-1.5 rounded text-white hover:text-violet-400 focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause size={20} aria-hidden="true" className="fill-current" />
              : <Play size={20} aria-hidden="true" className="fill-current" />
            }
          </button>
        </Tooltip>

        {/* Skip forward */}
        <Tooltip content="Skip forward 10s (L)" position="top">
          <button
            onClick={() => skipForward(10)}
            className="p-1.5 rounded text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none transition-colors"
            aria-label="Skip forward 10 seconds"
          >
            <SkipForward size={18} aria-hidden="true" />
          </button>
        </Tooltip>

        {/* Volume */}
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />

        {/* Time display */}
        <span className="text-xs tabular-nums text-gray-300 ml-1 select-none">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        {/* Title (middle) */}
        <span className="flex-1 text-center text-sm font-medium text-gray-200 truncate px-4 hidden sm:block">
          {lectureTitle}
        </span>

        {/* Right controls */}
        <div className="flex items-center gap-1 ml-auto">
          <SpeedSelector currentSpeed={playbackRate} onSpeedChange={setPlaybackRate} />

          <QualitySelector />

          <Tooltip content={isPiP ? 'Exit Picture-in-Picture (P)' : 'Picture-in-Picture (P)'} position="top">
            <button
              onClick={togglePiP}
              className={`p-1 rounded focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none transition-colors ${isPiP ? 'text-violet-400' : 'text-gray-300 hover:text-white'}`}
              aria-label={isPiP ? 'Exit Picture-in-Picture' : 'Enter Picture-in-Picture'}
            >
              <PictureInPicture2 size={18} aria-hidden="true" />
            </button>
          </Tooltip>

          <Tooltip content={isFullscreen ? 'Exit fullscreen (F)' : 'Fullscreen (F)'} position="top">
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded text-gray-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen
                ? <Minimize size={18} aria-hidden="true" />
                : <Maximize size={18} aria-hidden="true" />
              }
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
