import { useEffect, useState, useCallback } from 'react';
import type { Bookmark } from '../types/notes';

const STORAGE_KEY = 'bookmarks-v1';

function readAll(): Bookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function writeAll(b: Bookmark[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(b)); } catch { /* noop */ }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => readAll());
  useEffect(() => { writeAll(bookmarks); }, [bookmarks]);

  const toggle = useCallback((courseId: string, lectureId: string, timestamp: number, label?: string) => {
    setBookmarks(prev => {
      // Toggle within ~1 second of an existing bookmark
      const existing = prev.find(b => b.lectureId === lectureId && Math.abs(b.timestamp - timestamp) < 1.5);
      if (existing) return prev.filter(b => b.id !== existing.id);
      return [
        {
          id: `bm_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
          courseId, lectureId, timestamp, label,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateLabel = useCallback((id: string, label: string) => {
    setBookmarks(prev => prev.map(b => b.id === id ? { ...b, label } : b));
  }, []);

  return { bookmarks, toggle, remove, updateLabel };
}
