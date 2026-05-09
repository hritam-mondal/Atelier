/**
 * Lightweight bridge so components rendered outside the <VideoPlayer/>
 * (the player sidebar tabs, in-player keyboard shortcuts, etc.) can
 * issue seek and pause commands without lifting the entire player state.
 *
 * VideoPlayer registers its handlers on mount; consumers call seek/pause.
 */

type Handlers = {
  seek: (seconds: number) => void;
  pause: () => void;
  play: () => void;
  togglePlay: () => void;
};

let registered: Partial<Handlers> = {};

export function registerPlayer(handlers: Handlers) {
  registered = handlers;
  return () => { registered = {}; };
}

export const playerBridge = {
  seek: (s: number) => registered.seek?.(s),
  pause: () => registered.pause?.(),
  play: () => registered.play?.(),
  togglePlay: () => registered.togglePlay?.(),
};
