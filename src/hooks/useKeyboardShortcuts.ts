import { useEffect, useCallback } from 'react';
import type { VideoPlayerControls } from '../types/cource';

interface UseKeyboardShortcutsOptions {
  controls: VideoPlayerControls;
  onShortcut?: (hint: string) => void;
}

export function useKeyboardShortcuts({ controls, onShortcut }: UseKeyboardShortcutsOptions) {
  const isInputActive = useCallback(() => {
    const tag = document.activeElement?.tagName;
    const isEditable = (document.activeElement as HTMLElement)?.isContentEditable;
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || isEditable;
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isInputActive()) return;

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          controls.togglePlay();
          onShortcut?.(controls.isPlaying ? 'Pause' : 'Play');
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          e.preventDefault();
          controls.skipForward(10);
          onShortcut?.('+10s →');
          break;
        case 'ArrowLeft':
        case 'j':
        case 'J':
          e.preventDefault();
          controls.skipBackward(10);
          onShortcut?.('←  -10s');
          break;
        case 'ArrowUp':
          e.preventDefault();
          controls.setVolume(Math.min(1, controls.volume + 0.1));
          onShortcut?.(`Volume ${Math.round(Math.min(1, controls.volume + 0.1) * 100)}%`);
          break;
        case 'ArrowDown':
          e.preventDefault();
          controls.setVolume(Math.max(0, controls.volume - 0.1));
          onShortcut?.(`Volume ${Math.round(Math.max(0, controls.volume - 0.1) * 100)}%`);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          controls.toggleMute();
          onShortcut?.(controls.isMuted ? 'Unmuted' : 'Muted');
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          controls.toggleFullscreen();
          onShortcut?.(controls.isFullscreen ? 'Exit Fullscreen' : 'Fullscreen');
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          controls.togglePiP();
          onShortcut?.(controls.isPiP ? 'Exit PiP' : 'Picture-in-Picture');
          break;
        default:
          // 0–9 seek to 0%–90%
          if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            const pct = parseInt(e.key) * 10;
            controls.seek((controls.duration * pct) / 100);
            onShortcut?.(`Seek ${pct}%`);
          }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [controls, isInputActive, onShortcut]);
}
