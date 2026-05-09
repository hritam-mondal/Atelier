import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Pause, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { useCourse } from '../../../context/CourseContext';
import { getTranscriptFor } from '../../../data/mockTranscripts';
import { formatTime } from '../../../utils/formatTime';

interface Props {
  currentTime: number;
  onSeek: (timestamp: number) => void;
}

export function TranscriptPanel({ currentTime, onSeek }: Props) {
  const { state, course, getLectureById } = useCourse();
  const cues = getTranscriptFor(state.activeLectureId);
  const lecture = getLectureById(state.activeLectureId);
  const [query, setQuery] = useState('');
  const [matchIdx, setMatchIdx] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeCueIdx = useMemo(
    () => cues.findIndex(c => currentTime >= c.start && currentTime < c.end),
    [cues, currentTime]
  );

  const matches = useMemo(() => {
    if (!query.trim()) return [] as number[];
    const q = query.toLowerCase();
    return cues.map((c, i) => (c.text.toLowerCase().includes(q) ? i : -1)).filter(i => i >= 0);
  }, [cues, query]);

  // Auto-scroll active cue into view
  useEffect(() => {
    if (!autoScroll || activeCueIdx < 0) return;
    const el = containerRef.current?.querySelector(`[data-cue-index="${activeCueIdx}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [activeCueIdx, autoScroll]);

  const goToMatch = (delta: 1 | -1) => {
    if (matches.length === 0) return;
    const next = (matchIdx + delta + matches.length) % matches.length;
    setMatchIdx(next);
    const cueIdx = matches[next];
    const el = containerRef.current?.querySelector(`[data-cue-index="${cueIdx}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const downloadTranscript = () => {
    const text = cues.map(c => `[${formatTime(c.start)}] ${c.speaker ? c.speaker + ': ' : ''}${c.text}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${course.title.replace(/\s+/g, '-').toLowerCase()}-${state.activeLectureId}-transcript.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(236,230,216,0.10)' }}>
        <p className="text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: '#b8b3a7' }}>
          {lecture?.title ?? 'Transcript'}
        </p>

        <div className="relative mb-2">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#8a857a' }} aria-hidden />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setMatchIdx(0); }}
            placeholder="Search transcript"
            className="w-full pl-7 pr-20 py-1.5 rounded text-xs bg-transparent outline-none"
            style={{ border: '1px solid rgba(236,230,216,0.10)', color: '#ece6d8' }}
            aria-label="Search transcript"
          />
          {matches.length > 0 && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px]" style={{ color: '#b8b3a7' }}>
              <span className="font-mono">{matchIdx + 1}/{matches.length}</span>
              <button onClick={() => goToMatch(-1)} aria-label="Previous match" className="rounded p-0.5 hover:opacity-70">
                <ChevronUp size={10} />
              </button>
              <button onClick={() => goToMatch(1)} aria-label="Next match" className="rounded p-0.5 hover:opacity-70">
                <ChevronDown size={10} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-[10px]" style={{ color: '#8a857a' }}>
          <button
            onClick={() => setAutoScroll(s => !s)}
            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity"
            aria-pressed={autoScroll}
            style={{ color: autoScroll ? '#ece6d8' : '#8a857a' }}
          >
            <Pause size={10} aria-hidden /> {autoScroll ? 'Auto-scroll on' : 'Auto-scroll off'}
          </button>
          <button
            onClick={downloadTranscript}
            className="inline-flex items-center gap-1 hover:opacity-70 transition-opacity ml-auto"
            aria-label="Download transcript"
          >
            <Download size={10} aria-hidden /> Download
          </button>
        </div>
      </div>

      {/* Cues */}
      <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {cues.map((cue, i) => {
          const active = i === activeCueIdx;
          const matchedQuery = query.trim() && cue.text.toLowerCase().includes(query.toLowerCase());
          return (
            <button
              key={i}
              data-cue-index={i}
              onClick={() => onSeek(cue.start)}
              className="w-full text-left flex gap-3 px-2 py-1.5 rounded transition-colors"
              style={{
                borderLeft: active ? '2px solid #ece6d8' : '2px solid transparent',
                backgroundColor: active ? 'rgba(236,230,216,0.06)' : matchedQuery ? 'rgba(216,197,148,0.08)' : 'transparent',
              }}
              aria-current={active ? 'true' : undefined}
            >
              <span
                className="shrink-0 font-mono text-[10px] tabular-nums mt-0.5"
                style={{ color: active ? '#ece6d8' : '#8a857a' }}
              >
                {formatTime(cue.start)}
              </span>
              <span
                className="text-xs leading-relaxed"
                style={{ color: active ? '#ece6d8' : '#b8b3a7' }}
              >
                {cue.speaker && (
                  <span className="font-semibold" style={{ color: active ? '#ece6d8' : '#b8b3a7' }}>
                    {cue.speaker}:{' '}
                  </span>
                )}
                {cue.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
