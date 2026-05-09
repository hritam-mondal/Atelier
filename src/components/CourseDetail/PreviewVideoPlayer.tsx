import { useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface Props {
  videoUrl: string;
  thumbnail: string;
  rounded?: boolean;
}

export function PreviewVideoPlayer({ videoUrl, thumbnail, rounded }: Props) {
  const [started, setStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const start = () => {
    setStarted(true);
    queueMicrotask(() => {
      videoRef.current?.play().catch(() => { /* user can press play manually */ });
    });
  };

  return (
    <div className={`relative w-full aspect-video bg-black overflow-hidden ${rounded ? 'rounded-t-xl' : ''}`}>
      {!started ? (
        <button
          type="button"
          onClick={start}
          className="absolute inset-0 group cursor-pointer"
          aria-label="Play preview video"
        >
          <img
            src={thumbnail}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform mb-2">
              <Play size={28} className="text-gray-900 fill-gray-900 ml-1" />
            </div>
            <span className="text-white text-sm font-semibold drop-shadow">Preview this course</span>
          </div>
        </button>
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          playsInline
          className="w-full h-full object-cover bg-black"
        />
      )}
    </div>
  );
}
