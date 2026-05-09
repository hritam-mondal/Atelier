import { useRef, useState, useEffect, useCallback } from 'react';
import { useCourse } from '../../context/CourseContext';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useBookmarks } from '../../hooks/useBookmarks';
import { registerPlayer } from '../../hooks/playerBridge';
import { VideoControls } from './VideoControls';
import { VideoOverlay } from './VideoOverlay';
import { Loader2 } from 'lucide-react';

const AUTO_PLAY_COUNTDOWN = 5;

export function VideoPlayer() {
  const { state, dispatch, getNextLecture, getLectureById } = useCourse();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [shortcutHint, setShortcutHint] = useState<string | undefined>();
  const [countdownState, setCountdownState] = useState<{
    show: boolean; secs: number; title: string;
  }>({ show: false, secs: AUTO_PLAY_COUNTDOWN, title: '' });

  const hintTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const controls = useVideoPlayer(videoRef, containerRef);
  const activeLecture = getLectureById(state.activeLectureId);
  const { toggle: toggleBookmark, bookmarks } = useBookmarks();

  // Register seek/pause/play handlers for the rest of the app (sidebar tabs, etc.)
  useEffect(() => {
    return registerPlayer({
      seek: controls.seek,
      pause: controls.pause,
      play: controls.play,
      togglePlay: controls.togglePlay,
    });
  }, [controls.seek, controls.pause, controls.play, controls.togglePlay]);

  // Bookmark markers for the active lecture
  const lectureBookmarks = bookmarks.filter(b => b.lectureId === state.activeLectureId);

  // N / B / T / C shortcuts (notes/bookmarks/transcript/captions). 'B' toggles bookmark; others bubble up to sidebar via custom events.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === 'b') {
        e.preventDefault();
        toggleBookmark(state.activeLectureId.split('-')[0] /* coarse courseId */ || 'course-001', state.activeLectureId, controls.currentTime);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggleBookmark, state.activeLectureId, controls.currentTime]);

  // â”€â”€ Shortcut hint toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const showHint = useCallback((hint: string) => {
    setShortcutHint(hint);
    clearTimeout(hintTimerRef.current);
    hintTimerRef.current = setTimeout(() => setShortcutHint(undefined), 800);
  }, []);

  useKeyboardShortcuts({ controls, onShortcut: showHint });

  // â”€â”€ Auto-hide controls while playing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    if (controls.isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [controls.isPlaying]);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimerRef.current);
  }, [controls.isPlaying, resetControlsTimer]);

  // â”€â”€ Auto-advance countdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const next = getNextLecture();
    if (
      !controls.isPlaying &&
      controls.duration > 0 &&
      controls.currentTime >= controls.duration - 0.5 &&
      state.autoPlayNext &&
      next
    ) {
      setCountdownState({ show: true, secs: AUTO_PLAY_COUNTDOWN, title: next.title });
    }
  }, [controls.currentTime, controls.duration, controls.isPlaying, state.autoPlayNext, getNextLecture]);

  useEffect(() => {
    if (!countdownState.show) return;
    if (countdownState.secs <= 0) {
      const next = getNextLecture();
      if (next) dispatch({ type: 'SET_ACTIVE_LECTURE', lectureId: next.id });
      setCountdownState(s => ({ ...s, show: false }));
      return;
    }
    const t = setTimeout(() => setCountdownState(s => ({ ...s, secs: s.secs - 1 })), 1000);
    return () => clearTimeout(t);
  }, [countdownState.show, countdownState.secs, getNextLecture, dispatch]);

  const cancelCountdown = () => setCountdownState(s => ({ ...s, show: false }));

  // â”€â”€ Reset on lecture change â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    setIsLoading(false);
    setCountdownState({ show: false, secs: AUTO_PLAY_COUNTDOWN, title: '' });
  }, [state.activeLectureId]);

  // â”€â”€ Computed visibility â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const controlsVisible = showControls || !controls.isPlaying;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Video player"
      className="relative w-full bg-black select-none"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={resetControlsTimer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { if (controls.isPlaying) setShowControls(false); }}
    >
      {/* â”€â”€ Native video element â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <video
        ref={videoRef}
        key={state.activeLectureId}
        src={activeLecture?.videoUrl}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: 'contain', display: 'block' }}
        onLoadStart={() => setIsLoading(true)}
        onLoadedMetadata={() => setIsLoading(false)}
        onLoadedData={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        onPlaying={() => setIsLoading(false)}
        onWaiting={() => setIsLoading(true)}
        onError={() => setIsLoading(false)}
        preload="auto"
        playsInline
      />

      {/* â”€â”€ Loading spinner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40"
          style={{ zIndex: 20, pointerEvents: 'none' }}
        >
          <Loader2 size={40} className="text-violet-400 animate-spin" aria-hidden="true" />
        </div>
      )}

      {/* â”€â”€ Centre play overlay + shortcut toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <VideoOverlay
        isPlaying={controls.isPlaying}
        onTogglePlay={controls.togglePlay}
        shortcutHint={shortcutHint}
      />

      {/* â”€â”€ Auto-advance countdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {countdownState.show && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/70"
          style={{ zIndex: 50 }}
        >
          <div className="text-center space-y-3 p-6 rounded-xl bg-gray-900/90 border border-gray-700 max-w-sm mx-4">
            <p className="text-gray-400 text-sm">Up next</p>
            <p className="text-white font-semibold text-base">{countdownState.title}</p>
            <div
              className="w-12 h-12 rounded-full border-2 border-violet-500 flex items-center justify-center text-white font-bold text-xl mx-auto"
              aria-live="polite"
              aria-label={`Starting in ${countdownState.secs} seconds`}
            >
              {countdownState.secs}
            </div>
            <button
              onClick={cancelCountdown}
              className="px-4 py-1.5 rounded border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-[rgba(236,230,216,0.5)] outline-none"
              aria-label="Cancel auto-advance"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* â”€â”€ Control bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {/*
          Inline z-index: 30 (above the overlay at 10 and spinner at 20).
          pointer-events toggled so invisible controls don't swallow clicks.
      */}
      <div
        className="absolute inset-x-0 bottom-0 transition-opacity duration-200"
        style={{
          zIndex: 30,
          opacity: controlsVisible ? 1 : 0,
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <VideoControls controls={controls} lectureTitle={activeLecture?.title ?? ''} />
      </div>
    </div>
  );
}
