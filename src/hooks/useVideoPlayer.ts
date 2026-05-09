import { useState, useEffect, useCallback, useRef } from 'react';
import type { RefObject } from 'react';
import type { VideoPlayerControls } from '../types/course';
import { useCourse } from '../context/CourseContext';

export function useVideoPlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
  containerRef?: RefObject<HTMLElement | null>
): VideoPlayerControls {
  const { state, dispatch, getNextLecture } = useCourse();

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  // Use refs for values read inside stable callbacks to avoid re-attaching listeners
  const activeLectureIdRef = useRef(state.activeLectureId);
  const watchedSecondsRef = useRef(state.watchedSeconds);
  const autoPlayNextRef = useRef(state.autoPlayNext);

  useEffect(() => { activeLectureIdRef.current = state.activeLectureId; }, [state.activeLectureId]);
  useEffect(() => { watchedSecondsRef.current = state.watchedSeconds; }, [state.watchedSeconds]);
  useEffect(() => { autoPlayNextRef.current = state.autoPlayNext; }, [state.autoPlayNext]);

  // Attach video DOM event listeners — stable: only re-runs when the lecture changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onLoadedMetadata = () => {
      setDuration(video.duration);
      const saved = watchedSecondsRef.current[activeLectureIdRef.current];
      if (saved && saved > 0 && saved < video.duration - 2) {
        video.currentTime = saved;
      }
    };

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      dispatch({ type: 'UPDATE_CURRENT_TIME', time: video.currentTime });
      if (Math.floor(video.currentTime) % 5 === 0 && video.currentTime > 0) {
        dispatch({
          type: 'SET_WATCHED_SECONDS',
          lectureId: activeLectureIdRef.current,
          seconds: video.currentTime,
        });
      }
    };

    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      dispatch({ type: 'MARK_COMPLETE', lectureId: activeLectureIdRef.current });
      if (autoPlayNextRef.current) {
        const next = getNextLecture();
        if (next) dispatch({ type: 'SET_ACTIVE_LECTURE', lectureId: next.id });
      }
    };

    const onVolumeChange = () => {
      setVolumeState(video.volume);
      setIsMuted(video.muted);
    };

    const onRateChange = () => setPlaybackRateState(video.playbackRate);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('progress', onProgress);
    video.addEventListener('ended', onEnded);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('ratechange', onRateChange);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('progress', onProgress);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('ratechange', onRateChange);
    };
    // Only re-run when the lecture changes (new video element via key=) or dispatch/getNextLecture change
  }, [videoRef, state.activeLectureId, dispatch, getNextLecture]);

  // Fullscreen detection
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // PiP detection
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnterPiP = () => setIsPiP(true);
    const onLeavePiP = () => setIsPiP(false);
    video.addEventListener('enterpictureinpicture', onEnterPiP);
    video.addEventListener('leavepictureinpicture', onLeavePiP);
    return () => {
      video.removeEventListener('enterpictureinpicture', onEnterPiP);
      video.removeEventListener('leavepictureinpicture', onLeavePiP);
    };
  }, [videoRef, state.activeLectureId]);

  // Flush current position on tab hide / page close
  useEffect(() => {
    const flush = () => {
      const video = videoRef.current;
      if (!video) return;
      dispatch({
        type: 'SET_WATCHED_SECONDS',
        lectureId: activeLectureIdRef.current,
        seconds: video.currentTime,
      });
    };
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('beforeunload', flush);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('beforeunload', flush);
    };
  }, [videoRef, dispatch]);

  const play = useCallback(() => {
    videoRef.current?.play().catch(console.warn);
  }, [videoRef]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused || video.ended) {
      video.play().catch(console.warn);
    } else {
      video.pause();
    }
  }, [videoRef]);

  const seek = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(seconds, video.duration || 0));
  }, [videoRef]);

  const setVolume = useCallback((v: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = Math.max(0, Math.min(1, v));
    if (v > 0) video.muted = false;
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, [videoRef]);

  const setPlaybackRate = useCallback((r: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = r;
  }, [videoRef]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef?.current ?? videoRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(console.warn);
    } else {
      document.exitFullscreen().catch(console.warn);
    }
  }, [containerRef, videoRef]);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture().catch(console.warn);
    } else {
      await video.requestPictureInPicture().catch(console.warn);
    }
  }, [videoRef]);

  const skipForward = useCallback((sec = 10) => {
    const video = videoRef.current;
    if (!video) return;
    seek(video.currentTime + sec);
  }, [seek, videoRef]);

  const skipBackward = useCallback((sec = 10) => {
    const video = videoRef.current;
    if (!video) return;
    seek(video.currentTime - sec);
  }, [seek, videoRef]);

  return {
    isPlaying,
    duration,
    currentTime,
    buffered,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    isPiP,
    progressPercent,
    bufferedPercent,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    togglePiP,
    skipForward,
    skipBackward,
  };
}
