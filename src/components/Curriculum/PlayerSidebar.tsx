import { useState } from 'react';
import { ListVideo, FileText, Bookmark as BookmarkIcon, MessageSquare, Subtitles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CurriculumPanel } from './CurriculumPanel';
import { NotesPanel } from '../VideoPlayer/Notes/NotesPanel';
import { BookmarksList } from '../VideoPlayer/Bookmarks/BookmarksList';
import { TranscriptPanel } from '../VideoPlayer/Transcript/TranscriptPanel';
import { QAPanel } from '../QA/QAPanel';

type Tab = 'curriculum' | 'notes' | 'bookmarks' | 'transcript' | 'qa';

interface TabSpec {
  key: Tab;
  label: string;
  icon: LucideIcon;
}

const TABS: TabSpec[] = [
  { key: 'curriculum', label: 'Curriculum', icon: ListVideo },
  { key: 'notes',      label: 'Notes',      icon: FileText },
  { key: 'bookmarks',  label: 'Marks',      icon: BookmarkIcon },
  { key: 'transcript', label: 'Transcript', icon: Subtitles },
  { key: 'qa',         label: 'Q&A',        icon: MessageSquare },
];

interface Props {
  currentTime: number;
  onSeek: (timestamp: number) => void;
  onPause?: () => void;
  externalTab?: Tab;
}

export function PlayerSidebar({ currentTime, onSeek, onPause, externalTab }: Props) {
  const [active, setActive] = useState<Tab>(externalTab ?? 'curriculum');
  const tab = externalTab ?? active;

  return (
    <div className="flex flex-col h-full">
      <div
        role="tablist"
        aria-label="Player content"
        className="flex items-center gap-1 px-2 py-1 border-b shrink-0 overflow-x-auto"
        style={{ borderColor: 'rgba(236,230,216,0.10)' }}
      >
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={isActive}
              aria-controls={`player-tab-${t.key}`}
              onClick={() => setActive(t.key)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap"
              style={{
                color: isActive ? '#ece6d8' : '#b8b3a7',
                backgroundColor: isActive ? 'rgba(236,230,216,0.10)' : 'transparent',
              }}
            >
              <Icon size={12} aria-hidden />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'curriculum' && (
          <div role="tabpanel" id="player-tab-curriculum" className="h-full overflow-hidden">
            <CurriculumPanel />
          </div>
        )}
        {tab === 'notes' && (
          <div role="tabpanel" id="player-tab-notes" className="h-full">
            <NotesPanel currentTime={currentTime} onSeek={onSeek} onPause={onPause} />
          </div>
        )}
        {tab === 'bookmarks' && (
          <div role="tabpanel" id="player-tab-bookmarks" className="h-full overflow-y-auto p-4">
            <BookmarksList onSeek={onSeek} />
          </div>
        )}
        {tab === 'transcript' && (
          <div role="tabpanel" id="player-tab-transcript" className="h-full">
            <TranscriptPanel currentTime={currentTime} onSeek={onSeek} />
          </div>
        )}
        {tab === 'qa' && (
          <div role="tabpanel" id="player-tab-qa" className="h-full">
            <QAPanel />
          </div>
        )}
      </div>
    </div>
  );
}
