export interface Note {
  id: string;
  lectureId: string;
  courseId: string;
  timestamp: number;     // seconds
  body: string;          // markdown
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface Bookmark {
  id: string;
  lectureId: string;
  courseId: string;
  timestamp: number;
  label?: string;
  createdAt: string;
}

export interface TranscriptCue {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface CaptionsTrack {
  language: string;
  label: string;
  cues: TranscriptCue[];
}

export type NoteSort = 'recent' | 'oldest' | 'timestamp';
export type NoteScope = 'all' | 'lecture' | 'course';
